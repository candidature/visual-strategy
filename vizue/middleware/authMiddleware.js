import {BadRequestError, UnauthenticatedError, UnauthorisedError} from "../errors/customError.js";
import {verifyJWT} from "../utils/tokenUtils.js";

//Below middleware add req.jwtData, if this middleware isn't use and even if user is logged in
// they would not have req.jwtData. So it's important to have it where we need authentication.
export const authMiddleware = (req, res, next) => {
    const {token} = req.cookies;
    if(!token){
        throw new UnauthenticatedError('No token found in cookie - Unauthenticated');
    }
    try {
        const {userId, role} = verifyJWT(token);

        //Video used req.user while i used req.jwtData
        // This means every req instance would have jwtData and can be accessed.
        req.jwtData = {userId, role};
        next()
    }catch(err){
        throw new UnauthenticatedError("UnauthenticatedError: ",err);
    }
}


//Use this middleware if you need to check if a given role exists for the user.
//Below middleware check the role, this is little complicated middleware because it takes user arguments.
//please note we have access to req, res and next in each middleware.
//This middleware is also called from user of the middleware so it's impl is different.
// it's different at the return statement so that we can access req,res and next

export const authorizePermissionMiddleware = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.jwtData.role)) throw new UnauthorisedError(`Only ${roles} is allowed to access this route`)
        next()
    }
}