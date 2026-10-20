import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    purchaseRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PurchaseRequest',
      default: null,
    },
    industryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    polymer: {
      type: String,
      required: true,
    },
    quantityKg: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['In Transit', 'Delivered', 'Processing', 'Cancelled'],
      default: 'Processing',
    },
    eta: {
      type: String,
      default: 'Tomorrow, 02:00 PM',
    },
    destination: {
      type: String,
      default: 'Sector 18 Industrial Area, Warehouse 3',
    },
    vehicleNo: {
      type: String,
      default: 'DL-01-AB-4921',
    },
    driverName: {
      type: String,
      default: 'Rajesh Sharma',
    },
    driverPhone: {
      type: String,
      default: '+91 98765 43210',
    },
    currentLocation: {
      type: String,
      default: 'Sector 14 Logistics Hub (28.4595° N, 77.0266° E)',
    },
    coords: {
      lat: { type: Number, default: 28.4595 },
      lng: { type: Number, default: 77.0266 },
    },
    milestones: [
      {
        step: { type: String, required: true },
        time: { type: String, required: true },
        completed: { type: Boolean, default: false },
        current: { type: Boolean, default: false },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model('Order', orderSchema);
