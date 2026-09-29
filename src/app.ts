import express from 'express'

import v1Router from './routers/v1/test.router.js';
import { genericErorr } from './middlewares/error.middleware.js';
import { serverConfig } from './configs/index.js';

import  { pinoHttp } from 'pino-http';
import { logger } from './configs/logger.config.js';
import { connnectToDB } from './configs/db.config.js';
import { initRedisConnection } from './configs/redis.config.js';
import { createExpressMiddleware } from '@trpc/server/adapters/express';

import { trpcRouter } from './routers/trpc/index.js';



const app = express();


app.use(express.json({
    limit:"1mb"
}));
app.use(pinoHttp({logger}))


app.use('/trpc',createExpressMiddleware({
    router:trpcRouter
}))
app.use('/api/v1',v1Router)
app.use(genericErorr)

app.listen(serverConfig.PORT,async ()=>{
    console.log(`server Connected on Port ${serverConfig.PORT}`)

    await connnectToDB();
    await initRedisConnection();

})