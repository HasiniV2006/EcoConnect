import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    customId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    citizenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    citizenName: {
      type: String,
      required: true,
    },
    citizenPhone: {
      type: String,
      default: '',
    },
    ward: {
      type: String,
      default: 'Sector 14',
    },
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: [
        'Pothole / Road Damage',
        'Street Light Outage',
        'Garbage Overflow',
        'Water Supply Issue',
        'Drainage / Sewage',
        'Public Safety Hazard',
        'Noise / Pollution',
        'Overflowing Bin',
        'Illegal Dumping',
        'Missed Pickup',
        'Hazardous Plastic',
        'Burning Waste',
        'Other',
      ],
    },
    location: {
      type: String,
      required: [true, 'Please provide the issue location'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    photoUrl: {
      type: String,
      default: null,
    },
    photoPublicId: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['Submitted', 'Assigned', 'In Progress', 'Resolved', 'Rejected'],
      default: 'Submitted',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    assignedTeam: {
      type: String,
      default: null,
    },
    assignedAt: {
      type: Date,
      default: null,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    resolutionNotes: {
      type: String,
      default: '',
    },
    timeline: [
      {
        step: { type: String, required: true },
        date: { type: String, required: true },
        time: { type: String, default: '' },
        status: { type: String, enum: ['completed', 'current', 'upcoming'], default: 'completed' },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Complaint = mongoose.model('Complaint', complaintSchema);
