import {StatusCodes} from "http-status-codes";
import FlowSchema from "../models/FlowModel.js";
import InitiativeModel from "../models/InitiativeModel.js";
import {v4 as uuidv4} from "uuid";
import { nanoid } from 'nanoid';
import {logger} from '../utils/logger.js'
import e from "express";




//Get a single initiative details.
export const getSingleObjective = async (req, res) => {


    const { initiative, objectiveId } = req.params;

    if(!initiative) {
        return res.status(StatusCodes.NOT_FOUND).json({"message": "Empty initivate asked for!"});
    }
    if(!objectiveId) {
        return res.status(StatusCodes.NOT_FOUND).json({"message": "Empty Objective asked for!"});
    }
    console.log("now inside get single initiative: " , initiative +" Objective "+ objectiveId )

    const initiativeFromDb = await FlowSchema
        //.findOne({"nodes.data.name":initiative})
        .findOne({$and:[{"nodes.type": "INITIATIVE_NODE"},{"nodes.data.name":initiative}]})
        .then(async (document) => {
            let foundNode;
            if (!document) {
                return res.status(StatusCodes.NOT_FOUND).json({"message": "objective is empty for this initiative or no such objective"});

            } else {
                if(Object.keys(document).length !== 0) {
                    foundNode = false
                    console.log("Reached here...")
                    document?.nodes.map((node)=>{
                        if (node?.data.id === objectiveId) {
                            foundNode = true
                            return res.status(StatusCodes.OK).json(node);
                        }
                    })
                } else {
                    return res.status(StatusCodes.NOT_FOUND).json({"message": "No objective found under initiative "+ initiative});
                }
                if(!foundNode) throw new Error('No such node with id '+ req.body?.nodes?.id + " inside doc "+ req.body._id);
            }
        }).catch((err) => {
            return res.status(StatusCodes.BAD_REQUEST).json({"message": err.message});
        })
}

//TBD - any closed objective to move to archived after N months.
//toggle from frontend can show closed but not archived.
//archived can be unarchived using admin work to be implemented.

export const deleteNewObjective = async (req,res) => {

    const { initiative } = req.params;
    console.log("Deleting " + initiative)

    //await FlowSchema.findById(req.body._id)
    await FlowSchema.findOne({$and:[{"nodes.type": "INITIATIVE_NODE"},{"nodes.data.name":initiative}]})
    .then(document=>{
        if(document) {
            let foundNode = false
            //Now we have document, objective may be inside nodes of this document.
            if(Object.keys(document).length !== 0) {
                
                document?.nodes.map((node)=>{
                    console.log("Looping the node "+ node.id)
                    if (node?.id === req.body?.id) {
                        console.log("Node found")

                        foundNode=true
                        node.data.state="ARCHIVED";


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

                    }
                })

            } else {
                return res.status(StatusCodes.NOT_FOUND).json({"message": "No nodes found in document"});
            }
            if(!foundNode) throw new Error('No such node with id '+ req.body?.nodes?.id + " inside doc "+ req.body._id);
        } else {
            return res.status(StatusCodes.NOT_FOUND).json({"message": "No document found"});
        }
    })
    .catch((err)=> {
        console.log(err)
        return res.status(StatusCodes.BAD_REQUEST).json({"message": err.message});

    })

    return res.status(StatusCodes.NOT_FOUND).json({"message": "No document found"});

}

export const updateNewObjective = async (req, res) => {
    const { initiative } = req.params;
    console.log("inside new update objective")
    //This must be document id
    //console.log("Document id", req.body._id)

    //console.log(req.body);

    let foundDocument={}
    //await FlowSchema.findOne(req.body._id)
    await FlowSchema.findOne({$and:[{"nodes.type": "INITIATIVE_NODE"},{"nodes.data.name":initiative}]})
    .then(document=>{
        if(document) {

            //This is just to avoid error of header sent multiple times.
            let foundNode = false

            //below code is common
            if(Object.keys(document).length !== 0) {
                console.log("Node id", req.body.id)
                document?.nodes.map((node)=>{
                    if (node.id === req.body.id) {
                        console.log("Found node too", req.body?.id)
                        foundNode=true
                        //let newValue= {}
                        //newValue.updated_by = req.jwtData.userId;
                        let newValues = modifyInitiativeFields(node, req.body)
            

                        //Below we modify that particular node
                        node = newValues;

                        //.findOneAndReplace({$and:[{"nodes.data.name":initiative},{"nodes.id": initiativeId}]},foundData)

                        const finalUpdatedDoc = FlowSchema.findOneAndReplace({$and:[{"nodes.type": "INITIATIVE_NODE"},{"nodes.data.name":initiative}]}, document).then((data)=>{
                            console.log("document"+document)
                            //console.log("data"+data)
                            //return res.status(StatusCodes.OK).json(document);
                        })
                        .catch((err)=> {
                            console.log(err)
                            return res.status(StatusCodes.BAD_REQUEST).json({"message": err.message});

                        })
                        if(finalUpdatedDoc) {
                            res.status(StatusCodes.OK).json(node);
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
    //console.log(initialValue)
    //console.log(newValue)
    // if(newValue.visibility) {
    //     initialValue.visibility = newValue.visibility
    // }
    // //initialValue.updated_by = req.jwtData.userId;
    
    // if(newValue.deletable) {
    //     initialValue.deletable = newValue.deletable
    // }
    // if(newValue.position) {
    //     initialValue.position = newValue.position
    // }

    //Now at data level
    if(newValue?.name) {
        initialValue.data.name = newValue.name
    }
    
    if(newValue?.description) {
        initialValue.data.description = newValue.description
    }
    
    if(newValue?.assigned_to) {
        initialValue.data.assigned_to = newValue.assigned_to
    }
    
    if(newValue?.access_labels) {
        initialValue.data.access_labels = newValue.access_labels
    }
    //effort_estimation

    if(newValue?.effort_estimation) {
        initialValue.data.effort_estimation = newValue.effort_estimation
    }

    if(newValue?.state) {
        initialValue.data.state = newValue.state
    }

    if(newValue?.general_labels) {
        initialValue.data.general_labels = newValue.general_labels
    }



    if(newValue?.design_doc) {
        initialValue.data.design_doc = newValue.design_doc
    }


    if(newValue?.documentation_ref) {
        initialValue.data.documentation_ref = newValue.documentation_ref
    }

    
    if(newValue?.kpis) {
        initialValue.data.kpis = newValue.kpis
    }

    if(newValue?.position) {
        initialValue.data.position = newValue.position
    }

    if(newValue?.measured) {
        initialValue.data.measured = newValue.measured
    }
    
    return(initialValue)
}


//Delete initiative
export const deleteNewInitiative = async (req, res) => {
    const { initiative } = req.params;
    console.log("inside new delete initiative")
    //This must be document id
    //console.log("Document id", req.body._id)

    //console.log(req.body);

    let warnings = []
    
    let foundDocument={}
    //await FlowSchema.findById(req.body._id)
    await FlowSchema.findOne({$and:[{"nodes.type": "INITIATIVE_NODE"},{"nodes.data.name":initiative}]})
    .then(document=>{
        if(document) {
            let foundNode = false
            //below code is common
            if(Object.keys(document).length !== 0) {
                console.log("Node id", req.body.nodes.id)
                document?.nodes.map((node)=>{
                    if (node?.id === req.body?.nodes?.id && node.type==="INITIATIVE_NODE") {
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

export const createNewObjective = async (req, res) => {
    const { initiative } = req.params;
    console.log("inside create new objective")
    //This must be document id
    //console.log("Document id", req.body._id)
    let nodeId = nanoid()

    const newNode = {
        type: "OBJECTIVE_NODE",
        visibility: req.body.visibility|| "PUBLIC",
        created_by: req.jwtData.userId,
        updated_by: req.jwtData.userId,
        locked: false,
        id: nodeId,
        deletable: false,
        position: {
            x: req.body.position.x,
            y: req.body.position.y,
        },
        data: {
            id: nodeId,
            name: req.body.name || "NEW OBJECTIVE",
            description: "",
            assigned_to: "",
            state: req.body.status || "NEW",

            access_labels: ["EVERYONE_READONLY"],

            general_labels: [""],

            design_doc: "wiki?/miro?",
            documentation_ref: "wiki?",
            slack: "slack://channel?id=<CHANNEL-ID>&team=<TEAM-ID>",
            kpis:[
                {
                    'name': '',
                    'description': '',
                    'ref': ''
                }
            ]
        },
    }

    //console.log(req.body);
    //        .findOne({$and:[{"nodes.type": "INITIATIVE_NODE"},{"nodes.data.name":initiative}]})

    let foundDocument={}
    console.log("Searching for "+ initiative)
    await FlowSchema.findOne({$and:[{"nodes.type": "INITIATIVE_NODE"},{"nodes.data.name":initiative}]})
    .then(document=>{
        console.log(document)
        if(document) {
            let foundNode = false
            //below code is common
            if(Object.keys(document).length !== 0) {

                document.nodes.push(newNode)

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
                    res.status(StatusCodes.OK).json(newNode);
                } else {
                    return res.status(StatusCodes.BAD_REQUEST).json({"message": "Failed to save doc."});
                }

                
            } else {
                return res.status(StatusCodes.BAD_REQUEST).json({"message": "Found empty document found with given id, possibly server error"});
            }
            if(!foundNode) throw new Error('No such node with id '+ req.body?.nodes?.id + " inside doc "+ req.body._id);

        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({"message": "No document found with given id, may be this initiative is archived!"});
        }
    }).catch(error=>{
        return res.status(StatusCodes.BAD_REQUEST).json({"message": error.message});
    })       
}