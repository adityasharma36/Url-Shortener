import { createClient } from "redis";
import { serverConfig } from "./index.js";



export const redisClient =  createClient({
    url:serverConfig.REDIS_URL
})
    .on("error",(err)=> console.log('redis failed to connect', err))


    redisClient.on('connect',()=>{
        console.log('redis has connected to system')
    })


    export async function initRedisConnection(){
        try {
            await redisClient.connect();
            
        } catch (error) {
            console.log('error ocuured in Rdis Connection');
            throw error;
        }
    }

    export async function closeRedis(){
        await redisClient.quit();
        console.log('redis server close Successfully')
    }