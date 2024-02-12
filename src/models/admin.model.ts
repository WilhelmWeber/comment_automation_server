import mongoose, { Schema, Document } from "mongoose";

export interface adminDoc extends Document {
    username: String,
};

const adminSchema: Schema = new Schema(
    {
        username: {
            type: String,
            required: true,
        },
    },
);

export default mongoose.model<adminDoc>('admin_users', adminSchema);