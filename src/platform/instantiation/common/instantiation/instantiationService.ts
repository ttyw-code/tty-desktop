import { DisposableStore } from '@/base/lifecycle.js';
import { SyncDescriptor0 } from './descriptors.js';
import { Graph } from './graph.js';
import { GetLeadingNonServiceArgs, IInstantiationService, ServicesAccessor } from './instantiation';
import { ServiceCollection } from './serviceCollection.js';



const _enableAllTracing = false


class CyclicDependencyError extends Error {
    constructor(graph: Graph<any>) {
        super('cyclic dependency between services');
        this.message = graph.findCycleSlow() ?? `UNABLE to detect cycle, dumping graph: \n${graph.toString()}`;
    }
}


export class IntantiationService implements IInstantiationService {

    declare readonly _serviceBrand: undefined;
    readonly _globalGraph: Graph<string> | undefined;
    private _isDisposed: boolean = false;


    constructor(
        private readonly _services: ServiceCollection = new ServiceCollection(),
        private readonly _strict: boolean = false,
        private readonly _parent?: IntantiationService,
        private readonly _enableTracing: boolean = _enableAllTracing
    ) {
        this._services.set(IInstantiationService, this);
        this._globalGraph = _enableTracing ? _parent?._globalGraph ?? new Graph(e => e) : undefined;
    }

    createInstance<T>(descriptor: SyncDescriptor0<T>): T;
    createInstance<Ctor extends new (...args: any[]) => unknown, R extends InstanceType<Ctor>>(ctor: Ctor, ...args: GetLeadingNonServiceArgs<ConstructorParameters<Ctor>>): R;
    createInstance(descriptor: unknown, ...rest: unknown[]): unknown {
        throw new Error('Method not implemented.');
    }
    invokeFunction<R, TS extends any[] = []>(fn: (accessor: ServicesAccessor, ...args: TS) => R, ...args: TS): R {
        throw new Error('Method not implemented.');
    }
    createChild(services: ServiceCollection, store?: DisposableStore): IInstantiationService {
        throw new Error('Method not implemented.');
    }
    dispose(): void {
        if (!this._isDisposed) {
            this._isDisposed = true;
            // dispose(this._services);
        }
    }
}

