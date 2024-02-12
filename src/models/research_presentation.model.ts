import mongoose, { Schema, Document } from "mongoose";

export interface researchPresentationDoc extends Document {
    date: String,
    title: String,
    body: String,
    type: String,
    user: String,
    deletedAt: Date | null,
};

const researchPresentationSchema: Schema = new Schema(
    {
        date: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        body: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        user: {
            type: String,
            required: true,
        },
        deletedAt : {
            type: Date,
            required: false,
        }
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<researchPresentationDoc>('researchPresentation', researchPresentationSchema);