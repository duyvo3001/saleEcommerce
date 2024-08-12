import { Schema, model, Types } from "mongoose";

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";

// Declare the Schema of the Mongo model
const OrderSchema = new Schema(
  {
    order_userId: { type: Number, required: true },
    order_checkout: { type: Object, default: {} },
    /*
     order_checkout = {
         totalPrice ,
         totalApllyDiscount,
         feeship
     }
    */
    order_shipping: { type: Object, default: {} },
    order_payment: { typeKey: Object, default: {} },
    order_product: { type: Array, required: true },
    order_trackingnumber: { type: String, default: "#00000112333" },
    order_status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "cancelled", "delevered"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
export const orderModel = model(DOCUMENT_NAME, OrderSchema);
