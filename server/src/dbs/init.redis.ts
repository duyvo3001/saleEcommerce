import { createClient } from 'redis';
import { RedisErrorResponse } from '../core/error.response';

let client = {}
let statusConnectRedis = {
    CONNECT: 'connect',
    END: 'end',
    RECONNECT: 'reconnecting',
    ERROR: 'error'
}
let connectionTimeout: number | null = null;

const REDIS_CONNECT_TIMEOUT = 10000
const REDIS_CONNECT_MESSAGE = {
    code: -99,
    message: {
        vn: 'loi redis connect timeout',
        en: 'service redis connect timeout'
    }
}

const handleTimeoutError = () => {
    connectionTimeout = setTimeout(() => {
        throw new RedisErrorResponse({
            message: REDIS_CONNECT_MESSAGE.message.en,
            statusCode: REDIS_CONNECT_MESSAGE.code
        })
    }, REDIS_CONNECT_TIMEOUT)
}

const handleEventConnect = ({ connectionRedis }: any) => {
    //check if connection is null
    connectionRedis.on(statusConnectRedis.CONNECT, () => {
        console.log(`connection Redis - Connection status : connected`);
        clearTimeout(connectionTimeout)
    })

    connectionRedis.on(statusConnectRedis.END, () => {
        console.log(`connection Redis - Connection status : disconnected`);
        // handle retry
        handleTimeoutError()
    })

    connectionRedis.on(statusConnectRedis.RECONNECT, () => {
        console.log(`connection Redis - Connection status : reconnecting`);
        clearTimeout(connectionTimeout)
    })

    connectionRedis.on(statusConnectRedis.ERROR, (err: Error) => {
        console.log(`connection Redis - Connection status : ERROR ${err}`);
        handleTimeoutError()
    })
}

const initRedis = () => {
    const instanceRedis = createClient();
    client.instanceConnect = instanceRedis;
    handleEventConnect({ connectionRedis: instanceRedis })
}

const getRedis = () => client

const closeRedis = () => { }

export {
    initRedis, getRedis, closeRedis
}