import UserModel from "../models/UserModel.js";
import {StatusCodes} from 'http-status-codes';
import {comparePassword, hashPassword} from "../utils/passwordUtils.js";
import {UnauthenticatedError} from "../errors/customError.js";
import {createJWT} from "../utils/tokenUtils.js";

//Get All users
export const getAllUsers = async (req, res) => {
    const users  = await UserModel.find({})
    res.status(StatusCodes.OK).json({users});
}

//Create User
export const registerUser = async (req, res) => {
    //const {name, visibility, description, kpi, accountable, endDate, stage} = req.body
    const isFirstAccount = await UserModel.countDocuments() === 0

    req.body.role = isFirstAccount ? "admin" : "user";

    req.body.roles = ["READ_ONLY"]

    //Hashing the password.

    req.body.password = await hashPassword(req.body.password);

    //Storing the user
    const user  =  await UserModel.create(req.body)

    res.status(StatusCodes.CREATED).json({"message": "user created successfully."});
}

//Get one user
export const loginUser = async (req, res) => {
    //const {name, visibility, description, kpi, accountable, endDate, stage} = req.body
    const user  =  await UserModel.findOne({email:req.body.email})
    if (!user) throw new UnauthenticatedError('invalid email - unregistered');

    if(await comparePassword(req.body.password,user.password) === false) {
        return res.status(StatusCodes.UNAUTHORIZED).json({"message": "user credentials does not match"});
    }

    //Now create JWT

    const token = createJWT({'userId':user._id, role: user.role , roles: user?.roles});

    //Below in milliseconds
    const oneDay = 1000 * 60 * 60 * 24;

    //TBD
    //Change below secure=true when in production! this would require https
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', '*')

    res.cookie('token', token, { httpOnly: true, secure: false, sameSite: true, expires: new Date(Date.now() +oneDay) });
    return res.status(StatusCodes.OK).json({"message": "user logged in"});
}

//Logout user

export const logoutUser = async (req, res) => {
    res.cookie('token','logout', {httpOnly: true, expires: new Date(Date.now())});
    res.status(StatusCodes.OK).json({"message": "user logged out"});
}
//Delete User

//Patch User