import { promisify } from 'util';
import { getRedis } from '../dbs/init.redis';

const { instanceConnec: redisClient } = getRedis()

const pexpire = promisify(createClient)
