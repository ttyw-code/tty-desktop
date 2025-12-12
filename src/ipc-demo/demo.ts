import { InMemoryProtocol, ChannelServer, ChannelClient } from '../common/simple-ipc';

export async function icpMain() {
    const p1 = new InMemoryProtocol();
    const p2 = new InMemoryProtocol();
    p1.connect(p2);

    const server = new ChannelServer(p1);
    server.registerChannel('math', {
        add: async ({ a, b }: { a:number, b:number }) => a + b,
    });

    const client = new ChannelClient(p2);
    const ch = client.getChannel('math');
    const res = await ch.call<number>('add', { a: 2, b: 3 });
    console.log('2+3 =', res);
}

