import {StatusCodes} from "http-status-codes";
import FlowSchema from "../models/FlowModel.js";



export const getSingleTask = async (req, res) => {
    const { initiative, taskId } = req.params;
    console.log("==========================")
    console.log(initiative+".");
    console.log(taskId)
    console.log("==========================")
    console.log("INSIDE getSingleTask getSingleTask getSingleTask getSingleTask")
    const initiativeData = await FlowSchema
        .findOne({$and:[{"nodes.data.name":initiative},{"nodes.id": taskId}]})
        .then(async (data) => {
            console.log(data)
            if(!data) {
                return res.status(StatusCodes.NOT_FOUND).json({"message": "No such single task node found!"});
            }
            data.nodes.map((n)=>{
                console.log(n);
                if(n.type === "TASK_NODE" && n.id === taskId){
                    return res.status(StatusCodes.OK).json({data:n});
                }
            })
        }).catch((err) => {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({"message": err.message});
        })
}

export const updateSingleTask = async (req, res) => {
    const { initiative, taskId } = req.params;
    console.log("inside put/update ... ==========================")
    console.log(initiative+".");
    console.log(taskId)
    console.log("==========================")
    let foundData = {}
    const getDocumentWithStrructure = await FlowSchema
        .findOne({$and:[{"nodes.data.name":initiative},{"nodes.id": taskId}]})
        .then(async (data) => {
            //console.log(data)
            if(!data) {
                return res.status(StatusCodes.NOT_FOUND).json({"message": "No such single task node found!"});
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
            if (n.id===taskId){
                //n.data = req.body
                //console.log(req.body)
                if(req.body.name) {
                    n.data.name = req.body.name
                }
                // if(req.body.description) {
                //     let date  = new Date(Date.now()).toISOString()
                //     let history = {
                //         "date":date,
                //         "description":req.body.description,
                //         "updated_by": req.jwtData.userId
                //     }
                //     n.data.description.push(history)
                // }
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
                n.data.id=taskId
                //n.data.created_by = req.jwtData.userId
            }
        })
        console.log("formdata", foundData.nodes[1].data)
    }


    //return res.status(StatusCodes.OK).json({foundData});

    const updatedDocument = await FlowSchema
        .findOneAndReplace({$and:[{"nodes.data.name":initiative},{"nodes.id": taskId}]},foundData)
        .then(async (data) => {
            //console.log(data)
            if(!data) {
                return res.status(StatusCodes.NOT_FOUND).json({"message": "No such taskId found!"});
            }
            return res.status(StatusCodes.OK).json({foundData});
        }).catch((err) => {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({"message": err.message});
        })
}
