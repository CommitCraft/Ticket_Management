import { Schema, model, type InferSchemaType } from 'mongoose';

const roleSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    permissions: [{ type: String, required: true }],
    isSystem: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export type IRole = InferSchemaType<typeof roleSchema>;
export const Role = model('Role', roleSchema);
