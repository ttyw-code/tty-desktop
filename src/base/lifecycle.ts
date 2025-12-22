
let disposableTracker: IDisposableTracker | null = null;

export interface IDisposable {
    dispose(): void;
}

export interface IDisposableTracker {
	/**
	 * Is called on construction of a disposable.
	*/
	trackDisposable(disposable: IDisposable): void;

	/**
	 * Is called when a disposable is registered as child of another disposable (e.g. {@link DisposableStore}).
	 * If parent is `null`, the disposable is removed from its former parent.
	*/
	setParent(child: IDisposable, parent: IDisposable | null): void;

	/**
	 * Is called after a disposable is disposed.
	*/
	markAsDisposed(disposable: IDisposable): void;

	/**
	 * Indicates that the given object is a singleton which does not need to be disposed.
	*/
	markAsSingleton(disposable: IDisposable): void;
}

export function toDisposable(fn: () => void): IDisposable {
    return { dispose: fn };
}

export class DisposableStore implements IDisposable {
    private disposables: IDisposable[] = [];
    add<T extends IDisposable>(d: T): T { this.disposables.push(d); return d; }
    dispose(): void { while (this.disposables.length) { const d = this.disposables.pop()!; d.dispose(); } }
}


/**
 * Abstract base class for a {@link IDisposable disposable} object.
 *
 * Subclasses can {@linkcode _register} disposables that will be automatically cleaned up when this object is disposed of.
 */
export abstract class Disposable implements IDisposable {

	/**
	 * A disposable that does nothing when it is disposed of.
	 *
	 * TODO: This should not be a static property.
	 */
	static readonly None = Object.freeze<IDisposable>({ dispose() { } });

	protected readonly _store = new DisposableStore();

	constructor() {
		trackDisposable(this);
		setParentOfDisposable(this._store, this);
	}

	public dispose(): void {
		markAsDisposed(this);

		this._store.dispose();
	}

	/**
	 * Adds `o` to the collection of disposables managed by this object.
	 */
	protected _register<T extends IDisposable>(o: T): T {
		if ((o as unknown as Disposable) === this) {
			throw new Error('Cannot register a disposable on itself!');
		}
		return this._store.add(o);
	}
}


export function trackDisposable<T extends IDisposable>(x: T): T {
	disposableTracker?.trackDisposable(x);
	return x;
}

function setParentOfDisposable(child: IDisposable, parent: IDisposable | null): void {
	disposableTracker?.setParent(child, parent);
}

export function markAsDisposed(disposable: IDisposable): void {
	disposableTracker?.markAsDisposed(disposable);
}

