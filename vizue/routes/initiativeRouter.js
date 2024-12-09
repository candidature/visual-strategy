import {Router} from 'express';

import {getAllInitiatives, getInitiative, createInitiative, updateInitiative, deleteInitiative}
    from '../controllers/initiativeController.js'
import {
    validateIdParam,
    validateIdParamInDB,
    validateIdParamInDBWithRWAccess,
    validateInitiativeInput
} from "../middleware/validationMiddleware.js";
import {authMiddleware} from "../middleware/authMiddleware.js";

const router = Router();


router.route('/').get(getAllInitiatives).post(authMiddleware,validateInitiativeInput, createInitiative);

//we are using different validation for write req (except for the port) this is to make sure
//We do not allow to put/delete if you are not the owner or admin or added to writeAccesses list on the modal.

//We have also added authMiddleware for edit/delete operations to make sure user is authenticated to do any writes.

router.route('/:id').get(validateIdParamInDB,getInitiative).
                patch(authMiddleware,validateInitiativeInput,validateIdParamInDBWithRWAccess,updateInitiative).
                delete(authMiddleware,validateIdParamInDBWithRWAccess,deleteInitiative);


//We need to think to add new route so that we can allow teams to be able to add new write accesses.
router.route('/:id/write_access').get(validateIdParamInDB,getInitiative).
    patch(validateInitiativeInput,validateIdParamInDB,updateInitiative).
    delete(validateIdParamInDB,deleteInitiative);


export default router;