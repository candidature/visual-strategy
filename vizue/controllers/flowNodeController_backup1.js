import {StatusCodes} from "http-status-codes";
import FlowSchema from "../models/FlowModel.js";
import InitiativeModel from "../models/InitiativeModel.js";
import {v4 as uuidv4} from "uuid";



export const updateNode = async (req, res) => {
    const {initiative} = req.query;
    if(!initiative) {
        return res.status(StatusCodes.BAD_REQUEST).json({"message": "Must specify initiative name even to update"});
    }
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
    const {initiative,x,y} = req.query; //domainname:port/path?initiative=<>
    console.log(initiative);
    console.log(x);
    console.log(y);

    console.log(req.body);

    if(!initiative) {
        return res.status(StatusCodes.BAD_REQUEST).json({"message": "Must specify initiative name"});
    }
    if(!x) {
        return res.status(StatusCodes.BAD_REQUEST).json({"message": "Must specify x value to create"});
    }
    if(!y) {
        return res.status(StatusCodes.BAD_REQUEST).json({"message": "Must specify y value to create"});
    }

    if(typeof initiative !== "string" || initiative.length < 5) {
        return res.status(StatusCodes.BAD_REQUEST).json({"message": "Must specify be string name of size 5 of more"});
    }


    const newNode = {
        type: "INITIATIVE_NODE",
        id: ''+ uuidv4(),
        position: {
            x: x,
            y: y
        },
        data: {
            name: initiative,
            description: "",
            assigned_to: "",
            state: "",
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
        .findOne({$and:[{"nodes.type": "INITIATIVE_NODE"},{"nodes.data.name":initiative}]})
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

