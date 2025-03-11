
import { client } from "../dbs/init.redisBasic";
import { reservationInventory } from "../models/repositories/inventory.repo";
import { IreservationInventory } from "../models/repositories/interface/Iinventory";

const redisClient = client;

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
  const delAsyncKey = await redisClient.del(keyLock);
  return delAsyncKey;
};

export { acquireLock, releaseLock };
