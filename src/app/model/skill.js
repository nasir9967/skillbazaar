import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    location: { type: String, required: true },
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    businessName: { type: String, required: true },
    businessEmail: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    images: [{ type: String }], // Array of image URLs
    tags: [{ type: String }], // Array of skill tags
  },
  { timestamps: true }
);

export default mongoose.models.Skill || mongoose.model('Skill', skillSchema);
