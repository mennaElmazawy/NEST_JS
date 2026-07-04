import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types, UpdateQuery } from "mongoose";
import slugify from "slugify";
import { User } from "./user.model.js";
import { checkIfDeleted, createCascadeHook, ModelType } from "../../common/helper/hook.helper.js";


@Schema({
    timestamps: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})
export class Brand {
    @Prop({ type: String, required: true, min: 5, trim: true, unique: true })
    name: string;

    @Prop({
        type: String,
        default: function (this: Brand) {
            return slugify(this.name, { replacement: "_", trim: true, lower: true })
        }
    })
    slug: string;

    @Prop({ type: String, required: true, min: 5, trim: true })
    slogan: string;

    @Prop({ type: String, required: true })
    logo: string;

    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    createdBy: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: User.name })
    updatedBy: Types.ObjectId;

    @Prop({ type: Date })
    deletedAt: Date;

    @Prop({ type: Types.ObjectId, ref: User.name })
    deletedBy: Types.ObjectId;


}


export const BrandSchema = SchemaFactory.createForClass(Brand)

BrandSchema.pre(["findOneAndUpdate","updateOne"], function(){
    const updated = this.getUpdate() as UpdateQuery<Brand>
    if(updated?.name){
        updated.slug=slugify(updated.name, {replacement:"-", trim:true, lower:true})
    }
})
checkIfDeleted(BrandSchema)
createCascadeHook(
    BrandSchema,
    "deletedAt",
    async(
        id:Types.ObjectId,
        models:Record<string, mongoose.Model<ModelType>>,
        deletedBy?:Types.ObjectId
    )=>{
        await models.Product?.updateMany(
            {brandId:new Types.ObjectId(id)},
            {deletedAt:new Date(), deletedBy}
        )
    }
)
 
export type HBrandDocument = HydratedDocument<Brand>
export const BrandModel = MongooseModule.forFeature([{ name: Brand.name, schema: BrandSchema }])