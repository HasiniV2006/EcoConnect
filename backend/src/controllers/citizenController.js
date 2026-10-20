import { User } from '../models/User.js';
import { PickupRequest } from '../models/PickupRequest.js';
import { Complaint } from '../models/Complaint.js';
import { CreditTransaction } from '../models/CreditTransaction.js';

/**
 * @desc    Get aggregated metrics for citizen dashboard
 * @route   GET /api/citizen/dashboard
 * @access  Private (Citizen)
 */
export async function getDashboard(req, res, next) {
  try {
    const userId = req.user._id;

    const [user, pickups, complaints] = await Promise.all([
      User.findById(userId),
      PickupRequest.find({ citizenId: userId }),
      Complaint.find({ citizenId: userId }),
    ]);

    const verifiedPickups = pickups.filter((p) => p.verified);
    const totalRecycledKg = verifiedPickups.reduce((acc, p) => acc + (p.weightKg || 0), 0);
    const resolvedIssuesCount = complaints.filter((c) => c.status === 'Resolved').length;

    // Upcoming scheduled pickup
    const upcomingPickup = pickups.find((p) => p.status === 'scheduled');
    const nextPickupDate = upcomingPickup ? upcomingPickup.pickupDate : 'Not Scheduled';

    res.status(200).json({
      success: true,
      metrics: {
        recycledWeightKg: parseFloat(totalRecycledKg.toFixed(1)),
        walletPoints: user ? user.walletPoints : 0,
        resolvedIssues: resolvedIssuesCount,
        nextPickup: nextPickupDate,
      },
      recentPickups: pickups.slice(0, 5),
      recentComplaints: complaints.slice(0, 5),
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @desc    Get citizen credits balance
 * @route   GET /api/citizen/credits
 * @access  Private (Citizen)
 */
export async function getCredits(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      walletPoints: user ? user.walletPoints : 0,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @desc    Get credit transaction history
 * @route   GET /api/citizen/credits/transactions
 * @access  Private (Citizen)
 */
export async function getCreditTransactions(req, res, next) {
  try {
    const txns = await CreditTransaction.find({ citizenId: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      transactions: txns,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @desc    Redeem a civic perk/voucher with points
 * @route   POST /api/citizen/credits/redeem
 * @access  Private (Citizen)
 */
export async function redeemVoucher(req, res, next) {
  try {
    const { perkTitle, cost } = req.body;
    const pointCost = Number(cost);

    if (!pointCost || pointCost <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid point cost' });
    }

    const user = await User.findById(req.user._id);
    if (!user || user.walletPoints < pointCost) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient points in your green wallet',
      });
    }

    user.walletPoints -= pointCost;
    await user.save();

    const voucherCode = `ECO-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const txn = await CreditTransaction.create({
      transactionId: `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      citizenId: user._id,
      amount: -pointCost,
      type: 'voucher_redemption',
      description: `Redeemed: ${perkTitle || 'Civic Perk'} (Code: ${voucherCode})`,
      balanceAfter: user.walletPoints,
    });

    res.status(200).json({
      success: true,
      message: 'Perk redeemed successfully!',
      voucherCode,
      newBalance: user.walletPoints,
      transaction: txn,
    });
  } catch (err) {
    next(err);
  }
}
