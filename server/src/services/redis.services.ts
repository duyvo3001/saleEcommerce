import { promisify } from 'util';
import { getRedis } from '../dbs/init.redis';
import { IreservationInventory, reservationInventory } from '../models/repositories/inventory.repo';

const { instanceConnect: redisClient } = getRedis()

const pexpire = promisify(redisClient.pexpire).bind(redisClient)
const setnxAsync = promisify(redisClient.setnx).bind(redisClient)

// khoa bi quan
const acquireLock = async ({ productId, quantity, cartId }: IreservationInventory) => {
    const key = `lock_v2024_${productId}`
    const retryTimes = 10
    const exprieTime = 3000

    for (let i = 0; i < retryTimes; i++) {
        const result = await setnxAsync(key, exprieTime)
        console.log(`result::: ${result}`);

        if (result === 1) {
            const isReversation = await reservationInventory({ productId, quantity, cartId })
            if (isReversation.modifiedCount) {
                await pexpire(key, exprieTime)
                return key
            }
            return null
        }
        else await new Promise((resolve) => setTimeout(resolve, 50))
    }
}

// khoa lac quan
const releaseLock = async (keyLock : any) => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient)
    return await delAsyncKey(keyLock)
}

export {
    acquireLock,
    releaseLock
}