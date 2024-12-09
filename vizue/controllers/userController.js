import {StatusCodes} from "http-status-codes";
import UserModel from "../models/UserModel.js";
import InitiativeModel from "../models/InitiativeModel.js";

export const getCurrentUser = async (req, res) => {

    //since there is authentica middleware in front of it, we will have user if we reach this point.
    const user = await UserModel.findOne({_id: req.jwtData.userId})
    const userWithoutPassword = user.toJSON()
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', '*')

    res.status(StatusCodes.OK).json({"user": userWithoutPassword});
}

//Answers the questions like how many users we have
//How many initiatives we have.
//How many tasks for each initiative.
//How many company level initiatives.
//How many departmental level initiative.
//initiative at risk - later.
//tasks blocked.
//
export const getApplicationStatus = async (req, res) => {
    const users = await UserModel.countDocuments()
    const initiatives = await InitiativeModel.countDocuments()
    res.status(StatusCodes.OK).json({"users": users, "initiatives": initiatives});


}


export const updateUser = async (req, res) => {
    console.log(req.body)
    //It may so happen someone wants to update password via this route, but we don't want to allow via this.
    // so as to prevent password update via update user we need to do following:
    const obj = {...req.body};
    delete obj.password;

    const updatedUser = await UserModel.findByIdAndUpdate(req.jwtData.userId, obj)
    res.status(StatusCodes.OK).json({"user": obj});
}