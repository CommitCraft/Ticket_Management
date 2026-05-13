import { Router } from 'express';
import { createPermission, deletePermission, listPermissions, updatePermission } from '../controllers/permission.controller.js';
import { protect, permitPermissions } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { permissionSchema } from '../validators/role.validator.js';
import { PERMISSIONS } from '../constants/roles.js';

export const permissionRouter = Router();

permissionRouter.get('/', protect, permitPermissions(PERMISSIONS.PERMISSION_READ), listPermissions);
permissionRouter.post('/', protect, permitPermissions(PERMISSIONS.PERMISSION_WRITE), validateBody(permissionSchema), createPermission);
permissionRouter.patch('/:id', protect, permitPermissions(PERMISSIONS.PERMISSION_WRITE), validateBody(permissionSchema.partial()), updatePermission);
permissionRouter.delete('/:id', protect, permitPermissions(PERMISSIONS.PERMISSION_WRITE), deletePermission);
