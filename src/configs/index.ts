
import dotenv from 'dotenv'

function configLoad(){
    dotenv.config();
}

configLoad();



type serverConfigType = {
    PORT:number
    MONGO_URL:string
    REDIS_URL:string
    REDIS_COUNTER_KEY:string
    BASE_URL:string
}

export const serverConfig:serverConfigType = {
    PORT:Number(process.env.PORT) || 3000,
    MONGO_URL: process.env.MONGO_URL || '',
    REDIS_URL: process.env.REDIS_URL || "",
    REDIS_COUNTER_KEY:process.env.REDIS_COUNTER_KEY || "",
    BASE_URL:process.env.BASE_URL || "short.ly"
}