import { IDisposable, Disposable } from '@/base/lifecycle';
import { Event, Emitter,fromNodeEventEmitter } from '@/base/event';
import electron from 'electron';


export interface IBaseWindow extends IDisposable {

    readonly id: number;
    readonly win: electron.BrowserWindow;

    // readonly isFullScreen: boolean;
    toggleFullScreen(): void;
    //evnets
    readonly onDidClose: Event<void>;
    readonly onDidMaximize: Event<void>;
    readonly onDidUnmaximize: Event<void>;
    readonly onDidEnterFullScreen: Event<void>;
    readonly onDidLeaveFullScreen: Event<void>;

    matches(webContents: electron.WebContents): boolean;

}


export class BaseWindow extends Disposable implements IBaseWindow {
    toggleFullScreen(): void {
        throw new Error('Method not implemented.');
    }
    private readonly _onDidClose: Emitter<void> = this._register(new Emitter<void>());
    private readonly _onDidMaximize: Emitter<void> = this._register(new Emitter<void>());
    private readonly _onDidUnmaximize: Emitter<void> = this._register(new Emitter<void>());
    private readonly _onDidEnterFullScreen: Emitter<void> = this._register(new Emitter<void>());
    private readonly _onDidLeaveFullScreen: Emitter<void> = this._register(new Emitter<void>());
    readonly onDidClose: Event<void> = this._onDidClose.event;
    readonly onDidMaximize: Event<void> = this._onDidMaximize.event;
    readonly onDidUnmaximize: Event<void> = this._onDidUnmaximize.event;
    readonly onDidEnterFullScreen: Event<void> = this._onDidEnterFullScreen.event;
    readonly onDidLeaveFullScreen: Event<void> = this._onDidLeaveFullScreen.event;

    private _setupEventListeners(_win: electron.BrowserWindow): void {

        const win = _win;
        this._register(fromNodeEventEmitter(win, 'closed')(() => {
            this._onDidClose.fire();
        }));

        this._register(fromNodeEventEmitter(win, 'maximize')(() => {
            this._onDidMaximize.fire();
        }));

        this._register(fromNodeEventEmitter(win, 'unmaximize')(() => {
            this._onDidUnmaximize.fire();
        }));    
        this._register(fromNodeEventEmitter(win, 'enter-full-screen')(() => {
            this._onDidEnterFullScreen.fire();
        }));

        this._register(fromNodeEventEmitter(win, 'leave-full-screen')(() => {
            this._onDidLeaveFullScreen.fire();
        }));
    }

    private readonly _id: number;
    get id(): number {
        return this._id;
    }

    protected _win: electron.BrowserWindow;
    get win(): electron.BrowserWindow {
        return this._win;
    }

    constructor() {
        super();
        const options: electron.BrowserWindowConstructorOptions = defaultBrowserWindowOptions();
        this._win = new electron.BrowserWindow(options);
        this._id = this._win.id;
        this._setupEventListeners(this._win);
    }



    matches(webContents: electron.WebContents): boolean {
        throw new Error('Method not implemented.');
    }

    dispose(): void {
        throw new Error('Method not implemented.');
    }
}


export function defaultBrowserWindowOptions(): electron.BrowserWindowConstructorOptions {
    const options: electron.BrowserWindowConstructorOptions = {
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    };
    return options;
}