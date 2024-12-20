import 'express-async-errors';
import express from 'express';
import morgan from 'morgan';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from "cookie-parser";

////Custom imports////

/////// Router /////////
import initiativeRouter from './routes/initiativeRouter.js';
import flowRouter from './routes/flowRouter.js';
import authRouter from './routes/authRouter.js';
import userRouter from "./routes/userRouter.js";

/////// Middleware /////////
import {validateTest} from "./middleware/validationMiddleware.js";
////Middleware for error handling and authentication.
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";
import {authMiddleware} from "./middleware/authMiddleware.js";


/////////////////////////////////
// public
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

////

dotenv.config();
const app = express();

const __dirname = dirname(fileURLToPath(import.meta.url));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('prod'));
}

import cors from "cors";

const corsOptions = {
    origin: '*', // Change to your frontend's URL
    preflightContinue: true,
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//app.use(express.static('public'));
//Below line is to serve frontend from node server. We did build frontend and put that under dist folder
app.use(express.static(path.resolve(__dirname, '../client/dist')));

/////////////////////////////////////////////////////////////////
app.get('/', (req, res) => {

})

app.post('/api/v1/test',validateTest,
    (req, res) => {
    const {name} = req.body;

    res.json({message: `Hello ${name}`});
});

/////////////////////////   INITIATIVE  /////////////////////////
//GET All initiatives
//app.use('/api/v1/initiatives', authMiddleware,initiativeRouter)
//To below so that we do not have any middleware to view.
app.use('/api/v1/initiatives', initiativeRouter)

app.use('/api/v1/flow-test', flowRouter)

app.use('/api/v1/auth', authRouter)

app.use('/api/v1/users', authMiddleware,userRouter)


app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
});

//////////////////////////////////////////////////

//Error middleware
app.use(errorHandlerMiddleware)


//404 not found middleware
app.use('*', (req, res) => {
    res.status(404).json({message: `NOT FOUND`});
})



///DB connection
try {
    await mongoose.connect(process.env.MONGO_URL, {});
    const port = process.env.PORT || 5100;
    app.listen(port, () => {
        console.log(`server running on ${port}....`);
    });

} catch (error) {
    console.error(error);
    process.exit(1);
}