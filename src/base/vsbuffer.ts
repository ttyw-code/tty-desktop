export class VSBuffer {
    constructor(public buffer: Buffer) { }

    static alloc(length: number): VSBuffer {
        return new VSBuffer(Buffer.alloc(length));
    }

    static fromString(source: string): VSBuffer {
        return new VSBuffer(Buffer.from(source, 'utf8'));
    }

    static wrap(buffer: Buffer): VSBuffer {
        return new VSBuffer(buffer);
    }

    static concat(buffers: VSBuffer[]): VSBuffer {
        return new VSBuffer(Buffer.concat(buffers.map(b => b.buffer)));
    }

    static isNativeBuffer(b: any): boolean {
        return Buffer.isBuffer(b);
    }

    get byteLength(): number {
        return this.buffer.byteLength;
    }

    toString(encoding: BufferEncoding = 'utf8') {
        return this.buffer.toString(encoding);
    }

    slice(start?: number, end?: number) {
        return new VSBuffer(this.buffer.slice(start, end));
    }

    set(source: VSBuffer | Buffer, offset = 0) {
        const buf = source instanceof VSBuffer ? source.buffer : source;
        buf.copy(this.buffer, offset);
    }
}

export default VSBuffer;


export function createPriceFilter<T>(min: number, max: number): T[] {
    const products = [
        { id: 1, name: 'Laptop', price: 1200 },
        { id: 2, name: 'Mouse', price: 25 },
        { id: 3, name: 'Keyboard', price: 75 },
        { id: 4, name: 'Monitor', price: 300 },
        { id: 5, name: 'Webcam', price: 60 }
    ];

    return products.filter(product => product.price >= min && product.price <= max) as unknown as T[];
} 
