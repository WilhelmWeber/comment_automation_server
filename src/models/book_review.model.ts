import mongoose, { Schema, Document } from "mongoose";

export interface bookReviewDoc extends Document {
    date: String,
    title: String,
    book_url: String,
    info: String,
    review_url: String,
    body: String,
    type: String,
    user: String,
    deletedAt: Date | null,
};

const bookReviewSchema: Schema = new Schema(
    {
        date: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        book_url: {
            type: String,
            required: true,
        },
        info: {
            type: String,
            required: true,
        },
        review_url: {
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
        }
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<bookReviewDoc>('bookReview', bookReviewSchema);