import {StatusCodes} from "http-status-codes";

export class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "NotFoundError";
        this.statusCode = StatusCodes.NOT_FOUND;
    }
}

export class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.name = "BadRequestError";
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}

export class UnauthenticatedError extends Error {
    constructor(message) {
        super(message);
        this.name = "UnauthenticatedError";
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
}

//403
export class UnauthorisedError extends Error {
    constructor(message) {
        super(message);
        this.name = "UnauthorisedError";
        this.statusCode = StatusCodes.FORBIDDEN;
    }
}
