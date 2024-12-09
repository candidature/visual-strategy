import {body, param, validationResult } from 'express-validator';
import {BadRequestError, NotFoundError, UnauthorisedError} from '../errors/customError.js';
import {INITIATIVE_STATUS} from "../utils/contants.js";
import mogoose from "mongoose";
import InitiativeModel from "../models/InitiativeModel.js";
import UserModel from "../models/UserModel.js";

const withValidationErrorMiddleware= (validateValues) => {
    return [validateValues,(req,res,next)=>{
        const errors = validationResult(req)

        if(!errors.isEmpty()){
            const errorMessages = errors.array().map((error)=> error.msg);
            if(errorMessages[0].endsWith("404")){
                throw new NotFoundError(errorMessages);
            }
            if(errorMessages[0].endsWith("401")){
                throw new UnauthorisedError(errorMessages);
            }
            throw new BadRequestError(errorMessages);
        }
        next()
    }
    ]
}


////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////

export const validateTest = withValidationErrorMiddleware(
    [
        body('name').notEmpty().withMessage('Name is required').isAlphanumeric().withMessage("Name must be alphanumeric")
            .isLength({min:5}).withMessage("Name must be more than 5 character").trim(),
    ]
)

export const validateInitiativeInput = withValidationErrorMiddleware(
    [
        body('initiativeName').notEmpty().withMessage('Initiative name is required')
            .isLength({min:5}).withMessage("Initiative name must be more than 5 character").trim(),

        body('initiativeDescription').notEmpty().withMessage('Initiative description is required')
            .isLength({min:15}).withMessage("Initiative description must be more than 15 character").trim(),

        //INITIATIVE_STATUS
        body('initiativeStatus').isIn(INITIATIVE_STATUS).withMessage('Invalid INITIATIVE_STATUS').trim()
    ]
)

export const validateIdParam = withValidationErrorMiddleware( [
    param('id').custom((value) => mogoose.Types.ObjectId.isValid(value)).
        withMessage('Invalid Mongodb ID in params').trim()
])


export const validateIdParamInDB = withValidationErrorMiddleware([
    param('id')
        .custom(async (value) => {
        const isValidId = mogoose.Types.ObjectId.isValid(value)
        if(!isValidId) throw new BadRequestError(`Invalid mongodb id ${value}`)

        const initiative = await InitiativeModel.findById(value)
        if(!initiative) throw new NotFoundError(`no initiative with id ${value} 404`)
    }),
])

////////validate if user has readwrite or admin access or the owner


export const validateIdParamInDBWithRWAccess = withValidationErrorMiddleware([
    param('id')
        .custom(async (value,{req}) => {
            const isValidId = mogoose.Types.ObjectId.isValid(value)
            if(!isValidId) throw new BadRequestError(`Invalid mongodb id ${value}`)

            const initiative = await InitiativeModel.findById(value)
            if(!initiative) throw new NotFoundError(`no initiative with id ${value} 404`)

            try {
                const isAdmin = req.jwtData.role === 'admin'
                console.log("is Admin ", isAdmin)

                //Can write if owner of one who has permission
                const isOwner = req.jwtData.userId === initiative.createdBy.toString()
                console.log("is Owner ", isOwner)
                //const canWrite = req.jwtData.userId === initiative.writeAccesses.toString()

                //initiatives.find(initiative => initiative.id === id);
                let canWrite = false
                console.log(initiative)

                initiative.writeAccesses.find(userId => {
                    if(userId.toString() === req.jwtData.userId) {
                        canWrite = true
                    }
                })
                console.log("can Write ", canWrite)
            } catch (error) {
                throw new UnauthorisedError('Please make sure you are logged in - 401')
            }


            if(!isAdmin && !isOwner && !canWrite) throw new UnauthorisedError('not authorised to access this route - 401')

            //if(!isAdmin) throw new BadRequestError(`no initiative with id ${value}`)

            //console.log(req)
        }),
])

///Below is about User register validation
export const validateRegisterInput = withValidationErrorMiddleware([
    body('name').notEmpty().withMessage('Name of the user is required')
        .isLength({min:3}).withMessage("Name of the user must be more than 2 character").trim(),

    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email')
        .custom(async (email) => {
            const user = await UserModel.findOne({ email })
            if(user) throw new BadRequestError(`email ${email} already exists`)
        })
        .trim(),

    body('password').notEmpty().withMessage('Password is required')
        .isLength({min:5}).withMessage('Password minimum length 5').trim()
])

//Validate user updating his profile
export const validateUpdateUserInput  = withValidationErrorMiddleware([
    body('name').notEmpty().withMessage('Name of the user is required')
        .isLength({min:3}).withMessage("Name of the user must be more than 2 character").trim(),

    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email')
        .custom(async (email, {req}) => {
            const user = await UserModel.findOne({ email })

            //let's check user exists and while changing the email id, we are the same id i.e. as in req
            // and if not this is the situation when we are not the same user.
            if(user && user._id.toString() !== req.jwtData.userId ) {
                throw new BadRequestError(`email ${email} already exists`)
            }
        })
        .trim(),
])


///Below is about User Login validation
export const validateLoginInput = withValidationErrorMiddleware([

    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email')
        .trim(),

    body('password').notEmpty().withMessage('Password is required').trim(),
])