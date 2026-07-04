import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types, UpdateQuery } from "mongoose";
import slugify from "slugify";
import { User } from "./user.model.js";
import { Brand } from "./brand.model.js";
import { checkIfDeleted, createCascadeHook, ModelType } from "../../common/helper/hook.helper.js";


@Schema({
    timestamps: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})
export class Category {
    @Prop({ type: String, required: true, min: 5, trim: true, unique: true })
    name: string;

    @Prop({
        type: String,
        default: function (this: Category) {
            return slugify(this.name, { replacement: "_", trim: true, lower: true })
        }
    })
    slug: string;

    @Prop({ type: Types.ObjectId, ref: Brand.name })
    brandIds: Types.ObjectId[];

    @Prop({ type: String, required: true })
    image: string;

    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    createdBy: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: User.name })
    updatedBy: Types.ObjectId;

    @Prop({ type: Date })
    deletedAt: Date;

    @Prop({ type: Types.ObjectId, ref: User.name })
    deletedBy: Types.ObjectId;


}


export const CategorySchema = SchemaFactory.createForClass(Category)

CategorySchema.pre(["findOneAndUpdate","updateOne"], function(){
    const updated = this.getUpdate() as UpdateQuery<Category>
    if(updated?.name){
        updated.slug=slugify(updated.name, {replacement:"-", trim:true, lower:true})
    }
})
checkIfDeleted(CategorySchema)
createCascadeHook(
    CategorySchema,
    "deletedAt",
    async(
        id:Types.ObjectId,
        models:Record<string, mongoose.Model<ModelType>>,
        deletedBy?:Types.ObjectId
    )=>{
       
        await models.Product?.updateMany(
            {categoryId:new Types.ObjectId(id)},
            {deletedAt:new Date(), deletedBy}
        )
    }
)

export type HCategoryDocument = HydratedDocument<Category>
export const CategoryModel = MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }])