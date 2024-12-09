import {StatusCodes} from "http-status-codes";

const errorHandlerMiddleware = (err, req, res, next) => {
    console.error(err);
    const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const message = err.message || "Something went wrong, try again later";
    res.status(statusCode).json({message: message});
}

export default errorHandlerMiddleware;