import {StatusCodes} from "http-status-codes";
import FlowSchema from "../models/FlowModel.js";



export const getSingleObjective = async (req, res) => {
    const { initiative, objectiveId } = req.params;
    console.log("==========================")
    console.log(initiative+".");
    console.log(objectiveId)
    console.log("==========================")
    console.log("INSIDE getSingleObjective getSingleObjective getSingleObjective getSingleObjective ")
    const initiativeData = await FlowSchema
        .findOne({$and:[{"nodes.data.name":initiative},{"nodes.id": objectiveId}]})
        .then(async (data) => {
            console.log(data)
            if(!data) {
                return res.status(StatusCodes.NOT_FOUND).json({"message": "No such single node found!"});
            }
            data.nodes.map((n)=>{
                console.log(n);
                if(n.type === "OBJECTIVE_NODE" && n.id === objectiveId){
                    return res.status(StatusCodes.OK).json({data:n});
                }
            })

        }).catch((err) => {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({"message": err.message});
        })
}

export const updateSingleObjective = async (req, res) => {
    const { initiative, objectiveId } = req.params;
    console.log("inside put/update ... ==========================")
    console.log(initiative+".");
    console.log(objectiveId)
    console.log("==========================")
    let foundData = {}
    const getDocumentWithStrructure = await FlowSchema
        .findOne({$and:[{"nodes.data.name":initiative},{"nodes.id": objectiveId}]})
        .then(async (data) => {
            //console.log(data)
            if(!data) {
                return res.status(StatusCodes.NOT_FOUND).json({"message": "No such single node found!"});
            }

            foundData = data;
        }).catch((err) => {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({"message": err.message});
        })

    console.log("outside map body", req.body);

    if(foundData){
        console.log("inside found data")
        foundData?.nodes?.map((n)=>{
            console.log("inside map", n);
            if (n.id===objectiveId){
                //n.data = req.body
                //console.log(req.body)
                if(req.body.name) {
                    n.data.name = req.body.name
                }
                if(req.body.description) {
                    n.data.description = req.body.description
                }
                if(req.body.assigned_to) {
                    n.data.assigned_to = req.body.assigned_to
                }
                if(req.body.labels) {
                    n.data.labels = req.body.labels
                }
                if(req.body.state) {
                    n.data.state = req.body.state
                }
                if(req.body.effort_estimation) {
                    n.data.effort_estimation = req.body.effort_estimation
                }
                if(req.body.kpis) {
                    n.data.kpis = req.body.kpis
                }
                n.data.id=objectiveId
            }
        })
        console.log("formdata", foundData.nodes[1].data)
    }


    //return res.status(StatusCodes.OK).json({foundData});

    const updatedDocument = await FlowSchema
        .findOneAndReplace({$and:[{"nodes.data.name":initiative},{"nodes.id": objectiveId}]},foundData)
        .then(async (data) => {
            //console.log(data)
            if(!data) {
                return res.status(StatusCodes.NOT_FOUND).json({"message": "No such objectiveId found!"});
            }
            return res.status(StatusCodes.OK).json({foundData});
        }).catch((err) => {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({"message": err.message});
        })
}
