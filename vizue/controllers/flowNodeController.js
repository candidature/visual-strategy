import {StatusCodes} from "http-status-codes";
import FlowSchema from "../models/FlowModel.js";
import InitiativeModel from "../models/InitiativeModel.js";
import {v4 as uuidv4} from "uuid";


export const getNodeIdByName= async (req, res) => {
    const { initiative } = req.params;
    console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
    const query = req.query;// query param
    console.log(query)
    let zoomNodeName=null;

    if(query.zoomNodeName) {
        console.log(query.zoomNodeName);
        zoomNodeName=query.zoomNodeName;
    }

    let zoomNodeId = 0;
    if(zoomNodeName) {
        await FlowSchema.findOne({"nodes.data.name":zoomNodeName})
        .then(async (data) => {
            console.log(data)
            zoomNodeId = data?.id
        })
    }

    console.log(zoomNodeId)

}



export const getInitiativeFlow = async (req, res) => {
    const { initiative } = req.params;


    console.log(initiative+".");

    const initiativeData = await FlowSchema
        .findOne({$and:[{"nodes.type": "INITIATIVE_NODE"},{"nodes.data.name":initiative}]})
        .then(async (data) => {
            if(!data) {
                return res.status(StatusCodes.NOT_FOUND).json({"message": "No such initiative found!"});
            }
            return res.status(StatusCodes.OK).json({"data": data});
        }).catch((err) => {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({"message": err.message});
        })
}


export const updateInitiativeFlow = async (req, res) => {
    const { initiative } = req.params;
    console.log(initiative+".");


    const initiativeData = await FlowSchema
        .findOneAndReplace({$and:[{"nodes.type": "INITIATIVE_NODE"},{"nodes.data.name":initiative}]},req.body)
        .then(async (data) => {
            console.log(data)
            return res.status(StatusCodes.OK).json({data});
        }).catch((err) => {
            return res.status(StatusCodes.BAD_REQUEST).json({"message": err.message});
        })
}



export const getAllInitiativeNodes = async (req, res) => {
    let initiativesData = []
    const initiativesFromDb = await FlowSchema
        //.findOne({"nodes.data.name":initiative})
        .find({"nodes.type": "INITIATIVE_NODE"})
        .then(async (data) => {
            //initiativesData.push(data.name)
            data.map((d)=>{
                d?.nodes.map((node)=>{
                    if(node?.type==="INITIATIVE_NODE"){
                        console.log(node?.data?.name);
                        initiativesData.push({name: node?.data?.name, data: node?.data});
                    }
                })
            })
            // data.nodes.map((node)=>{
            //   console.log(node.data.name)
            // })
            return res.status(StatusCodes.OK).json(initiativesData);
        }).catch((err) => {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({"message": err.message});
        })
}

export const updateNode = async (req, res) => {
    const {initiative} = req.query;
    // if(!initiative) {
    //     return res.status(StatusCodes.BAD_REQUEST).json({"message": "Must specify initiative name even to update"});
    // }
    console.log(req.body);


    const initiativeFromDb = await FlowSchema
        //.findOne({"nodes.data.name":initiative})
        .findOneAndReplace({$and:[{"nodes.type": "INITIATIVE_NODE"},{"nodes.data.name":initiative}]},req.body)
        .then(async (data) => {
            if (!data) {
                //this section creates the record
                const newInitiativeFromDb = await FlowSchema
                    .create({"nodes": newNode})
                    .then((data) => {
                        return res.status(StatusCodes.CREATED).json({data});
                    }).catch((err) => {
                        console.log(err)
                        return res.status(StatusCodes.BAD_REQUEST).json({"message": err.message});
                    })

            } else {
                return res.status(StatusCodes.OK).json({"message": "Already exists"});
            }
        }).catch((err) => {
            return res.status(StatusCodes.BAD_REQUEST).json({"message": err.message});
        })
}

export const createNode = async (req, res) => {

    console.log(req.body)
    let initName = req.body.initiativeName.toString().trimStart().trimEnd()
    let nodeId = ''+uuidv4()

    const newNode = {
        type: "INITIATIVE_NODE",
        visibility: req.body.initiativeVisibility,
        id: nodeId,
        deletable: false,
        position: {
            x: 20,
            y: 20
        },
        data: {
            id: nodeId,
            name: initName,
            description: req.body.initiativeDescription,
            assigned_to: "",
            state: req.body.initiativeStatus,
            labels: [""],
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
        .findOne({$and:[{"nodes.type": "INITIATIVE_NODE"},{"nodes.data.name":req.body.initiativeName}]})
        .then(async (data) => {
            if (!data) {
                //this section creates the record
                const newInitiativeFromDb = await FlowSchema
                    .create({"nodes": newNode})
                    .then((data) => {
                        return res.status(StatusCodes.CREATED).json({data});
                    }).catch((err) => {
                        return res.status(StatusCodes.BAD_REQUEST).json({"message": err});
                    })

            } else {
                return res.status(StatusCodes.OK).json({"message": "Already exists"});
            }
        }).catch((err) => {
            return res.status(StatusCodes.BAD_REQUEST).json({"message": err.message});
        })
}

