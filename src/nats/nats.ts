import {connect, SubscriptionOptions, NatsConnection, StringCodec, Codec} from 'nats';
import {parseFlags} from './nast-helpers';

import { populateSubjects } from './nats.subject';
import {UsersService} from '../users/user.service';
import {userProviders} from '../providers/user.provider';

console.info('process.argv.slice(2) ---', process.argv.slice(2));

interface IEventManager {
    service: {};
    method: string;
    setData: boolean;
    pubSubject: string;
}

function eventManager(event): IEventManager {
    let service;
    let method;
    let setData = false;
    let pubSubject = null;

    console.info('eventManager event ---', event);

    switch (event) {
        case 'USERS_SERVICE.HELLO':
            service = new UsersService(userProviders?.[0].useValue);
            method = 'findAll';
            pubSubject = 'GATEWAY.HELLO';
            break;
        case 'USERS_SERVICE.GOODBYE':
            service = UsersService;
            method = 'findAll';
            setData = true;
            break;
        default:
            service = {};
            method = null;
    }

    console.info('eventManager res ---',
        service.__proto__,
        method,
        setData,
    );

    return {
        service,
        method,
        setData,
        pubSubject,
    };
}

function natsCreateSubscription(nc: NatsConnection, sc: Codec<string>, subject: string) {
    const sub = nc.subscribe(subject, {});

    console.info('hello --', sub);

    (async () => {
        for await (const m of sub) {

            const data = sc.decode(m.data);

            console.log(`[${sub.getProcessed()}]: ${data}`);

            const entry = eventManager(subject);

            const dataToSend = entry.setData ? await entry.service[entry.method](data) : await entry.service[entry.method]();

            console.info('Service data ----', dataToSend);

            if (entry.pubSubject) {
                const dataToString = JSON.stringify(dataToSend);

                const enc = new TextEncoder();

                m.respond(enc.encode(dataToString));
                // nc.publish(entry.pubSubject, enc.encode(dataToString), {);
            }

        }
        console.log('subscription closed');
    })();
}

export async function natsSub(): Promise<boolean> {
    const servers = [
        // {},
        { servers: ['demo.nats.io:4222'] },
        { servers: 'nats://127.0.0.1:4222' },
        // { servers: ['demo.nats.io:4442', 'demo.nats.io:4222'] },
        // { servers: 'demo.nats.io:4443' },
        // { port: 4222 },
        // { servers: '0.0.0.0:4222' },
    ];

    let connectionRes: boolean = false;

    const sc = StringCodec();

    servers.forEach(async (v) => {
        try {
            const nc = await connect(v);
            console.log(`connected to ${nc.getServer()}`);
            // this promise indicates the client closed
            const done = nc.closed();
            // @ts-ignore
            // nc.on('unsubscribe', () => {
            //     nc.close();
            // });
            // // @ts-ignore
            // nc.on('permissionError', (err) => {
            //     nc.close();
            //     console.log(`${err}`);
            // });
            // do something with the connection

            const subjects = populateSubjects();

            subjects.map(s => {
                console.info(`Event ${s} --`, s);

                return natsCreateSubscription(nc, sc, s);
            });

            // const sub = nc.subscribe('hello', {});
            //
            // console.info('hello --', sub);
            //
            // (async () => {
            //     for await (const m of sub) {
            //         console.log(`[${sub.getProcessed()}]: ${sc.decode(m.data)}`);
            //     }
            //     console.log("subscription closed");
            // })();

            // close the connection
            // await nc.close();
            // // check if the close was OK
            // const err = await done;
            // if (err) {
            //     console.log(`error closing:`, err);
            // }

            connectionRes = true;

            console.info('nats connectionRes --', connectionRes);

            return connectionRes;
        } catch (err) {
            console.log(`error connecting to ${JSON.stringify(v)}`, err);

            connectionRes =  false;

            return connectionRes;
        }
    });

    return connectionRes = true;
}
