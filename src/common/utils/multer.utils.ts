import { BadRequestException } from "@nestjs/common";
import multer from "multer";
import { Multer_Enum, Store_Enum } from "../enum/multer.enum";
import { tmpdir } from "node:os";
import { Request } from "express";

export const multerCloud = ({
    store_type=Store_Enum.memory,
    custom_Types=Multer_Enum.image,
    
}:{
    store_type?:Store_Enum,
    custom_Types?:string[],
  
}={}) => {
    const storage = store_type === Store_Enum.memory ? multer.memoryStorage() : multer.diskStorage({
        destination: tmpdir(),
        filename: function (req:Request, file:Express.Multer.File, cb:Function) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, uniqueSuffix + "_" + file.originalname)
        }
    });

    const fileFilter = (req:Request, file:Express.Multer.File, cb:Function) => {
        if (!custom_Types.includes(file.mimetype)) {
           return cb(new BadRequestException("invalid file type"))
        }
        cb(null, true)
    }

    return {
        storage,
        fileFilter
    }
}
