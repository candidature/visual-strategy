//Hashing the password.
import req from "express/lib/request.js";
import bcrypt from "bcryptjs";
import UserModel from "../models/UserModel.js";

export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
}