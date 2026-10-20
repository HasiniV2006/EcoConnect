import express from 'express';
import {
  getDashboard,
  getMarketplace,
  createPurchaseRequest,
  getMyPurchaseRequests,
  getAllPurchaseRequests,
  approvePurchaseRequest,
  rejectPurchaseRequest,
  getOrders,
} from '../controllers/industryController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Industry routes
router.get('/dashboard', requireAuth, requireRole('industry', 'municipality'), getDashboard);
router.get('/marketplace', requireAuth, getMarketplace);
router.post('/purchase-requests', requireAuth, requireRole('industry', 'municipality'), createPurchaseRequest);
router.get('/purchase-requests/mine', requireAuth, getMyPurchaseRequests);
router.get('/orders', requireAuth, getOrders);

// Municipality routes for approving/rejecting industry orders
router.get('/purchase-requests', requireAuth, requireRole('municipality'), getAllPurchaseRequests);
router.patch('/purchase-requests/:id/approve', requireAuth, requireRole('municipality'), approvePurchaseRequest);
router.patch('/purchase-requests/:id/reject', requireAuth, requireRole('municipality'), rejectPurchaseRequest);

export default router;
