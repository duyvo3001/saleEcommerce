import { Schema, model, Types } from "mongoose";

const DOCUMENT_NAME = 'Notification'
const COLLECTION_NAME = 'Notifications'

/*
 *ORDER-001 : order successfully 
 *ORDER-002 : order failed 
 *PROMOTION-001 : NEW PROMOTION
 *SHOP-001 : NEW PRODUCT BY USER FOLLOWING 
 */

const notificationSchema = new Schema({
    noti_type: { type: String, enum: ['ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001'], required: true },
    noti_senderId: { type: Schema.Types.ObjectId, required: true, ref: 'Shop' },
    noti_receivedId: { type: Number, required: true },
    noti_content: { type: String, required: true },
    noti_options: { type: {}, default: {} },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})
export const NotificationSchemaModels = model(DOCUMENT_NAME, notificationSchema);
