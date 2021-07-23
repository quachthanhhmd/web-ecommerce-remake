const User = require('../models/user.model');


module.exports.FindCloudinaryEmail = async(email) =>{

    return await User.findOne({email: email})
}

module.exports.findbyID = async(id) =>{

    return User.findbyId(id);
}


module.exports.updateAddress = async(email, address, district, city) => {

    
    User.findOne({email: email})
    .then(user =>{
        
        user.address = address;
        user.district = district;
        user.city = city;
        user.save();
    })
}

module.exports.updateOneUser = async(_id, user) =>{

    await User.updateOne(
        {_id: _id},
        {
            $set: user
        })
}