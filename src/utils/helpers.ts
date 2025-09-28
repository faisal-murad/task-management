import mongoose from "mongoose"

export const convertToMongoId = (mongoId: string | any) => {
    if(!mongoId?.trim()) return null;
    return new mongoose.Types.ObjectId(mongoId);
}