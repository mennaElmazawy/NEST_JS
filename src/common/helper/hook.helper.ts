import mongoose from "mongoose";
import { User } from "../../DB/models/user.model.js";
import { Brand } from "../../DB/models/brand.model.js";
import { Category } from "../../DB/models/category.model.js";
import { Product } from "../../DB/models/product.model.js";


export const checkIfDeleted = (
    schema: mongoose.Schema,
    fieldName: string = "deletedAt"
) => {
    schema.pre(["find", "findOne", "findOneAndUpdate", "updateOne"], function () {
        const query = this.getQuery()
        if (query.paranoid === false) {
            this.setQuery(query)
        } else {
            this.setQuery({
                ...query,
                [fieldName]: { $exists: false }
            })
        }
    })
}

export type ModelType = User | Brand | Category | Product
export function createCascadeHook<T>(
    schema: mongoose.Schema,
    updatedFieldName: string,
    cascadeFn: (
        id: mongoose.Types.ObjectId,
        models: Record<string, mongoose.Model<ModelType>>,
        deletedby?: mongoose.Types.ObjectId
    ) => Promise<void>,
) {
    schema.pre(["findOneAndUpdate", "updateOne"], async function () {
        const update = this.getUpdate() as mongoose.UpdateQuery<T>
        const target = update[updatedFieldName]
        if (target) {
            const id = this.getQuery()._id;
            const deletedBy = update.deletedBy
            const models = this.model.db.models
            await cascadeFn(id, models, deletedBy)
        }
    }
    )
}