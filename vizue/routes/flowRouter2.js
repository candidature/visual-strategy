import {Router} from 'express';
import {
    createNode, getAllInitiativeNodes,
    getInitiativeFlow,
    updateInitiativeFlow,
    updateNode
} from "../controllers/flowNodeController.js";
import {authMiddleware} from "../middleware/authMiddleware.js";


import {createInitiative, updateNewInitiative,deleteNewInitiative, getAllInitiative, getMyInitiative,getSingleInitiative,getSingleInitiativeByDocId} from "../controllers2/initiativeController.js"
import {createNewObjective,updateNewObjective,deleteNewObjective,getSingleObjective} from "../controllers2/ObjectiveController.js"
import {createNewTask,getSingleTask,updateNewTask,deleteNewTask} from "../controllers2/TaskController.js";
import {createNewStory,updateNewStory, deleteNewStory, getSingleStory} from "../controllers2/StoryController.js"
import {createNewEdge,deleteNewEdge, savePositionSize} from "../controllers2/EdgeController.js"
const router = Router();



// //Actually these are for initiatives.

// //TBD - below createNodes, updateNodes, getAllNodes to be renamed to createInitiative, getAllInitiative etc..
// router.route('/').post(authMiddleware,createNode).put(authMiddleware,updateNode).get(getAllInitiativeNodes);

// //router.route('/:id').post(createNode).put(updateNode);
// //router.route('/:id').get(validateIdParamInDB,getInitiative).
// //                 patch(authMiddleware,validateInitiativeInput,validateIdParamInDBWithRWAccess,updateInitiative).
// //                 delete(authMiddleware,validateIdParamInDBWithRWAccess,deleteInitiative);


// router.route('/:initiative').get(getInitiativeFlow).put(authMiddleware,updateInitiativeFlow);

// router.route('/:initiative/:initiativeId').get(getSingleNode).put(updateSingleNode);

// router.route('/:initiative/objective/:objectiveId').get(getSingleObjective).put(updateSingleObjective);

// router.route('/:initiative/task/:taskId').get(getSingleTask).put(authMiddleware,updateSingleTask);



///Below code should be removed if you want to switch to old version - or should be moved at the bottom.
console.log("Reached inside router")

//localhost:5100/api/v1/initiative2/
router.route('/').post(authMiddleware,createInitiative).put(authMiddleware, updateNewInitiative).delete(authMiddleware, deleteNewInitiative).get(authMiddleware,getMyInitiative);


//this must be above get single init.
//localhost:5100/api/v1/initiative2/all-initiatives
router.route('/all-initiatives').get(getAllInitiative);


//TBD
//Save connections
//Save viewport.

router.route('/initiative/:initiative/edge/').post(authMiddleware,createNewEdge);
router.route('/initiative/:initiative/edge/:id').delete(authMiddleware,deleteNewEdge);

//router.route('/initiative/:initiative/viewport').put(authMiddleware,updateViewport);

//localhost:5100/api/v1/initiative2/Test1234
router.route('/:initiative').get(getSingleInitiative);

router.route('/initiative/:docId').get(getSingleInitiativeByDocId);


//createObjective
router.route('/:initiative/objective/:objectiveId').get(getSingleObjective);
router.route('/:initiative/objective').post(authMiddleware,createNewObjective).put(authMiddleware,updateNewObjective).delete(authMiddleware, deleteNewObjective);
//Delete objective is nothing but archive.

router.route('/:initiative/position-size/:id').put(authMiddleware,savePositionSize)

//moved to objective id and task id because objectives and tasks can have same names
router.route('/:initiative/objective/task/:taskId').get(getSingleTask);
router.route('/:initiative/objective/task').post(authMiddleware,createNewTask).put(authMiddleware,updateNewTask).delete(authMiddleware, deleteNewTask);



//moved to objective id and task id because objectives and tasks can have same names
router.route('/:initiative/objective/story/:storyId').get(getSingleStory);
router.route('/:initiative/objective/story').post(authMiddleware,createNewStory).put(authMiddleware,updateNewStory).delete(authMiddleware, deleteNewStory);



//below is a redesign
// CURD  -  initiative.
// history of initiative in single mongo doc.
//{
//}
//CURD Create goal(s)

//CURD Tasks


export default router;