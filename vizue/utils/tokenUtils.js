import jwt from 'jsonwebtoken';

export const createJWT = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE,
    });
}

export const verifyJWT = (payload) => {
    const decoded = jwt.verify(payload, process.env.JWT_SECRET);
    return decoded;
}