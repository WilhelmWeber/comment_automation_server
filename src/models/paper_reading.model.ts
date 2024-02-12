import mongoose, { Schema, Document } from "mongoose";

export interface paperReadingDoc extends Document {
    date: String,
    title: String,
    url: String,
    body: String,
    type: String,
    user: String,
    deletedAt: Date | null,
};

const paperReadingSchema: Schema = new Schema(
    {
        date: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        url: {
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
        deletedAt: {
            type: Date,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<paperReadingDoc>('paperReadings', paperReadingSchema);