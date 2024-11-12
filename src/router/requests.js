const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");
const connectionRequest = require("../models/connectionRequest.js");
const User = require("../models/user.js");
requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
    const user = req.user;
    res.send("Connection Request Sent");
    console.log(user.firstName + " " + user.lastName + " sent the connection request");
})

//Route to only send interested or ignored
requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const ALLOWED_STATUS = ['ignored', 'interested'];
        if (!ALLOWED_STATUS.includes(status)) {
            return res.status(404).json({
                message: "Invalid status type: " + status
            })
        }
        const toUser = await User.findById({_id: toUserId});
        if(!toUser) {
            return res.status(404).json({
                message: "User not found"
            })
        }


        //check if there is an existing request in the Datbase
        const existingRequest = await connectionRequest.findOne({
            $or: [
                {
                    fromUserId: fromUserId,
                    toUserId: toUserId
                },
                {
                    fromUserId: toUserId,
                    toUserId: fromUserId
                }
            ],
        });

        if(existingRequest){
            return res.status(404).json({
                message: "Request already sent"
            })
        }

        const connection = new connectionRequest({
            fromUserId,
            toUserId,
            status
        });
        const data = await connection.save();
        res.json({
            message: req.user.firstName + "is " + status + " in "+ toUser.lastName,
            data
        });
    }
    catch (err) {
        res.status(404).send(err.message);
    }
    res.send("Interest sent successfully");
})

requestRouter.post("/request/review/:status/:requestId", userAuth, async(req, res)=> {
    try{
        const loggedInUser = req.user;
        const {status, requestId} = req.params;

        //validate status 
        const allowedStatus = ['accepted','rejected'];
        if(!allowedStatus.includes(status)){
            return res.status(404).json({
                message:"Invalid Status Type: "+status 
            })
        }
        // requestId must be valid
        // loggedIn User must be the receiver of the requests
        // status of connectionRequest must be interested
        const connection = await connectionRequest.findOne({fromUserId: requestId,
            toUserId: loggedInUser._id,
            status: 'interested'
        });

        if(!connection){
            return res.status(404).json({
                message: "Invalid Request, Connection Request Not found"
            })
        }

        connection.status = status;
        const data = await connection.save();

        res.json({
            message : "Connection Request "+status,
            data
        });
    }
    catch(err){
        res.status(404).send(err.message);
    }
})
module.exports = requestRouter;
