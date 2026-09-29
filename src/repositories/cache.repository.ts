import { serverConfig } from "../configs/index.js";
import { redisClient } from "../configs/redis.config.js";

export class CacheRepository{

    async getNextId():Promise<number>{
        const key = serverConfig.REDIS_COUNTER_KEY
        if(!redisClient.isOpen){
            await  redisClient.connect();
        }

        const result = await redisClient.incr(key);
        return result;
    }

    async setURLMapping(shortUrl:string,originalUrl:string){
        const key = `url:${shortUrl}`;

        if(!redisClient.isOpen){
            await redisClient.connect();
        }

        await redisClient.set(key,originalUrl,{EX:86400});
        return;
    }

    async getUrlMapping(shortUrl:string){
        const key = `url:${shortUrl}`;

        if(!redisClient.isOpen){
            await redisClient.connect();
        }
        const url = await redisClient.get(key);
        return url;
    }
    async deleteUrlMapping(shrotUrl:string){
        const key = `url:${shrotUrl}`;
        if(!redisClient.isOpen){
            await redisClient.connect();
        }
        await redisClient.del(key);
        return;
    }
}