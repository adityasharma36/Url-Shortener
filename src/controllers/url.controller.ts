import z from "zod";
import { publicProcedure } from "../routers/trpc/context.js";
import { urlService } from "../services/url.service.js";
import { UrlResporitory } from "../repositories/url.repository.js";
import { CacheRepository } from "../repositories/cache.repository.js";
import { logger } from "../configs/logger.config.js";
import { InternalError } from "../utils/Errors/app.error.js";

const UrlService = new urlService(new UrlResporitory,new CacheRepository);

export const urlContoller = {
    create:publicProcedure
    .input(
        z.object({
            orginalUrl:z.string().url("Invalid Url")
        })
    )
    .mutation(async ({input}) => {
        try {
            console.log(input.orginalUrl,"here ")
            const url = await UrlService.createUrl(input.orginalUrl);
            return url;
        } catch (error) {
            logger.error('Error ShortUrl Create :');
            throw new InternalError('Failed to Create Url')

        }
    }),
    getOriginalUrl:publicProcedure
    .input(
        z.object({
            shortUrl:z.string().min(1,'Short Url must be required')
        })
    )
    .query(async ({input}) => {
        try {
            const result = await UrlService.getOriginalUrl(input.shortUrl);
            return result;

        } catch (error) {
            
            logger.error('failed to fetch OrginalUrl')
            throw new InternalError("failed to Fetch Url")
        }
    })
}