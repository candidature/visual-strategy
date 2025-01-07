import {Router} from 'express';
import {getApplicationStatus, getCurrentUser, updateUser, getUsers} from "../controllers/userController.js";
import {validateUpdateUserInput} from "../middleware/validationMiddleware.js";
import {authMiddleware, authorizePermissionMiddleware} from "../middleware/authMiddleware.js";

const router = Router();

router.route('/current-user').get(getCurrentUser);
router.route('/admin/app-stats').get([authorizePermissionMiddleware("admin"),getApplicationStatus]);


//logout
router.route('/update-user').patch(validateUpdateUserInput,updateUser);

router.route('/').get(authMiddleware,getUsers);


export default router;