const mongoose = require("mongoose");
const connectionSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // reference to the User Collection
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // reference to the User Collection
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ["ignored" ,"interested" ,"accepted", "rejected"],
            message: "{VALUE} is not a valid status"
        },
        required: true,
        default: 'pending'
    }
}, {timestamps: true});

connectionSchema.indexes({fromUserId: 1, toUserId: 1});

connectionSchema.pre("save", function(next){
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connection request to yourself");
    }
    next();
})

const connectionRequest = new mongoose.model("ConnectionRequest", connectionSchema);

module.exports = connectionRequest;