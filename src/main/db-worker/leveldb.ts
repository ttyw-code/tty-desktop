import { parentPort } from 'worker_threads';
import { ClassicLevel } from 'classic-level';

type WorkerMessage =
  | { type: 'init'; payload: { path: string }; requestId?: string }
  | { type: 'put'; payload: { key: string; value: string }; requestId?: string }
  | { type: 'get'; payload: { key: string }; requestId?: string }
  | { type: 'del'; payload: { key: string }; requestId?: string }
  | { type: 'close'; requestId?: string };

type WorkerResponse =
  | { type: 'ready' }
  | { type: 'result'; requestId?: string; payload?: unknown }
  | { type: 'error'; requestId?: string; error: string };

let db: ClassicLevel<string, string> | null = null;

function postMessage(message: WorkerResponse): void {
  if (parentPort) {
    parentPort.postMessage(message);
  }
}

async function ensureDbOpen(path: string): Promise<void> {
  if (db) return;
  db = new ClassicLevel<string, string>(path, { valueEncoding: 'utf8' });
  await db.open();
}

async function handleMessage(message: WorkerMessage): Promise<void> {
  try {
    switch (message.type) {
      case 'init':
        await ensureDbOpen(message.payload.path);
        if (message.requestId) {
          postMessage({ type: 'result', requestId: message.requestId });
        } else {
          postMessage({ type: 'ready' });
        }
        return;
      case 'put':
        if (!db) throw new Error('DB not initialized');
        await db.put(message.payload.key, message.payload.value);
        postMessage({ type: 'result', requestId: message.requestId });
        return;
      case 'get':
        if (!db) throw new Error('DB not initialized');
        try {
          const value = await db.get(message.payload.key);
          postMessage({ type: 'result', requestId: message.requestId, payload: value });
        } catch (error) {
          const err = error as { code?: string; message?: string };
          if (err.code === 'LEVEL_NOT_FOUND') {
            postMessage({ type: 'result', requestId: message.requestId, payload: null });
            return;
          }
          throw error;
        }
        return;
      case 'del':
        if (!db) throw new Error('DB not initialized');
        await db.del(message.payload.key);
        postMessage({ type: 'result', requestId: message.requestId });
        return;
      case 'close':
        if (db) {
          await db.close();
          db = null;
        }
        postMessage({ type: 'result', requestId: message.requestId });
        return;
      default:
        postMessage({ type: 'error', error: 'Unknown message type' });
    }
  } catch (error) {
    const err = error as {
      message?: string;
      code?: string;
      errno?: number;
      path?: string;
      stack?: string;
    };
    const details = {
      message: err.message,
      code: err.code,
      errno: err.errno,
      path: err.path,
      stack: err.stack,
    };
    postMessage({
      type: 'error',
      requestId: message.requestId,
      error: JSON.stringify(details),
    });
  }
}

if (parentPort) {
  parentPort.on('message', (message: WorkerMessage) => {
    void handleMessage(message);
  });
}