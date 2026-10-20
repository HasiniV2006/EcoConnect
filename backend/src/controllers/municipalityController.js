import { Complaint } from '../models/Complaint.js';
import { PickupRequest } from '../models/PickupRequest.js';
import { InventoryBatch } from '../models/InventoryBatch.js';
import { InventoryTransaction } from '../models/InventoryTransaction.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { PurchaseRequest } from '../models/PurchaseRequest.js';

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
