
import mongoose, { Document, Schema,model } from "mongoose";

export interface IURL extends Document{
    originalUrl:string,
    shortUrl:string,
    createdAt:Date,
    updatedAt:Date,
    click:number
}

const urlSchema = new Schema<IURL>({
    originalUrl:{
        type:String,
        required:true,
    },
    shortUrl:{
        type:String,
        required:true,
        unique:true,
        index:true
    },
    click:{
        type:Number,
        default:0
    },
    
},{
    timestamps:true
})
urlSchema.index({createdAt:-1});

export const Url = model<IURL>("url",urlSchema);

