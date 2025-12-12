export interface IDisposable {
    dispose(): void;
}

export function toDisposable(fn: () => void): IDisposable {
    return { dispose: fn };
}

export class DisposableStore implements IDisposable {
    private disposables: IDisposable[] = [];
    add<T extends IDisposable>(d: T): T { this.disposables.push(d); return d; }
    dispose(): void { while (this.disposables.length) { const d = this.disposables.pop()!; d.dispose(); } }
}

