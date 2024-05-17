import { Types } from "mongoose"

export const convertToObjectMongoDB = (id: string) => new Types.ObjectId(id) 
