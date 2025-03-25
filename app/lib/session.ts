import Redis from 'redis';
import { promisify } from 'util';

const redisClient = Redis.createClient({ url: process.env.REDIS_URL! });
const getAsync = promisify(redisClient.get).bind(redisClient);
const setexAsync = promisify(redisClient.setEx).bind(redisClient);

export { redisClient, getAsync, setexAsync };