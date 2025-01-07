import {Router} from 'express';
import {
    createNode, getAllInitiativeNodes,
    getInitiativeFlow,
    updateInitiativeFlow,
    updateNode
} from "../controllers/flowNodeController.js";
import {authMiddleware} from "../middleware/authMiddleware.js";


import {createInitiative, updateNewInitiative,deleteNewInitiative, getAllInitiative, getMyInitiative,getSingleInitiative} from "../controllers2/initiativeController.js"
import {createNewObjective,updateNewObjective,deleteNewObjective,getSingleObjective} from "../controllers2/ObjectiveController.js"
import {createNewTask,getSingleTask,updateNewTask,deleteNewTask} from "../controllers2/TaskController.js";
import {getUserInfoUtil} from "../controllers2/UtilsController.js"
import {updateEverything} from "../controllers2/UtilsController.js"

const router = Router();

router.route('/user-info/:userId').get(authMiddleware,getUserInfoUtil);

router.route('/common-save/').put(authMiddleware,updateEverything);

// ///Below code should be removed if you want to switch to old version - or should be moved at the bottom.
// console.log("Reached inside router")

// //localhost:5100/api/v1/initiative2/
// router.route('/').post(authMiddleware,createInitiative).put(authMiddleware, updateNewInitiative).delete(authMiddleware, deleteNewInitiative).get(authMiddleware,getMyInitiative);


// //this must be above get single init.
// //localhost:5100/api/v1/initiative2/all-initiatives
// router.route('/all-initiatives').get(getAllInitiative);



// //localhost:5100/api/v1/initiative2/Test1234
// router.route('/:initiative').get(getSingleInitiative);


// //createObjective
// router.route('/:initiative/objective/:objectiveId').get(getSingleObjective);
// router.route('/:initiative/objective').post(authMiddleware,createNewObjective).put(authMiddleware,updateNewObjective).delete(authMiddleware, deleteNewObjective);
// //Delete objective is nothing but archive.



// //moved to objective id and task id because objectives and tasks can have same names
// router.route('/:initiative/objective/task/:taskId').get(getSingleTask);
// router.route('/:initiative/objective/task').post(authMiddleware,createNewTask).put(authMiddleware,updateNewTask).delete(authMiddleware, deleteNewTask);


//below is a redesign
// CURD  -  initiative.
// history of initiative in single mongo doc.
//{
//}
//CURD Create goal(s)

//CURD Tasks


export default router;