import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import { Worker } from 'worker_threads';

type WorkerRequestBase =
  | { type: 'init'; payload: { path: string } }
  | { type: 'put'; payload: { key: string; value: string } }
  | { type: 'get'; payload: { key: string } }
  | { type: 'del'; payload: { key: string } }
  | { type: 'close' };

type WorkerRequest = WorkerRequestBase & { requestId?: string };

type WorkerResponse =
  | { type: 'ready' }
  | { type: 'result'; requestId?: string; payload?: unknown }
  | { type: 'error'; requestId?: string; error: string };

type PendingRequest = {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
  timer: NodeJS.Timeout;
};

export class LevelDbWorkerClient {
  private worker: Worker;
  private pending = new Map<string, PendingRequest>();
  private requestCounter = 0;

  constructor(worker: Worker) {
    this.worker = worker;

    this.worker.on('message', (message: WorkerResponse) => {
      if (message.type === 'ready') {
        return;
      }

      if (!message.requestId) {
        return;
      }

      const pending = this.pending.get(message.requestId);
      if (!pending) {
        return;
      }

      clearTimeout(pending.timer);
      this.pending.delete(message.requestId);

      if (message.type === 'error') {
        pending.reject(new Error(message.error));
        return;
      }

      pending.resolve(message.payload);
    });

    this.worker.on('error', (error) => {
      this.rejectAll(error);
    });

    this.worker.on('exit', (code) => {
      if (code !== 0) {
        this.rejectAll(new Error(`Worker exited with code ${code}`));
      }
    });
  }

  init(path: string, timeoutMs = 5000): Promise<void> {
    return this.request({ type: 'init', payload: { path } }, timeoutMs).then(() => undefined);
  }

  put(key: string, value: string, timeoutMs = 5000): Promise<void> {
    return this.request({ type: 'put', payload: { key, value } }, timeoutMs).then(() => undefined);
  }

  get(key: string, timeoutMs = 5000): Promise<string | null> {
    return this.request({ type: 'get', payload: { key } }, timeoutMs) as Promise<string | null>;
  }

  del(key: string, timeoutMs = 5000): Promise<void> {
    return this.request({ type: 'del', payload: { key } }, timeoutMs).then(() => undefined);
  }

  close(timeoutMs = 5000): Promise<void> {
    return this.request({ type: 'close' }, timeoutMs).then(() => undefined);
  }

  private request(message: WorkerRequestBase, timeoutMs: number): Promise<unknown> {
    const requestId = `req_${Date.now()}_${this.requestCounter++}`;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(requestId);
        reject(new Error(`Worker request timeout: ${message.type}`));
      }, timeoutMs);

      this.pending.set(requestId, { resolve, reject, timer });
      this.worker.postMessage({ ...message, requestId } as WorkerRequest);
    });
  }

  private rejectAll(error: unknown): void {
    for (const [requestId, pending] of this.pending.entries()) {
      clearTimeout(pending.timer);
      pending.reject(error);
      this.pending.delete(requestId);
    }
  }
}

export function createLevelDbWorker(workerPath: string | null): LevelDbWorkerClient | null {
  if (!workerPath) {
    return null;
  }

  const worker = new Worker(workerPath);
  return new LevelDbWorkerClient(worker);
}

function getWorkerPath(): string | null {
  const appRoot = app.isPackaged ? app.getAppPath() : process.cwd();
  const workerCandidates = [
    path.join(appRoot, 'out/src/main/worker.cjs'),
  ];
  const workerPath = workerCandidates.find((candidate) => fs.existsSync(candidate));
  if (!workerPath) {
    console.warn('Worker file not found. Tried:', workerCandidates);
  }
  return workerPath || null;
}

let levelDbWorker: LevelDbWorkerClient | null = null;

export function getLevelDbWorker(): LevelDbWorkerClient | null {
  if (!levelDbWorker) {
    levelDbWorker = createLevelDbWorker(getWorkerPath());
  }
  return levelDbWorker;
}
