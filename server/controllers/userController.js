const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Research = require("../models/Research");

// ==========================================
// Get Profile
// ==========================================

exports.getProfile = async (req,res)=>{

try{

const user = await User.findById(req.user.id).select("-password");

const totalResearch = await Research.countDocuments({
user:req.user.id,
});

const invest = await Research.countDocuments({
user:req.user.id,
decision:"INVEST",
});

const pass = await Research.countDocuments({
user:req.user.id,
decision:"PASS",
});

const confidenceData = await Research.find({
user:req.user.id,
});

let avg = 0;

if(confidenceData.length){

const total = confidenceData.reduce((sum,item)=>sum+item.confidence,0);

avg=Math.round(total/confidenceData.length);

}

res.json({

success:true,

user,

stats:{

totalResearch,

invest,

pass,

averageConfidence:avg,

}

});

}

catch(err){

console.log(err);

res.status(500).json({

success:false,

message:"Server Error",

});

}

};

// ==========================================
// Update Profile
// ==========================================

exports.updateProfile=async(req,res)=>{

try{

const{name,email}=req.body;

const user=await User.findById(req.user.id);

if(name!==undefined){
user.name=name;
}

if(email!==undefined){
user.email=email;
}

await user.save();

res.json({

success:true,

message:"Profile Updated",

user,

});

}

catch(err){

res.status(500).json({

success:false,

message:err.message,

});

}

};

// ==========================================
// Change Password
// ==========================================

exports.changePassword=async(req,res)=>{

try{

const{

oldPassword,

newPassword,

}=req.body;

const user=await User.findById(req.user.id);

if(user.provider==="google"){

return res.status(400).json({

success:false,

message:"Google users cannot change password.",

});

}

const match=await bcrypt.compare(

oldPassword,

user.password

);

if(!match){

return res.status(400).json({

success:false,

message:"Old Password Incorrect",

});

}

const salt=await bcrypt.genSalt(10);

user.password=await bcrypt.hash(

newPassword,

salt

);

await user.save();

res.json({

success:true,

message:"Password Updated",

});

}

catch(err){

res.status(500).json({

success:false,

message:err.message,

});

}

};
// =======================================
// Upload Avatar
// =======================================

exports.uploadAvatar = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({

                success: false,

                message: "No Image Uploaded",

            });

        }

        const user = await User.findById(req.user.id);

        user.avatar = req.file.filename;

        await user.save();

        res.json({

            success: true,

            message: "Avatar Updated",

            avatar: req.file.filename,

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message,

        });

    }

};