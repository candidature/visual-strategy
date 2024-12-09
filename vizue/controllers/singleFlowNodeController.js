import {StatusCodes} from "http-status-codes";
import FlowSchema from "../models/FlowModel.js";



export const getSingleNode = async (req, res) => {
    const { initiative, initiativeId } = req.params;
    console.log("==========================")
    console.log(initiative+".");
    console.log(initiativeId)
    console.log("==========================")

    const initiativeData = await FlowSchema
        .findOne({$and:[{"nodes.data.name":initiative},{"nodes.id": initiativeId}]})
        .then(async (data) => {
            console.log(data)
            if(!data) {
                return res.status(StatusCodes.NOT_FOUND).json({"message": "No such single node found!"});
            }
            return data.nodes.map((n)=>{
                console.log(n);
                if(n.type === "INITIATIVE_NODE" || n.type === "OBJECTIVE_NODE" || n.type === "TASK_NODE"){
                    return res.status(StatusCodes.OK).json({data:n.data});
                }
            })

            return res.status(StatusCodes.NOT_FOUND).json({"message": "Initiative not found"});
        }).catch((err) => {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({"message": err.message});
        })
}

export const updateSingleNode = async (req, res) => {
    const { initiative, initiativeId } = req.params;
    console.log("==========================")
    console.log(initiative+".");
    console.log(initiativeId)
    console.log("==========================")
    let foundData = {}
    const getDocumentWithStrructure = await FlowSchema
        .findOne({$and:[{"nodes.data.name":initiative},{"nodes.id": initiativeId}]})
        .then(async (data) => {
            console.log(data)
            if(!data) {
                return res.status(StatusCodes.NOT_FOUND).json({"message": "No such single node found!"});
            }

            foundData = data;
        }).catch((err) => {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({"message": err.message});
        })

    if(foundData){
        console.log("==========================================")
        foundData?.nodes?.map((n)=>{
            if (n.id===initiativeId){
                //n.data = req.body
                console.log(req.body)
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
                if(req.body.kpis) {
                    n.data.kpis = req.body.kpis
                }
                n.data.id=initiativeId
            }
        })
        console.log(foundData)
    }


    //return res.status(StatusCodes.OK).json({foundData});

    const updatedDocument = await FlowSchema
        .findOneAndReplace({$and:[{"nodes.data.name":initiative},{"nodes.id": initiativeId}]},foundData)
        .then(async (data) => {
            console.log(data)
            if(!data) {
                return res.status(StatusCodes.NOT_FOUND).json({"message": "No such single node found!"});
            }
            return res.status(StatusCodes.OK).json({data});
        }).catch((err) => {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({"message": err.message});
        })
}
