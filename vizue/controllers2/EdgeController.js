import {StatusCodes} from "http-status-codes";
import FlowSchema from "../models/FlowModel.js";


//Delete initiative
export const deleteNewEdge = async (req, res) => {
    const { initiative,id } = req.params;
    console.log("inside new delete task")
    
    await FlowSchema.findOne({$and:[{"nodes.type": "INITIATIVE_NODE"},{"nodes.data.name":initiative}]})
    .then(document=>{
        if(document) {
            let foundNode = false
            //below code is common
            if(Object.keys(document).length !== 0) {
                console.log("Edge id", id)
                let remainingEdges = document?.edges.filter(edge => edge.id != id);
                
                document.edges = remainingEdges
                const finalUpdatedDoc = FlowSchema.findOneAndReplace({_id: document._id}, document).then((data)=>{
                    console.log("document"+document)
                    //console.log("data"+data)
                    //return res.status(StatusCodes.OK).json(document);
                })
                .catch((err)=> {
                    console.log(err)
                    return res.status(StatusCodes.BAD_REQUEST).json({"message": err.message});

                })
                res.status(StatusCodes.OK).json(document);
            } else {
                return res.status(StatusCodes.BAD_REQUEST).json({"message": "Found empty document found with given id, possibly server error"});
            }
            if(!foundNode) throw new Error('No such initiative node with id '+ req.body?.id + " inside doc ");

        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({"message": "No document found with given id"});
        }
    }).catch(error=>{
        return res.status(StatusCodes.BAD_REQUEST).json({"message": error.message});
    })       
}


export const createNewEdge = async (req, res) => {
    const { initiative } = req.params;
    console.log("inside create new edge")
    if(!initiative) {
        return res.status(StatusCodes.BAD_REQUEST).json({"message": "Empty initiative name"});
    }
    
    //This must be document id
    //console.log("Document id", req.body._id)
    
    console.log(req.body)
    const newEdge = {
        created_by: req.jwtData.userId,
        source: req.body.source,
        target: req.body.target,
        animated: true,
        type: "select",
        id: "xy-edge__"+req.body.source+"-"+req.body.target,
        style: {
            strokeWidth: 5,
        },
        data: {
            name: "SAMPLE"
        },
    }

    //console.log(req.body);
    //        .findOne({$and:[{"nodes.type": "INITIATIVE_NODE"},{"nodes.data.name":initiative}]})

    let foundDocument={}
    console.log("Searching for "+ initiative+"-")
   

        await FlowSchema.findOne({$and:[{"nodes.type": "INITIATIVE_NODE"},{"nodes.data.name":initiative}]})
        .then(document=>{
            console.log(document)
            if(document) {
            let foundNode = false
            //below code is common
            if(Object.keys(document).length !== 0) {

                document.edges.push(newEdge)

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
                    res.status(StatusCodes.OK).json(newEdge);
                } else {
                    return res.status(StatusCodes.BAD_REQUEST).json({"message": "Failed to save edge changes to the document."});
                }

                
            } else {
                return res.status(StatusCodes.BAD_REQUEST).json({"message": "Found empty document found with given id, possibly server error"});
            }
            if(!foundNode) throw new Error('No nodes found, very unlikely scnerio');

        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({"message": "No document found with given id. check query!"});
        }
    }).catch(error=>{
        return res.status(StatusCodes.BAD_REQUEST).json({"message": error.message});
    })       
}


//savePositionSize


export const savePositionSize = async (req, res) => {
    const { initiative, id } = req.params;
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
                console.log("Node id", id)
                document?.nodes.map((node)=>{
                    if (node.id === id) {
                        console.log("Found node too", id)
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
            if(!foundNode) throw new Error('No such node in initiative '+ initiative);

        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({"message": "No document found with given id"});
        }
    }).catch(error=>{
        return res.status(StatusCodes.BAD_REQUEST).json({"message": error.message});
    })       
}



function modifyInitiativeFields(initialValue,newValue) {

    if(newValue?.position) {
        initialValue.position = newValue.position
    }

    if(newValue?.measured) {
        initialValue.measured = newValue.measured
    }
    
    return(initialValue)
}