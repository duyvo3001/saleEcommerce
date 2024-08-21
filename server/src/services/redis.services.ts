import { promisify } from "util";
// import { getRedis } from '../dbs/init.redis';
import { client } from "../dbs/init.redisBasic";
import { reservationInventory } from "../models/repositories/inventory.repo";
import { IreservationInventory } from "../models/repositories/interface/Iinventory";

const redisClient = client;

// const pexpire = promisify(redisClient.pExpire).bind(redisClient);
// const setnxAsync = promisify(redisClient.setEx).bind(redisClient);

// console.log("pexpire_________", pexpire);

// khoa bi quan
const acquireLock = async ({
  productId,
  quantity,
  cartId,
}: IreservationInventory) => {
  const value = {
    productId,
    quantity,
    cartId,
  };
  const key = `lock_v2024_${productId}`;
  const retryTimes = 10;
  const exprieTime = 3000;

  const serializedObject = JSON.stringify(value);
  for (let i = 0; i < retryTimes; i++) {
    // const result = await setnxAsync(key, exprieTime,value);
    const result = await redisClient.setEx(key, exprieTime, serializedObject);

    console.log(`result::: ${result}`);

    if (result == "OK") {
      const isReversation = await reservationInventory({
        productId,
        quantity,
        cartId,
      });
      console.log("isReversation:_____",isReversation);

      if (isReversation.acknowledged == true) {
        await redisClient.pExpire(key, exprieTime);
        return key;
      }
      return null;
    } else await new Promise((resolve) => setTimeout(resolve, 50));
  }
};

// khoa lac quan
const releaseLock = async (keyLock: any) => {
  // const delAsyncKey = promisify(redisClient.del).bind(redisClient);
  const delAsyncKey = await redisClient.del(keyLock);
  return delAsyncKey;
};

export { acquireLock, releaseLock };
