const {userModel} = require("../../models/user")

exports.getCustomerPage = async(req,res)=>{
    try {
        const users = await userModel.find();
        console.log(users);
        res.render("customers",{users:users});
        
    } catch (error) {
        res.status(500).json({error:"server is not responding"})
        
    }
}

exports.blockUser = async(req,res)=>{
    const userId = req.body.id;
    console.log(userId);
    console.log("block user");
    try {
        const result = await userModel.findByIdAndUpdate(userId,{status:"Blocked"})
        if(result == null){
            res.json({error:"unable to block user"});
        }else{
            res.json({redirect:"/admin/customers"})
        }
    } catch (error) {
        res.status(500).json({error:"server is not responding"})
        
    }
}
exports.unblockUser = async(req,res)=>{
    const userId = req.body.id;
    console.log(userId);
    console.log("block user");
    try {
        const result = await userModel.findByIdAndUpdate(userId,{status:"Active"})
        if(result == null){
            res.json({error:"unable to unblock user"});
        }else{
            res.json({redirect:"/admin/customers"})
        }
    } catch (error) {
        res.status(500).json({error:"server is not responding"})
        
    }
}