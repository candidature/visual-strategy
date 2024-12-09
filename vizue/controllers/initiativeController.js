//visibility - department, everyone, private,
import {nanoid} from "nanoid";
import InitiativeModel from "../models/InitiativeModel.js";
import {StatusCodes} from 'http-status-codes';
import {NotFoundError} from "../errors/customError.js";

export const getAllInitiatives = async (req, res) => {
        const initiatives  = await InitiativeModel.find({})
        res.status(StatusCodes.OK).json({initiatives});
    // if (req.jwtData.role === "admin") {
    //     const initiatives  = await InitiativeModel.find({})
    //     res.status(StatusCodes.OK).json({initiatives});
    // } else {
    //     res.status(StatusCodes.OK).json({createdBy: req.jwtData.userId});
    // }
}

export const createInitiative = async (req, res) => {
    console.log("========================")
    console.log(req);

    //const {name, visibility, description, kpi, accountable, endDate, stage} = req.body
    req.body.createdBy = req.jwtData.userId;

    //This is temporary!! so need to remove
    //req.body.writeAccesses = [req.jwtData.userId];


    const initiative  =  await InitiativeModel.create(req.body)
    // if (!name) {
    //     return res.status(400).send({message: 'Please enter name'});
    // }
    // const id = nanoid(10) + '-' + process.env.NODE_ENV;
    // const initiative = {id, name, visibility, description, kpi, accountable, endDate, stage};
    // initiatives.push(initiative);
    console.log(initiative);
    res.status(StatusCodes.CREATED).json({initiative});
}


export const getInitiative = async (req, res) => {
    const { id } = req.params;
    //const initiative = initiatives.find(initiative => initiative.id === id);
    const initiative = await InitiativeModel.findById(id)

    //We are doing central error handling for not found and invalid id
    //if(!initiative) throw new NotFoundError(`initiative not found ${id}`);

    res.status(StatusCodes.OK).json({initiative});
}

export const updateInitiative = async (req, res) => {
    //const {name, visibility, description, kpi, accountable, endDate, stage} = req.body

    const { id } = req.params;
    // let initiative = initiatives.find(initiative => initiative.id === id);
    // if(!initiative) {
    //     return res.status(404).send({message: `initiative not found ${id}`});
    // }
    // if(name) {
    //     initiative.name = name;
    // }
    // if (visibility) {
    //     initiative.visibility = visibility;
    // }
    //
    // if (description) {
    //     initiative.description = description;
    // }
    // if (kpi) {
    //     initiative.kpi = kpi;
    // }
    //
    // if(accountable) {
    //     initiative.accountable = accountable;
    // }
    // if(endDate) {
    //     initiative.endDate = endDate;
    // }
    // if(stage) {
    //     initiative.stage = stage;
    // }
    const initiative =
        await InitiativeModel.findByIdAndUpdate(id, req.body, {new:true})

    ////We are doing central error handling for not found and invalid id
    //if(!initiative) throw new NotFoundError(`initiative not found ${id}`);

    //Check if you are having edit permission on this initiative?
    if (req.jwtData.userId !== req.jwtData.userId) {
        //If user has readWrite access

    }

    res.status(StatusCodes.OK).json({initiative});
}

//writeAccesses


export const deleteInitiative = async (req, res) => {
    const { id } = req.params;

    let initiative = await InitiativeModel.findByIdAndDelete(id)
    // let initiative = initiatives.find(initiative => initiative.id === id);

    //We are doing central error handling for not found and invalid id
    //if(!initiative) throw new NotFoundError(`initiative not found ${id}`);

    let initiatives = await InitiativeModel.find({})

    //const newInitiatives = initiatives.filter(initiative => initiative.id !== id);
    res.status(StatusCodes.OK).json({initiatives});
}
