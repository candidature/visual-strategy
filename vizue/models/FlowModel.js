import mongoose from "mongoose";
import {nanoid} from "nanoid";
import {INITIATIVE_STATUS, INITIATIVE_VISIBILITY, INITIATIVE_ARCHIVED} from "../utils/contants.js";
const initialNodes = {nodes: [{"data": {"type": "FlowNode1"}}]}

const nodeSchema = new mongoose.Schema({
    id: String,
    position: [Object],
    type: String,
    data: {
        name: String,
        description: String,
        stage: {
            type: String,
            enum: Object.values(INITIATIVE_STATUS),
            default: INITIATIVE_STATUS.NEW,
        },
        visibility: {
            type: String,
            enum: Object.values(INITIATIVE_VISIBILITY),
            default: INITIATIVE_VISIBILITY.PRIVATE,
        },
        archived: {
            type: String,
            enum: Object.values(INITIATIVE_ARCHIVED),
            default: INITIATIVE_ARCHIVED.NO,
        },

        accountable: {
            type: [String],
            persons: []
        },

        startDate: {
            type: Date,
            default: Date.now,
        },
        endDate: Date,

        kpis: [
            {
                kpiName: String,
                kpiDescription: String,
                kpiScore: Number,
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
    //nodes: [ nodeSchema ],
    //nodes: [ Object ]

});



const FlowSchema = new mongoose.Schema({
    //nodes: [nodeSchema]
    viewport: {},
    edges: [],
    nodes: [],
}, {timestamps: true});

//Collection is like table - where we group all things

export default mongoose.model("FlowModel", FlowSchema);


