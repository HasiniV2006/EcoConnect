import { PurchaseRequest } from '../models/PurchaseRequest.js';
import { InventoryBatch } from '../models/InventoryBatch.js';
import { InventoryTransaction } from '../models/InventoryTransaction.js';
import { Order } from '../models/Order.js';
import { ActivityLog } from '../models/ActivityLog.js';

/**
 * @desc    Get Industry dashboard metrics
 * @route   GET /api/industry/dashboard
 * @access  Private (Industry)
 */
export async function getDashboard(req, res, next) {
  try {
    const industryId = req.user._id;

    const [requests, orders] = await Promise.all([
      PurchaseRequest.find({ industryId }),
      Order.find({ industryId }),
    ]);

    const completedOrders = requests.filter((r) => r.status === 'Approved' || r.status === 'Fulfilled');
    const totalProcuredKg = completedOrders.reduce((acc, curr) => acc + (curr.quantityKg || 0), 0);
    const totalSpent = completedOrders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
    const activeRequestsCount = requests.filter((r) => r.status === 'Pending Review').length;
    const inTransitCount = orders.filter((o) => o.status === 'In Transit').length;

    // Recent activity
    const activity = await ActivityLog.find({
      $or: [{ portal: 'industry' }, { portal: 'municipality' }],
    })
      .sort({ createdAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      metrics: {
        totalProcuredKg: totalProcuredKg || 0,
        totalSpent: totalSpent || 0,
        activeRequests: activeRequestsCount,
        inTransitDeliveries: inTransitCount,
      },
      recentActivity: activity,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @desc    Get marketplace batches available for purchase
 * @route   GET /api/industry/marketplace
 * @access  Private (Industry)
 */
export async function getMarketplace(req, res, next) {
  try {
    const batches = await InventoryBatch.find({ currentStockKg: { $gt: 0 } });

    // Format for Industry Marketplace cards
    const marketplaceBatches = batches.map((b) => ({
      id: b.batchId,
      _id: b._id,
      polymer: b.polymerType,
      name: b.fullName || `${b.polymerType} Industrial Flakes`,
      grade: b.grade,
      purity: `${b.purityPercent}% Clean`,
      availableKg: b.currentStockKg,
      pricePerKg: b.minPricePerKg,
      hub: b.processingCenter,
      status: b.status,
    }));

    res.status(200).json({
      success: true,
      batches: marketplaceBatches,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @desc    Create purchase request from industry
 * @route   POST /api/industry/purchase-requests
 * @access  Private (Industry)
 */
export async function createPurchaseRequest(req, res, next) {
  try {
    const { polymerType, quantityKg, ratePerKg, deliveryAddress, requestedDelivery, notes } = req.body;

    if (!polymerType || !quantityKg || Number(quantityKg) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide polymer type and valid quantity in kg',
      });
    }

    const qty = Number(quantityKg);
    const rate = Number(ratePerKg) || (polymerType === 'HDPE' ? 55 : polymerType === 'PET' ? 42 : 38);
    const totalAmount = Math.round(qty * rate);

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const customId = `#ORD-${randomNum}`;

    const purchaseRequest = await PurchaseRequest.create({
      customId,
      industryId: req.user._id,
      companyName: req.user.companyName || req.user.name || 'Green Polymer Industries',
      buyerGst: req.user.gstNumber || '07AABCU9603R1ZM',
      polymerType,
      quantityKg: qty,
      ratePerKg: rate,
      totalAmount,
      deliveryAddress: deliveryAddress || req.user.facilityLocation || 'Sector 18 Industrial Area',
      requestedDelivery: requestedDelivery || 'Within 48h (Urgent)',
      reviewNotes: notes || '',
      status: 'Pending Review',
    });

    // Log Activity
    await ActivityLog.create({
      logId: `ACT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      action: 'Purchase Request Placed',
      portal: 'industry',
      userId: req.user._id,
      actorName: req.user.name,
      description: `New purchase request ${customId} for ${qty} kg of ${polymerType} (₹${totalAmount.toLocaleString('en-IN')})`,
      details: { requestId: customId, polymer: polymerType, qty, totalAmount },
    });

    res.status(201).json({
      success: true,
      message: 'Purchase request placed successfully and submitted to Municipality for verification.',
      purchaseRequest,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @desc    Get Industry's own purchase requests
 * @route   GET /api/industry/purchase-requests
 * @access  Private (Industry)
 */
export async function getMyPurchaseRequests(req, res, next) {
  try {
    const requests = await PurchaseRequest.find({ industryId: req.user._id }).sort({ createdAt: -1 });

    const formatted = requests.map((r) => ({
      _id: r._id,
      id: r.customId,
      polymer: r.polymerType,
      quantity: `${r.quantityKg.toLocaleString()} kg`,
      quantityKg: r.quantityKg,
      rate: `₹${r.ratePerKg}/kg`,
      ratePerKg: r.ratePerKg,
      total: `₹${r.totalAmount.toLocaleString('en-IN')}`,
      totalAmount: r.totalAmount,
      date: r.createdAt.toISOString().split('T')[0],
      delivery: r.requestedDelivery,
      status: r.status,
      payment: r.paymentStatus,
      notes: r.reviewNotes,
    }));

    res.status(200).json({
      success: true,
      count: formatted.length,
      requests: formatted,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @desc    Get all purchase requests for Municipality review
 * @route   GET /api/municipality/purchase-requests
 * @access  Private (Municipality)
 */
export async function getAllPurchaseRequests(req, res, next) {
  try {
    const requests = await PurchaseRequest.find().sort({ createdAt: -1 });

    const formatted = requests.map((r) => ({
      _id: r._id,
      id: r.customId,
      company: r.companyName,
      polymer: r.polymerType,
      quantity: `${r.quantityKg.toLocaleString()} kg`,
      quantityKg: r.quantityKg,
      rate: `₹${r.ratePerKg}/kg`,
      ratePerKg: r.ratePerKg,
      total: `₹${r.totalAmount.toLocaleString('en-IN')}`,
      totalAmount: r.totalAmount,
      requestedDelivery: r.requestedDelivery,
      paymentStatus: r.paymentStatus,
      status: r.status === 'Pending Review' ? 'Pending' : r.status,
      reviewNotes: r.reviewNotes,
      createdAt: r.createdAt,
    }));

    res.status(200).json({
      success: true,
      count: formatted.length,
      orders: formatted,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @desc    Approve an industry purchase request
 * @route   PATCH /api/municipality/purchase-requests/:id/approve
 * @access  Private (Municipality)
 */
export async function approvePurchaseRequest(req, res, next) {
  try {
    const request = await PurchaseRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Purchase request not found' });
    }

    if (request.status === 'Approved') {
      return res.status(400).json({ success: false, message: 'Order is already approved' });
    }

    // 1. Deduct from Inventory Batch
    const batch = await InventoryBatch.findOne({ polymerType: request.polymerType });
    if (batch) {
      const prevStock = batch.currentStockKg;
      batch.currentStockKg = Math.max(0, batch.currentStockKg - request.quantityKg);
      if (batch.currentStockKg === 0) {
        batch.status = 'Depleted';
      } else if (batch.currentStockKg < 200) {
        batch.status = 'Low Stock';
      }
      await batch.save();

      // Log Inventory deduction transaction
      await InventoryTransaction.create({
        transactionId: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        batchId: batch._id,
        polymerType: request.polymerType,
        action: `Dispatched to ${request.companyName} (${request.customId})`,
        quantityKg: -request.quantityKg,
        previousStockKg: prevStock,
        newStockKg: batch.currentStockKg,
        operator: req.user.name || 'Officer R. Vance',
        notes: `Purchase order approved. Deducted ${request.quantityKg} kg.`,
      });
    }

    // 2. Mark request approved
    request.status = 'Approved';
    request.approvedBy = req.user._id;
    request.reviewedAt = new Date();
    await request.save();

    // 3. Generate Order / Delivery Record
    const deliveryCustomId = `#DEL-${Math.floor(8000 + Math.random() * 1999)}`;
    const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const order = await Order.create({
      orderId: deliveryCustomId,
      purchaseRequestId: request._id,
      industryId: request.industryId,
      polymer: `${request.polymerType} Baled Industrial Flakes`,
      quantityKg: request.quantityKg,
      totalAmount: request.totalAmount,
      status: 'In Transit',
      eta: 'Tomorrow, 03:00 PM',
      destination: request.deliveryAddress || 'Sector 18 Industrial Area, Warehouse 3',
      vehicleNo: 'DL-01-AB-4921',
      driverName: 'Rajesh Sharma',
      driverPhone: '+91 98765 43210',
      currentLocation: 'Sector 14 Logistics Hub Exit Gate (28.4595° N, 77.0266° E)',
      coords: { lat: 28.4595, lng: 77.0266 },
      milestones: [
        { step: 'Order Confirmed & Weighed', time: `${todayStr}, 09:00 AM`, completed: true, current: false },
        { step: 'Quality Audit & Flake Inspection', time: `${todayStr}, 11:30 AM`, completed: true, current: false },
        { step: 'Dispatched from Central MRF Hub', time: `${todayStr}, 01:15 PM`, completed: true, current: true },
        { step: 'Arrival at Facility Gate', time: 'Estimated: 03:00 PM', completed: false, current: false },
      ],
    });

    // 4. Activity Log
    await ActivityLog.create({
      logId: `ACT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      action: 'Order Approved & Dispatched',
      portal: 'municipality',
      userId: req.user._id,
      actorName: req.user.name || 'Officer R. Vance',
      description: `Approved ${request.customId} for ${request.companyName} (${request.quantityKg} kg ${request.polymerType}). Delivery initiated: ${deliveryCustomId}.`,
      details: { requestId: request.customId, deliveryId: deliveryCustomId },
    });

    res.status(200).json({
      success: true,
      message: `Order approved! Deducted ${request.quantityKg} kg from inventory and scheduled delivery ${deliveryCustomId}.`,
      request,
      order,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @desc    Reject an industry purchase request
 * @route   PATCH /api/municipality/purchase-requests/:id/reject
 * @access  Private (Municipality)
 */
export async function rejectPurchaseRequest(req, res, next) {
  try {
    const { reason } = req.body;
    const request = await PurchaseRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Purchase request not found' });
    }

    request.status = 'Rejected';
    request.reviewNotes = reason || 'Stock allocation unavailable';
    request.reviewedAt = new Date();
    await request.save();

    await ActivityLog.create({
      logId: `ACT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      action: 'Order Rejected',
      portal: 'municipality',
      userId: req.user._id,
      actorName: req.user.name || 'Officer R. Vance',
      description: `Rejected order ${request.customId} from ${request.companyName}. Reason: ${request.reviewNotes}`,
    });

    res.status(200).json({
      success: true,
      message: 'Purchase request rejected',
      request,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @desc    Get Industry shipments / orders
 * @route   GET /api/industry/orders
 * @access  Private (Industry)
 */
export async function getOrders(req, res, next) {
  try {
    const orders = await Order.find({ industryId: req.user._id }).sort({ createdAt: -1 });

    const formatted = orders.map((o) => ({
      _id: o._id,
      id: o.orderId,
      polymer: o.polymer,
      quantity: `${o.quantityKg.toLocaleString()} kg`,
      quantityKg: o.quantityKg,
      status: o.status,
      eta: o.eta,
      destination: o.destination,
      vehicleNo: o.vehicleNo,
      driverName: o.driverName,
      driverPhone: o.driverPhone,
      currentLocation: o.currentLocation,
      coords: o.coords,
      milestones: o.milestones,
    }));

    res.status(200).json({
      success: true,
      count: formatted.length,
      shipments: formatted,
    });
  } catch (err) {
    next(err);
  }
}
