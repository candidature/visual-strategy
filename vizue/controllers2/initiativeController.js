import {StatusCodes} from "http-status-codes";
import FlowSchema from "../models/FlowModel.js";
import InitiativeModel from "../models/InitiativeModel.js";
import {v4 as uuidv4} from "uuid";
import { nanoid } from 'nanoid';




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


// export const updateInitiativeFlow = async (req, res) => {
//     const { initiative } = req.params;
//     console.log(initiative+".");


//     const initiativeData = await FlowSchema
//         .findOneAndReplace({$and:[{"nodes.type": "INITIATIVE_NODE"},{"nodes.data.name":initiative}]},req.body)
//         .then(async (data) => {
//             console.log(data)
//             return res.status(StatusCodes.OK).json({data});
//         }).catch((err) => {
//             return res.status(StatusCodes.BAD_REQUEST).json({"message": err.message});
//         })
// }



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

    const position = screenToFlowPosition({ x: evt.clientX, y: evt.clientY });

    let initName = req.body.initiativeName.toString().trimStart().trimEnd()
    

    const newNode = {
        type: "INITIATIVE_NODE",
        visibility: req.body.visibility,
        created_by: 
        updated_by: 
        id: nodeId,
        deletable: false,
        position: {
            x: req.body.x_position,
            y: req.body.y_position
        },
        data: {
            id: nodeId,
            name: req.body.name,
            description: req.body.description,
            assigned_to: "",
            state: req.body.initiativeStatus,
            access_labels: [""],
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
                    .create({"nodes": newNode})
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

