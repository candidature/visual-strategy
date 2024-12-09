import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    lastName: {
        type: String,
        default: "lastName"
    },
    role: {
        type: String,
        enum: ["user", "admin", "readonly"], //If you are a user, you have readwrite to your department. If you are a admin, you have suprt
        //If you are having readonly, you have readonly to everything by default. everyone can see big picture.
        default: "user"
    }
}, {timestamps: true});

//Fix to make sure if someone looks at current-user on froentend they don't get password.
//toJSON isn't preexisting method but a new method created below.
UserSchema.methods.toJSON = function () {
    let obj = this.toObject()
    delete obj.password
    return obj;
}

//Collection is like table - where we group all things

export default mongoose.model("User", UserSchema);