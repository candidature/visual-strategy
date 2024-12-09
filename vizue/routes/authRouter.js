import {Router} from 'express';

import {loginUser, registerUser, logoutUser}
    from '../controllers/authController.js'

import {validateLoginInput, validateRegisterInput} from "../middleware/validationMiddleware.js";

const router = Router();

router.route('/register').post(validateRegisterInput,registerUser);
router.route('/login').post(validateLoginInput,loginUser);
//logout
router.route('/logout').get(logoutUser);
// router.route('/:id').get(validateIdParamInDB,getInitiative).
// patch(validateInitiativeInput,validateIdParamInDB,updateInitiative).
// delete(validateIdParamInDB,deleteInitiative);

export default router;