import { Schema, model, type InferSchemaType } from 'mongoose';

const departmentSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    slaHoursByPriority: {
      low: { type: Number, default: 72 },
      medium: { type: Number, default: 48 },
      high: { type: Number, default: 24 },
      urgent: { type: Number, default: 8 }
    }
  },
  { timestamps: true }
);

export type IDepartment = InferSchemaType<typeof departmentSchema>;
export const Department = model('Department', departmentSchema);
