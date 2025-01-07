import {StatusCodes} from "http-status-codes";
import FlowSchema from "../models/FlowModel.js";
import InitiativeModel from "../models/InitiativeModel.js";
import {v4 as uuidv4} from "uuid";
import { nanoid } from 'nanoid';
import {logger} from '../utils/logger.js'
import e from "express";
import flowmodels_history from "../models/FlowModelHistory.js";
import { Collection, ObjectId } from "mongodb";



//Get all the initiatives in the dataase.
export const getHistory = async(req,res)=> {
    const { initiativeId } = req.params;

    if(!initiativeId) {
        return res.status(StatusCodes.NOT_FOUND).json({"message": "Empty initiativeId asked for!"});
    }
    console.log("Getting history..."+initiativeId)

    //{"originId":ObjectId('67575fe7b55913980d5cefb0')}

    const initiativeFromDb = flowmodels_history
        .find({"originId":new ObjectId(initiativeId)})
        .then((data) => {
            console.log(data)
            if (!data) {
                return res.status(StatusCodes.NOT_FOUND).json({"message": "No history data found"});
            } else {
                return res.status(StatusCodes.OK).json(data);
            }
        }).catch((err) => {
            return res.status(StatusCodes.BAD_REQUEST).json({"message": err.message});
        })

}



//Get all the initiatives in the dataase.
export const getSpecificHistory = async(req,res)=> {
    const { documentId } = req.params;
    console.log('its here....')
    if(!documentId) {
        return res.status(StatusCodes.NOT_FOUND).json({"message": "Empty historyId asked for!"});
    }
    console.log("Getting history..."+documentId)

    //{"originId":ObjectId('67575fe7b55913980d5cefb0')}
//        .findOne({$and:[{"nodes.type": "INITIATIVE_NODE"},{"_id":docId}]})

    const initiativeFromDb = flowmodels_history
        .findById(documentId)
        .then((data) => {
            console.log(data)
            if (!data) {
                return res.status(StatusCodes.NOT_FOUND).json({"message": "No speific history data found"});
            } else {
                return res.status(StatusCodes.OK).json(data);
            }
        }).catch((err) => {
            return res.status(StatusCodes.BAD_REQUEST).json({"message": err.message});
        })

}


