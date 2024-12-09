import mongoose from "mongoose";
import {nanoid} from "nanoid";
import {INITIATIVE_STATUS, INITIATIVE_VISIBILITY, INITIATIVE_ARCHIVED} from "../utils/contants.js";
const initialNodes = {nodes: [{"data": {"type": "FlowNode1"}}]}

const nodeSchema = new mongoose.Schema({

    data: {
        type: Object
        //     assigned_to: String,
        //     effort_estimate: String,
        //     notes: String
        // },
        // type: String,
        // level: String,
    }
})

const subSchema = new mongoose.Schema({
    // some schema definition here
    nodes: [ nodeSchema ]
});



const InitiativeSchema = new mongoose.Schema({

    initiativeName: String,
    initiativeDescription: String,
    initiativeStage: {
        type: String,
        enum: Object.values(INITIATIVE_STATUS),
        default: INITIATIVE_STATUS.NEW,
    },
    initiativeVisibility: {
        type: String,
        enum: Object.values(INITIATIVE_VISIBILITY),
        default: INITIATIVE_VISIBILITY.PRIVATE,
    },
    initiativeArchived: {
        type: String,
        enum: Object.values(INITIATIVE_ARCHIVED),
        default: INITIATIVE_ARCHIVED.NO,
    },

    initiativeAccountable: {
        type: [String],
        persons: []
    },

    initiativeStartDate: {
        type: Date,
        default: Date.now,
    },
    initiativeEndDate: Date,

    initiativeKpis: [
        {
            kpiName: String,
            kpiDescription: String,
            kpiCcore: Number,
            kpiComments: String
        },

    ],
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    writeAccesses: [
        {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
    ],
    flowData: subSchema




}, {timestamps: true});

//Collection is like table - where we group all things

export default mongoose.model("Initiative", InitiativeSchema);


