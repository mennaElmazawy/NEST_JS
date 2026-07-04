import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, UpdateQuery } from "mongoose";
import slugify from "slugify";
import { User } from "./user.model.js";
import { Brand } from "./brand.model.js";
import { Category } from "./category.model.js";
import { checkIfDeleted } from "../../common/helper/hook.helper.js";


@Schema({
    timestamps: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})
export class Product {
    @Prop({ type: String, required: true, min: 5, trim: true, unique: true })
    name: string;

    @Prop({
        type: String,
        default: function (this: Product) {
            return slugify(this.name, { replacement: "_", trim: true, lower: true })
        }
    })
    slug: string;

    @Prop({ type: String, required: true, min: 5, trim: true })
    description: string;

    @Prop({ type: Types.ObjectId, ref: Brand.name, required: true })
    brandId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: Category.name, required: true })
    categoryId: Types.ObjectId;

    // @Prop({ type: Types.ObjectId, ref: SubCategory.name, required: true })
    // subCategoryId: Types.ObjectId;

    @Prop({ type: String, required: true })
    mainImage: string;

    @Prop({ type: [String] })
    subImages: string[];

    @Prop({ type: Number, required: true })
    price: number;

    @Prop({ type: Number })
    discount: number;

    @Prop({ type: Number, required: true })
    stock: number;

    @Prop({ type: Number })
    rateNum: number;

    @Prop({ type: Number })
    rateAvg: number;

    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    createdBy: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: User.name })
    updatedBy: Types.ObjectId;

    @Prop({ type: Date })
    deletedAt: Date;

    @Prop({ type: Types.ObjectId, ref: User.name })
    deletedBy: Types.ObjectId;


}


export const ProductSchema = SchemaFactory.createForClass(Product)

ProductSchema.pre(["findOneAndUpdate", "updateOne"], function () {
    const updated = this.getUpdate() as UpdateQuery<Product>
    if (updated?.name) {
        updated.slug = slugify(updated.name, { replacement: "-", trim: true, lower: true })
    }
})
checkIfDeleted(ProductSchema)

export type HProductDocument = HydratedDocument<Product>
export const ProductModel = MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])