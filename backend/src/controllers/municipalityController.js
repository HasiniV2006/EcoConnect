import { Complaint } from '../models/Complaint.js';
import { PickupRequest } from '../models/PickupRequest.js';
import { InventoryBatch } from '../models/InventoryBatch.js';
import { InventoryTransaction } from '../models/InventoryTransaction.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { PurchaseRequest } from '../models/PurchaseRequest.js';
import { Order } from '../models/Order.js';

/**
 * @desc    Get aggregated municipal command hub metrics
 * @route   GET /api/municipality/dashboard
 * @access  Private (Municipality)
 */
export async function getDashboard(req, res, next) {
  try {
    const [
      openComplaintsCount,
      activePickupsCount,
      completedPickups,
      inventoryBatches,
      pendingIndustryOrdersCount,
      recentActivity,
    ] = await Promise.all([
      Complaint.countDocuments({ status: { $in: ['Submitted', 'Assigned', 'In Progress'] } }),
      PickupRequest.countDocuments({ status: { $in: ['pending', 'scheduled'] } }),
      PickupRequest.find({ verified: true }).select('weightKg'),
      InventoryBatch.find(),
      PurchaseRequest.countDocuments({ status: 'Pending Review' }),
      ActivityLog.find().sort({ createdAt: -1 }).limit(10),
    ]);

    const totalCollectedKg = completedPickups.reduce((acc, curr) => acc + (curr.weightKg || 0), 0);
    const totalInventoryStockKg = inventoryBatches.reduce((acc, curr) => acc + (curr.currentStockKg || 0), 0);

    res.status(200).json({
      success: true,
      metrics: {
        openComplaints: openComplaintsCount,
        activePickups: activePickupsCount,
        collectedWeightKg: parseFloat(totalCollectedKg.toFixed(1)),
        inventoryStockKg: parseFloat(totalInventoryStockKg.toFixed(1)),
        pendingOrders: pendingIndustryOrdersCount,
      },
      recentActivity,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @desc    Get activity logs
 * @route   GET /api/municipality/activity-logs
 * @access  Private (Municipality)
 */
export async function getActivityLogs(req, res, next) {
  try {
    const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(50);
    res.status(200).json({
      success: true,
      logs,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @desc    Get current polymer inventory stock
 * @route   GET /api/municipality/inventory
 * @access  Private (Municipality)
 */
export async function getInventory(req, res, next) {
  try {
    const batches = await InventoryBatch.find().sort({ polymerType: 1 });
    res.status(200).json({
      success: true,
      batches,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @desc    Get inventory transactions / audit log
 * @route   GET /api/municipality/inventory/transactions
 * @access  Private (Municipality)
 */
export async function getInventoryTransactions(req, res, next) {
  try {
    const transactions = await InventoryTransaction.find().sort({ createdAt: -1 }).limit(50);
    res.status(200).json({
      success: true,
      transactions,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @desc    Get real-time notification counts and items for Municipality
 * @route   GET /api/municipality/notifications
 * @access  Private (Municipality)
 */
export async function getMunicipalityNotifications(req, res, next) {
  try {
    const [
      pendingPurchaseRequests,
      openComplaints,
      pendingPickups,
      awaitingLoadingOrders,
    ] = await Promise.all([
      PurchaseRequest.find({ status: 'Pending Review' }).sort({ createdAt: -1 }),
      Complaint.find({ status: { $in: ['Submitted', 'Assigned', 'In Progress'] } }).sort({ createdAt: -1 }),
      PickupRequest.find({ status: { $in: ['pending', 'scheduled'] } }).sort({ createdAt: -1 }),
      Order.find({ status: 'Truck Dispatched', 'loadingOtp.verified': { $ne: true } }).sort({ updatedAt: -1 }),
    ]);

    const notifications = [];

    pendingPurchaseRequests.forEach((r) => {
      notifications.push({
        id: `pr-${r._id}`,
        title: 'New Purchase Request',
        message: `${r.companyName} requested ${r.quantityKg} kg of ${r.polymerType}`,
        timestamp: r.createdAt,
        type: 'order',
        linkTab: 'orders',
      });
    });

    awaitingLoadingOrders.forEach((o) => {
      notifications.push({
        id: `load-${o._id}`,
        title: 'Loading Verification Required',
        message: `Order ${o.orderId} dispatched truck. Awaiting weighbridge OTP verification.`,
        timestamp: o.updatedAt || o.createdAt,
        type: 'loading',
        linkTab: 'orders',
      });
    });

    openComplaints.forEach((c) => {
      notifications.push({
        id: `comp-${c._id}`,
        title: 'Citizen Complaint Active',
        message: `${c.customId || c.title}: ${c.category} in ${c.location || 'Ward'} (${c.status})`,
        timestamp: c.createdAt,
        type: 'complaint',
        linkTab: 'complaints',
      });
    });

    pendingPickups.forEach((p) => {
      notifications.push({
        id: `pick-${p._id}`,
        title: 'Doorstep Pickup Pending',
        message: `${p.customId}: ${p.citizenName || 'Resident'} requested collection for ${p.requestedDate}`,
        timestamp: p.createdAt,
        type: 'pickup',
        linkTab: 'collections',
      });
    });

    // Sort all notifications by most recent
    notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Actionable count: items that directly require municipal action/approval
    const actionableCount = pendingPurchaseRequests.length + awaitingLoadingOrders.length;

    res.status(200).json({
      success: true,
      count: actionableCount,
      total: notifications.length,
      badges: {
        complaints: openComplaints.length,
        collections: pendingPickups.length,
        orders: pendingPurchaseRequests.length + awaitingLoadingOrders.length,
      },
      notifications,
    });
  } catch (err) {
    next(err);
  }
}

