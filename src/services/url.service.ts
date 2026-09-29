import { serverConfig } from "../configs/index.js";
import type { CacheRepository } from "../repositories/cache.repository.js";
import type { UrlResporitory } from "../repositories/url.repository.js";
import { NotFoundError } from "../utils/Errors/app.error.js";
import { toBase62 } from "../utils/helpers/base62.helper.js";


export class urlService{

    constructor(private readonly urlRepository:UrlResporitory,
                private readonly cacheRepository:CacheRepository
    ){}

    async createUrl(originalUrl: string){

        const nextId = await this.cacheRepository.getNextId();

        const shortUrl = toBase62(nextId);

        const url = await this.urlRepository.create({originalUrl,shortUrl})

        await this.cacheRepository.setURLMapping(shortUrl,originalUrl);

        const baseUrl = serverConfig.BASE_URL;
        const fullUrl = `${baseUrl}/${shortUrl}`

        return {
            id:url._id.toString(),
            shortUrl,
            originalUrl,
            fullUrl,
            createdAt:url.createdAt,
            updatedAt:url.updatedAt
        }
    }

    async getOriginalUrl(shortUrl:string){
        const originalUrl = await this.cacheRepository.getUrlMapping(shortUrl);

        if(originalUrl){
            await this.urlRepository.incrementClick(shortUrl);
            return {
                originalUrl,shortUrl
            }
        }

        const url = await this.urlRepository.findByShortUrl(shortUrl);

        
        if(!url){
            throw new NotFoundError("url not found")
        }
        await this.urlRepository.incrementClick(shortUrl);

        await this.cacheRepository.setURLMapping(shortUrl,url.originalUrl);

        return {
            originalUrl: url.originalUrl,
            shortUrl
        }
    }


}