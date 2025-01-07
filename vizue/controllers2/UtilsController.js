import {StatusCodes} from "http-status-codes";
import FlowSchema from "../models/FlowModel.js";
import InitiativeModel from "../models/InitiativeModel.js";
import {v4 as uuidv4} from "uuid";
import { nanoid } from 'nanoid';
import {logger} from '../utils/logger.js'
import e from "express";
import UserModel from "../models/UserModel.js";




//Get a single initiative details.
export const getUserInfoUtil = async (req, res) => {

    const { userId } = req.params;

    if(!userId) {
        return res.status(StatusCodes.NOT_FOUND).json({"message": "Empty userId asked for!"});
    }

    const userFromDb = await UserModel
        //.findOne({"nodes.data.name":initiative})
        .findById(userId)
        //.findOne({$and:[{"nodes.type": "INITIATIVE_NODE"},{"nodes.data.name":initiative}]})
        .then(async (user) => {
            return res.status(StatusCodes.OK).json(user);
        }).catch((err) => {
            return res.status(StatusCodes.BAD_REQUEST).json({"message": err.message});
        })
}

//TBD - any closed objective to move to archived after N months.
//toggle from frontend can show closed but not archived.
//archived can be unarchived using admin work to be implemented.

// export const deleteNewObjective = async (req,res) => {

//     const { initiative } = req.params;
//     console.log("Deleting " + initiative)

//     //await FlowSchema.findById(req.body._id)
//     await FlowSchema.findOne({$and:[{"nodes.type": "INITIATIVE_NODE"},{"nodes.data.name":initiative}]})
//     .then(document=>{
//         if(document) {
//             let foundNode = false
//             //Now we have document, objective may be inside nodes of this document.
//             if(Object.keys(document).length !== 0) {
                
//                 document?.nodes.map((node)=>{
//                     console.log("Looping the node "+ node.id)
//                     if (node?.id === req.body?.nodes?.id) {
//                         console.log("Node found")

//                         foundNode=true
//                         node.data.state="ARCHIVED";


//                         const finalUpdatedDoc = FlowSchema.findOneAndReplace({_id: document._id}, document).then((data)=>{
//                             console.log("document"+document)
//                             //console.log("data"+data)
//                             //return res.status(StatusCodes.OK).json(document);
//                         })
//                         .catch((err)=> {
//                             console.log(err)
//                             return res.status(StatusCodes.BAD_REQUEST).json({"message": err.message});

//                         })
//                         if(finalUpdatedDoc) {
//                             res.status(StatusCodes.OK).json(document);
//                         } else {
//                             return res.status(StatusCodes.BAD_REQUEST).json({"message": "Failed to save doc."});
//                         }

//                     }
//                 })

//             } else {
//                 return res.status(StatusCodes.NOT_FOUND).json({"message": "No nodes found in document"});
//             }
//             if(!foundNode) throw new Error('No such node with id '+ req.body?.nodes?.id + " inside doc "+ req.body._id);
//         } else {
//             return res.status(StatusCodes.NOT_FOUND).json({"message": "No document found"});
//         }
//     })
//     .catch((err)=> {
//         console.log(err)
//         return res.status(StatusCodes.BAD_REQUEST).json({"message": err.message});

//     })

//     return res.status(StatusCodes.NOT_FOUND).json({"message": "No document found"});

// }

//This is needed to frequently save the data when nodes move
//Frontend sends entire json and does not know which one has moved. (actually knows) but it's too hard to call
// individual endpoint depending on if initiative moved or objective moved or task or something else.
//mostly this will capture motions and edges. usually it should not modify any data.
//technically you can have data changes also thru this in the cases when user press the save button and we do not have save on data changes.
//in our implementation we would call post on every data change so practically it should be when position is changed, new nodes added kind of action.

export const updateEverything = async (req, res) => {
    // const { initiative } = req.params;
    console.log("inside new update initiative")
    //This must be document id
    console.log("Document id", req.body._id)

    //console.log(req.body);

    let foundDocument={}
    await FlowSchema.findById(req.body._id)
    .then(document=>{
        if(document) {
            
            let foundNode = false
            //below code is common
            if(Object.keys(document).length !== 0) {
                //let newValue= {}
                //newValue.updated_by = req.jwtData.userId;
                let newDoc = findAndModifyNodeChanges(document, req.body, req.jwtData.userId)
                console.log(newDoc)
                // console.log("=======for database entry========")
                // console.log(newValues)
                // //Below we modify that particular node
                // node = newValues;

                //.findOneAndReplace({$and:[{"nodes.data.name":initiative},{"nodes.id": initiativeId}]},foundData)

                const finalUpdatedDoc = FlowSchema.findOneAndReplace({_id: document._id}, newDoc).then((data)=>{
                    console.log("document"+document)
                    //console.log("data"+data)
                    //return res.status(StatusCodes.OK).json(document);
                })
                .catch((err)=> {
                    console.log(err)
                    return res.status(StatusCodes.BAD_REQUEST).json({"message": err.message});

                })
                if(finalUpdatedDoc) {
                    res.status(StatusCodes.OK).json(document);
                } else {
                    return res.status(StatusCodes.BAD_REQUEST).json({"message": "Failed to save doc."});
                }
                //updateDocument(document)
                
            } else {
                return res.status(StatusCodes.BAD_REQUEST).json({"message": "Found empty document found with given id, possibly server error"});
            }

        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({"message": "No document found with given id"});
        }
    }).catch(error=>{
        return res.status(StatusCodes.BAD_REQUEST).json({"message": error.message});
    })       
}


function findAndModifyNodeChanges(initialDocument,newDocument, updated_by) {
    console.log("==========================old data===================")
    //console.log(initialDocument)
    console.log("==========================new data===================")
    //console.log(newDocument)
    //Change position, updated by and measured
    //update nodes
    newDocument.nodes.map((node, index)=>{
        if(node.type===initialDocument.nodes[index].type && node.id=== initialDocument.nodes[index].id){
            //now replace
            initialDocument.nodes[index].position = node.position
            initialDocument.nodes[index].measured = node.measured
            
            //initialDocument.nodes[index].updated_by = updated_by  //this should be changed only if this particular node is updated. in our case we are updating this value of all the node this will reflect potentially as bug - TBD IMP!!
            //We can add date/time of update here.. if required.. let's see technically this should be in history

        }//node.position
    })

    initialDocument.updated_by = updated_by
    initialDocument.viewport = newDocument.viewport
    initialDocument.edges = newDocument.edges

    return initialDocument
}
