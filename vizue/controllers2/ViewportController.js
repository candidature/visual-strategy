import {StatusCodes} from "http-status-codes";
import FlowSchema from "../models/FlowModel.js";


export const createNewViewport = async (req, res) => {
    const { initiative } = req.params;
    console.log("inside create new edge")
    if(!initiative) {
        return res.status(StatusCodes.BAD_REQUEST).json({"message": "Empty initiative name"});
    }
    
    //This must be document id
    //console.log("Document id", req.body._id)
    
    console.log(req.body)
    const viewport = {
        created_by: req.jwtData.userId,
        x: req.body.x,
        y: req.body.y,
        zoom: req.body.zoom,
        data: {
            name: "SAMPLE data to test viewport"
        },
    }
    
    console.log("Searching for "+ initiative+"-")
   
        await FlowSchema.findOne({$and:[{"nodes.type": "INITIATIVE_NODE"},{"nodes.data.name":initiative}]})
        .then(document=>{
            console.log(document)
            if(document) {
            let foundNode = false
            //below code is common
            if(Object.keys(document).length !== 0) {

                document.viewport= viewport

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
                    res.status(StatusCodes.OK).json(viewport);
                } else {
                    return res.status(StatusCodes.BAD_REQUEST).json({"message": "Failed to save viewport changes to the document."});
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