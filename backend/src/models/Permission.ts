import { Schema, model, type InferSchemaType } from 'mongoose';

const permissionSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    module: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

export type IPermission = InferSchemaType<typeof permissionSchema>;
export const Permission = model('Permission', permissionSchema);
