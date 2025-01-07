import {StatusCodes} from "http-status-codes";
import FlowSchema from "../models/FlowModel.js";
import InitiativeModel from "../models/InitiativeModel.js";
import {v4 as uuidv4} from "uuid";
import { nanoid } from 'nanoid';
import {logger} from '../utils/logger.js'



// export const getInitiativeFlow = async (req, res) => {
//     const { initiative } = req.params;


//     console.log(initiative+".");

//     const initiativeData = await FlowSchema
//         .findOne({$and:[{"nodes.type": "INITIATIVE_NODE"},{"nodes.data.name":initiative}]})
//         .then(async (data) => {
//             if(!data) {
//                 return res.status(StatusCodes.NOT_FOUND).json({"message": "No such initiative found!"});
//             }
//             return res.status(StatusCodes.OK).json({"data": data});
//         }).catch((err) => {
//             return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({"message": err.message});
//         })
// }

export const updateNewInitiative = async (req, res) => {
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
                document?.nodes.map((node)=>{
                    if (node?.type === "INITIATIVE_NODE") {
                        console.log("Found node too", node.id)
                        foundNode=true
                        //let newValue= {}
                        //newValue.updated_by = req.jwtData.userId;
                        let newValues = modifyInitiativeFields(node, req.body?.nodes)
            

                        //Below we modify that particular node
                        node = newValues;

                        //.findOneAndReplace({$and:[{"nodes.data.name":initiative},{"nodes.id": initiativeId}]},foundData)

                        const finalUpdatedDoc = FlowSchema.findOneAndReplace({_id: document._id}, document).then((data)=>{
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
                        
                    }
                })
            } else {
                return res.status(StatusCodes.BAD_REQUEST).json({"message": "Found empty document found with given id, possibly server error"});
            }
            if(!foundNode) throw new Error('No such node with id '+ req.body?.nodes?.id + " inside doc "+ req.body._id);

        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({"message": "No document found with given id"});
        }
    }).catch(error=>{
        return res.status(StatusCodes.BAD_REQUEST).json({"message": error.message});
    })       
}



function modifyInitiativeFields(initialValue,newValue) {
    console.log(initialValue)
    console.log(newValue)
    if(newValue.visibility) {
        initialValue.visibility = newValue.visibility
    }
    //initialValue.updated_by = req.jwtData.userId;
    
    if(newValue.deletable) {
        initialValue.deletable = newValue.deletable
    }
    if(newValue.position) {
        initialValue.position = newValue.position
    }

    //Now at data level
    if(newValue?.data?.name) {
        initialValue.data.name = newValue.data.name
    }
    
    if(newValue?.data?.description) {
        initialValue.data.description = newValue.data.description
    }
    
    if(newValue.data?.assigned_to) {
        initialValue.data.assigned_to = newValue.data.assigned_to
    }
    
    if(newValue.data.access_labels) {
        initialValue.data.access_labels = newValue.data.access_labels
    }

    if(newValue.data?.general_labels) {
        initialValue.data.general_labels = newValue.data.general_labels
    }
    if(newValue.data?.kpis) {
        initialValue.data.kpis = newValue.data.kpis
    }
    
    return(initialValue)
}


//Delete initiative
export const deleteNewInitiative = async (req, res) => {
    // const { initiative } = req.params;
    console.log("inside new delete initiative")
    //This must be document id
    console.log("Document id", req.body._id)

    //console.log(req.body);

    let warnings = []
    
    let foundDocument={}
    await FlowSchema.findById(req.body._id)
    .then(document=>{
        if(document) {
            let foundNode = false
            //below code is common
            if(Object.keys(document).length !== 0) {
                document?.nodes.map((node)=>{
                    if (node.type==="INITIATIVE_NODE") {
                        console.log("Found node too", req.body?.nodes?.id)
                        foundNode=true
                        //let newValue= {}
                        
                        //let newValues = modifyInitiativeFieldsToArchive(node, req.body?.nodes)
                        
                        node.updated_by = req.jwtData.userId;
                        node.data.state="ARCHIVED"
                        
                        //.findOneAndReplace({$and:[{"nodes.data.name":initiative},{"nodes.id": initiativeId}]},foundData)

                        const finalUpdatedDoc = FlowSchema.findOneAndReplace({_id: document._id}, document).then((data)=>{
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
                        
                    }
                })
            } else {
                return res.status(StatusCodes.BAD_REQUEST).json({"message": "Found empty document found with given id, possibly server error"});
            }
            if(!foundNode) throw new Error('No such initiative node with id '+ req.body?.nodes?.id + " inside doc "+ req.body._id);

        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({"message": "No document found with given id"});
        }
    }).catch(error=>{
        return res.status(StatusCodes.BAD_REQUEST).json({"message": error.message});
    })       
}


    // })

    // const updatedInitiative = await FlowSchema
    //     .findOne({$and:[{"nodes.type": "INITIATIVE_NODE"},{"nodes.data.name":req.body.name}]},req.body)
    //     .then(async (data) => {
    //         console.log(data)
            
    //         return res.status(StatusCodes.OK).json({data});
    //     }).catch((err) => {
    //         return res.status(StatusCodes.BAD_REQUEST).json({"message": err.message});
    // })

    
    // const updatedInitiative = await FlowSchema
    //     //.findOneAndReplace({$and:[{"nodes.type": "INITIATIVE_NODE"},{"nodes.data.name":req.body.name}]},req.body)
    //     .findOne({$and:[{"nodes.type": "INITIATIVE_NODE"},{"nodes.data.name":req.body.nodes.data.name}]})
    //     .then(async (data) => {
    //         if(!data) {
    //             return res.status(StatusCodes.NOT_FOUND).json({"message": "No initiative data found with name "+ req.body.nodes.data.name});
    //         }
    //         console.log(data)
            
    //         return res.status(StatusCodes.OK).json({data});
    //     }).catch((err) => {
    //         return res.status(StatusCodes.BAD_REQUEST).json({"message": err.message});
    // })

//}



// export const getAllInitiativeNodes = async (req, res) => {
//     let initiativesData = []
//     const initiativesFromDb = await FlowSchema
//         //.findOne({"nodes.data.name":initiative})
//         .find({"nodes.type": "INITIATIVE_NODE"})
//         .then(async (data) => {
//             //initiativesData.push(data.name)
//             data.map((d)=>{
//                 d?.nodes.map((node)=>{
//                     if(node?.type==="INITIATIVE_NODE"){
//                         console.log(node?.data?.name);
//                         initiativesData.push({name: node?.data?.name, data: node?.data});
//                     }
//                 })
//             })
//             // data.nodes.map((node)=>{
//             //   console.log(node.data.name)
//             // })
//             return res.status(StatusCodes.OK).json(initiativesData);
//         }).catch((err) => {
//             return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({"message": err.message});
//         })
// }

// export const updateNode = async (req, res) => {
//     const {initiative} = req.query;
//     // if(!initiative) {
//     //     return res.status(StatusCodes.BAD_REQUEST).json({"message": "Must specify initiative name even to update"});
//     // }
//     console.log(req.body);


//     const initiativeFromDb = await FlowSchema
//         //.findOne({"nodes.data.name":initiative})
//         .findOneAndReplace({$and:[{"nodes.type": "INITIATIVE_NODE"},{"nodes.data.name":initiative}]},req.body)
//         .then(async (data) => {
//             if (!data) {
//                 //this section creates the record
//                 const newInitiativeFromDb = await FlowSchema
//                     .create({"nodes": newNode})
//                     .then((data) => {
//                         return res.status(StatusCodes.CREATED).json({data});
//                     }).catch((err) => {
//                         console.log(err)
//                         return res.status(StatusCodes.BAD_REQUEST).json({"message": err.message});
//                     })

//             } else {
//                 return res.status(StatusCodes.OK).json({"message": "Already exists"});
//             }
//         }).catch((err) => {
//             return res.status(StatusCodes.BAD_REQUEST).json({"message": err.message});
//         })
// }

//Create at a position given by frontend, else create at a default position.
//Check there is no such initiative already existing.
//assign the creator the owner of initiative.

//api/v1/initiative
//{ name: "xx", x: "", y: "",}
//add: createdBy
//private/public?
//originId
//createdAt
//updatedAt
//validFrom
//revision
//viewport
//edited_by: <each version has edited by> and first version has same person as edited and committed by

export const createInitiative = async (req, res) => {
    let nodeId = nanoid()

    console.log(req.jwtData)
    
    console.log("now inside create initiative")
    //const position = screenToFlowPosition({ x: evt.clientX, y: evt.clientY });

    let initName = req.body.name.toString().trimStart().trimEnd()
    

    const newNode = {
        type: "INITIATIVE_NODE",
        visibility: req.body.visibility,
        created_by: req.jwtData.userId,
        updated_by: req.jwtData.userId,
        id: nodeId,
        deletable: false,
        position: {
            x: req.body?.position?.x || 7,
            y: req.body?.position?.y || 20,
        },
        data: {
            id: nodeId,
            name: req.body.name,
            description: req.body.description,
            assigned_to: "",
            state: req.body.status,
            access_labels: ["EVERYONE_READONLY"],
            general_labels: [""],
            kpis:[
                {
                    'name': '',
                    'description': '',
                    'ref': ''
                }
            ]
        },

    }

    const initiativeFromDb = await FlowSchema
        //.findOne({"nodes.data.name":initiative})
        .findOne({$and:[{"nodes.type": "INITIATIVE_NODE"},{"nodes.data.name":req.body.name}]})
        .then(async (data) => {
            if (!data) {
                //this section creates the record
                const newInitiativeFromDb = await FlowSchema
                    .create(
                            {
                                "nodes": newNode
                            }
                        )
                    .then((data) => {
                        return res.status(StatusCodes.CREATED).json({data});
                    }).catch((err) => {
                        return res.status(StatusCodes.BAD_REQUEST).json({"message": err});
                    })

            } else {
                return res.status(StatusCodes.BAD_REQUEST).json({"message": "Initiative with same name already exists!"});
            }
        }).catch((err) => {
            return res.status(StatusCodes.BAD_REQUEST).json({"message": err.message});
        })
}


//Get all the initiatives in the dataase.
export const getAllInitiative = async(req,res)=> {

    console.log("Getting list of inits...")
    const initiativeFromDb = await FlowSchema
        //.findOne({"nodes.data.name":initiative})
        .find({"nodes.type": "INITIATIVE_NODE"})
        .then(async (data) => {
            if (!data) {
                return res.status(StatusCodes.NOT_FOUND).json({"message": "No initiative data found"});
            } else {
                return res.status(StatusCodes.OK).json(data);
            }
        }).catch((err) => {
            return res.status(StatusCodes.BAD_REQUEST).json({"message": err.message});
        })

}

//Get initiatives of logged in user

export const getMyInitiative = async (req, res) => {
    console.log("now inside get all MY initiatives")

    if(!req.jwtData.userId) {
        return res.status(StatusCodes.NOT_FOUND).json({"message": "You must be logged in to use this route"});
    }
    console.log("now inside get all initiatives of "+ req.jwtData.userId)

    const initiativeFromDb = await FlowSchema
        //.findOne({"nodes.data.name":initiative})
        .findOne({$and:[{"nodes.type": "INITIATIVE_NODE"},{"nodes.created_by":req.jwtData.userId}]})
        .then(async (data) => {
            if (!data) {
                return res.status(StatusCodes.NOT_FOUND).json({"message": "No initiative data found"});
            } else {
                return res.status(StatusCodes.OK).json(data);
            }
        }).catch((err) => {
            return res.status(StatusCodes.BAD_REQUEST).json({"message": err.message});
        })
}


//Get a single initiative details.
export const getSingleInitiative = async (req, res) => {


    const { initiative } = req.params;
    console.log("Getting single initiative ", initiative)
    
    if(!initiative) {
        return res.status(StatusCodes.NOT_FOUND).json({"message": "Empty initivate asked for!"});
    }
    console.log("now inside get single initiative " , initiative)

    // .findOne({$and:[
    //     {"nodes.type": "INITIATIVE_NODE"},
    //     {$or: [{"_id":initiative},{"nodes.data.name":initiative}]},

    // ]})

    const initiativeFromDb = await FlowSchema
        //.findOne({"nodes.data.name":initiative})
        .findOne({$and:[{"nodes.type": "INITIATIVE_NODE"},{"nodes.data.name":initiative}]})
        .then(async (data) => {
            if (!data) {
                return res.status(StatusCodes.NOT_FOUND).json({"message": "No initiative data found"});
            } else {
                return res.status(StatusCodes.OK).json(data);
            }
        }).catch((err) => {
            return res.status(StatusCodes.BAD_REQUEST).json({"message": err.message});
        })
}


//Get a single initiative details.
export const getSingleInitiativeByDocId = async (req, res) => {


    const { docId } = req.params;
    console.log("Getting single initiative ", docId)
    
    if(!docId) {
        return res.status(StatusCodes.NOT_FOUND).json({"message": "Empty initivate asked for!"});
    }
    console.log("now inside get single initiative " , docId)

    // .findOne({$and:[
    //     {"nodes.type": "INITIATIVE_NODE"},
    //     {$or: [{"_id":initiative},{"nodes.data.name":initiative}]},

    // ]})

    const initiativeFromDb = await FlowSchema
        //.findOne({"nodes.data.name":initiative})
        .findOne({$and:[{"nodes.type": "INITIATIVE_NODE"},{"_id":docId}]})
        .then(async (data) => {
            if (!data) {
                return res.status(StatusCodes.NOT_FOUND).json({"message": "No initiative data found"});
            } else {
                return res.status(StatusCodes.OK).json(data);
            }
        }).catch((err) => {
            return res.status(StatusCodes.BAD_REQUEST).json({"message": err.message});
        })
}