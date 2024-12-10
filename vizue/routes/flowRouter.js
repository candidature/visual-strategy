import {Router} from 'express';
import {
    createNode, getAllInitiativeNodes,
    getInitiativeFlow,
    updateInitiativeFlow,
    updateNode
} from "../controllers/flowNodeController.js";
import {authMiddleware} from "../middleware/authMiddleware.js";
import {
    validateIdParamInDB,
    validateIdParamInDBWithRWAccess,
    validateInitiativeInput
} from "../middleware/validationMiddleware.js";
import {deleteInitiative, getInitiative, updateInitiative} from "../controllers/initiativeController.js";
import {getSingleNode, updateSingleNode} from "../controllers/singleFlowNodeController.js";
import {getSingleObjective, updateSingleObjective} from "../controllers/singleObjectiveController.js";
import {getSingleTask, updateSingleTask} from "../controllers/singleTaskController.js";


const router = Router();

//Actually these are for initiatives.

//TBD - below createNodes, updateNodes, getAllNodes to be renamed to createInitiative, getAllInitiative etc..
router.route('/').post(authMiddleware,createNode).put(authMiddleware,updateNode).get(getAllInitiativeNodes);

//router.route('/:id').post(createNode).put(updateNode);
//router.route('/:id').get(validateIdParamInDB,getInitiative).
//                 patch(authMiddleware,validateInitiativeInput,validateIdParamInDBWithRWAccess,updateInitiative).
//                 delete(authMiddleware,validateIdParamInDBWithRWAccess,deleteInitiative);


router.route('/:initiative').get(getInitiativeFlow).put(authMiddleware,updateInitiativeFlow);

router.route('/:initiative/:initiativeId').get(getSingleNode).put(updateSingleNode);

router.route('/:initiative/objective/:objectiveId').get(getSingleObjective).put(updateSingleObjective);

router.route('/:initiative/task/:taskId').get(getSingleTask).put(authMiddleware,updateSingleTask);


//below is a redesign
// CURD  -  initiative.
// history of initiative in single mongo doc.
//{
//}
//CURD Create goal(s)

//CURD Tasks


export default router;