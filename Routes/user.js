import express from 'express'
import { 
    updateUser, 
    deleteUser, 
    getAllUser, 
    getSingleUser 
} from '../Controllers/userController.js'

import { authenticate, restrict } from '../auth/verifyToken.js'

const router = express.Router();

router.get('/:id', authenticate, restrict(['pet_owner']), getSingleUser);
router.get('/',authenticate, restrict(['admin']), getAllUser);
router.put('/:id', authenticate, restrict(['pet_owner']), updateUser);
router.delete('/:id', authenticate, restrict(['pet_owner']), deleteUser);

export default router;

