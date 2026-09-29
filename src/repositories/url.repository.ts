
import { Url ,type IURL} from "../db/models/url.model.js"; 



export interface CreateUrl{
    originalUrl:string,
    shortUrl:string
}

export interface UrlStats{
    id:string,
    originalUrl:string,
    shortUrl:string,
    clicks:number,
    createdAt:Date,
    updatedAt:Date
}

export class UrlResporitory{
    async create(data:CreateUrl):Promise<IURL>{
        const url = new Url(data);
        return await url.save();
    }

    async findByShortUrl(shortUrl:string){
        return await Url.findOne({shortUrl});
    }
    
    async findAll(){
        const urls =  await Url.find().select({
            _id:1,
            orginalUrl:1,
            shortUrl:1,
             clicks:1,
             createdAt:1,
             updatedAt:1,
        }).sort({cratedAt:-1});

        return urls.map(url=>({
            id: url._id.toString(),
            originalUrl:url.originalUrl,
            shortUrl:url.shortUrl,
            clicks: url.click,
            createdAt:url.createdAt,
            updatedAt:url.updatedAt,

        }))
    }

    async incrementClick(shortUrl:string):Promise<void>{

         await Url.findOneAndUpdate({
            shortUrl
        },{$inc:{click:1}});
        return;
    }


    async findStatsByShortUrl(shortUrl:string): Promise<UrlStats | null>{
        
        
         const url =  await Url.findOne({shortUrl}).select({
            _id:1,
            orginalUrl:1,
            shortUrl:1,
             clicks:1,
             createdAt:1,
             updatedAt:1,
        }) 
        if(!url) return null;

        return {
             id: url._id.toString(),
            originalUrl:url.originalUrl,
            shortUrl:url.shortUrl,
            clicks: url.click,
            createdAt:url.createdAt,
            updatedAt:url.updatedAt,
        }    }
}