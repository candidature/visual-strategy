import mongoose from "mongoose";


//////////////////////////////SUPER IMP - wasted 4 hrs!!!!!!!!!!
mongoose.pluralize(null);


const flowmodels_history = new mongoose.Schema({
    originId: Object,
    
    // viewport: {},
    // edges: [],
    // nodes: [],
    // updated_by: String,
    // revision: Number,

},{timestamps: true});

//Collection is like table - where we group all things

export default mongoose.model("flowmodels_history", flowmodels_history);


