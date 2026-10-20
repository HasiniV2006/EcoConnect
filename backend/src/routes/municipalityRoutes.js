import express from 'express';
import {
  getDashboard,
  getActivityLogs,
  getInventory,
  getInventoryTransactions,
} from '../controllers/municipalityController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

import {
  getAllPurchaseRequests,
  approvePurchaseRequest,
  rejectPurchaseRequest,
} from '../controllers/industryController.js';

const router = express.Router();

router.use(requireAuth);
router.use(requireRole('municipality'));

router.get('/dashboard', getDashboard);
router.get('/activity-logs', getActivityLogs);
router.get('/inventory', getInventory);
router.get('/inventory/transactions', getInventoryTransactions);
router.get('/purchase-requests', getAllPurchaseRequests);
router.patch('/purchase-requests/:id/approve', approvePurchaseRequest);
router.patch('/purchase-requests/:id/reject', rejectPurchaseRequest);

export default router;
