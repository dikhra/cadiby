import { url } from "inspector";
import { Schema, model, models } from "mongoose";

export interface IImage extends Document {
    title: string;
    transformationTypes: string;
    publicId: string;
    secureURL: string;
    widht?: number;
    hight?: number;
    config?: object;
    transformationURL?: string;
    aspectRatio?: string;
    color?: string;
    prompt?: string;
    author: {
        id: string;
        name: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

const ImageSchema = new Schema({
    title: {type: String, required: true},
    transformationTypes: {type: String, required: true},
    publicId: {type: String, required: true},
    secureURL: {type: String, required: true},
    widht: {type: Number},
    hight: {type: Number},
    config: {type: Object},
    transformationURL: {type: String},
    aspectRatio: {type: String},
    color: {type: String},
    prompt: {type: String},
    author: {type: Schema.Types.ObjectId, ref: "User"},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
});

const Image = models?.Image || model("Image", ImageSchema);

export default Image