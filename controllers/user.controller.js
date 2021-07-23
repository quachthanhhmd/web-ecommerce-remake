const bcrypt = require('bcrypt');
const randomstring = require("randomstring");
const fs = require("fs")

const User = require('../models/user.model');

const upload = require('../config/multer')
const cloudinary = require('../config/cloudinary');

const CheckoutService = require("../services/checkout.service");
const ProductService = require("../services/Product.service");
const UserSevice = require('../services/user.Service');

const tokenLife = process.env.TOKEN_LIFE
const jwtKey = process.env.JWT_KEY

module.exports.getOne = async (req, res) => {

    const _id = req.session.passport.user;
    
  
    User.findById(_id)
    .then(async (user) => {
        if(!user){
            return res.status(404).json({
                message: 'User not found!'
            })
        }else{
            
            var error = req.session.error;
            const errorPhone = req.session.errorPhone;
            delete req.session.errorPhone
            delete req.session.error;
            
            //get lengh and modify phone number

           
            let str = String(user.phone);
            let phone = '';
            for (let i = 0; i < str.length - 1; i++){
                   phone  += '*';
            }
            phone = phone + str[str.length - 1];
            
            //checkout
            let checkout = await CheckoutService.find1checkout(user._id);
      
            res.render('user', {
                    title: "Profile",
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    phone: phone,
                    sex: user.sex,
                    birthday: user.birthday,
                    error: error,
                    errorPhone: errorPhone,
                    checkout: checkout,
                });

            //delete res.session.error;
        }
    })
    .catch(error => {
        res.status(500).json({
            message: 'Server error!',
            error
        })
    })
}

exports.saveInfor = async (req, res, next) =>{

    
    const { body } = req;
    
    const {name, email,  phone, sex, birthday} = req.body;
   
    try{
        var ret;    

        
        var fileUpload;

        if (Array.isArray(req.file)){
            fileUpload = [];
            for (const fie in  req.file) {
                if (fie !== "undefined") {
                    fileUpload.push(fie);
                }
            }
        }
        else{
            fileUpload = req.file;
           
        }
       
        
        if (fileUpload){

            

      
            ret = await cloudinary.uploadSingleAvatar(fileUpload.path);
         
            if (ret) {
                const user =  UserSevice.FindCloudinaryEmail(email);
                
                if (user.cloudinary_id){
                    await cloudinary.destroySingle(user.cloudinary_id);
                }
                
                
            }
        }
       
        console.log(ret);

        User.findOne({email: email})
        .then(user => {
            user.name = name;
            user.sex = sex;


            if (ret){
                user.image = ret.url;
                user.cloudinary_id = ret.id;
            }

            user.birthday = birthday;
            user.save();
            res.redirect('/user/account/profile');
    
        })
    
    }catch(err){
        res.render("error", {
            message: "Update fail",
            err,
          });
    }

}


exports.changePassword = (req, res) =>{

    const {password, newpass, confirmpass} = req.body;

    const _id = req.session.passport.user;

    User.findById(_id)
    .then(user =>{

        if (!user){
            return res.status(404).json({
                message: "User does not exists",
            })
        }
        else{
    
            
                bcrypt.compare(password, user.password)
                .then(result =>{
                
                    if (!result) {
                        req.session.error = 'Wrong password';
                        return res.redirect('/user/account/profile');
                    } else {


                        if (newpass === confirmpass){
                            if (newpass.length < 6){
                                req.session.error = "The minimum password length is 6!";
                                return res.redirect('/user/account/profile');
                            } 
                            else if ( newpass.length > 6){
                                req.session.error = 'The maximum password length is 30!';
                                return res.redirect('/user/account/profile');
                            }
                            else{
                                bcrypt.hash(newpass, bcrypt.genSaltSync(10))
                                .then(newhash =>{
                                    user.password = newhash;

                                    user.save();
                                    return res.redirect('/user/account/profile');
                                })
                            }
                        }
                        else{
                         
                            req.session.error = 'Confirm password does not match';
                            return res.redirect('/user/account/profile');
                        }
                    }
               
                })
            
        }

        
    })

    
}

exports.changeTel = (req, res) =>{

    const {curPhone, newPhone} = req.body;

    const _id = req.session.passport.user;

    
    User.findById(_id)
    .then(user =>{

        if (!user){
            return res.status(404).json({
                message: "User does not exists",
            })
        }
        else{
            const vnf_regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
            if (vnf_regex.test(newPhone) == false || vnf_regex.test(curPhone) == false ){

                req.session.errorPhone = 'Your input is not a phone number';
                return res.redirect('/user/account/profile');
            }   

            if (user.phone == curPhone){
                
                user.phone = newPhone;
                
                user.save();
                return res.redirect('/user/account/profile');
            }else{
                req.session.errorPhone = 'Wrong phone number';
                return res.redirect('/user/account/profile');
            }
            
        }

    })

}


module.exports.changeAddress = async(req, res) =>{

    const {newCity, newDistrict, newAddress} = req.body;

    const _id = req.session.passport.user;

    
    User.findById(_id)
    .then(async user =>{

        if (!user){
            return res.status(404).json({
                message: "User does not exists",
            })
        }
        else{
           
           await UserSevice.updateAddress(user.email, newAddress, newDistrict, newCity);
           return res.redirect('/user/account/profile');
        }

    })

}


//view checkout page
module.exports.viewCheckout = async (req, res, next) =>{

    const {id} = req.params;

    try{
        const getCheckout = await CheckoutService.findCheckoutByID(id);
        
        
        return res.status(200).json({
            msg: "success",
            data: getCheckout
        });

    }catch(err){

        res.status(404).send({
            message: "error",
        })
    }
}

//wishlist
module.exports.getWishlist = async (req, res, next) => {
    let check = 0;
    if (req.user.likes.length > 0)
        check = 1;
	res.render('wishlist', { user: req.user , check : check});
};

module.exports.postLike = async (req, res, next) => {
	const { slugname } = req.params;
	const { user } = req;
    
	try {
        const product = await ProductService.findbySlugname(slugname);
       
		if (!product) {
			return res.status(200).json({
				msg: 'ValidatorError',
				user: 'Product error',
			});
		}

		const { name, slugName, price, images } = product;

		const like = {
			name,
			slugName,
			price,
			images,
			date: new Date(),
		};
        
        user.likes.push(like);
        await UserSevice.updateOneUser( user._id, user);
	
        
		res.status(201).json({
			msg: 'success',
			user: `Your like has been completed!`,
			data: like,
		});
	} catch (error) {
		console.log(error);
		res.status(205).json({
			msg: 'ValidatorError',
			user: error.message,
			error,
		});
	}
};


module.exports.postUnLike = async (req, res, next) => {
	const { slugname } = req.params;
	let { user } = req;
    
	try {
		user.likes = user.likes.filter((ele) => ele.slugName != slugname);
		await UserSevice.updateOneUser(user._id, user );
      
		req.user = user;
		res.status(201).json({
			msg: 'success',
			user: `Your delete has been execute!`,
			data: user.likes,
		});
	} catch (error) {
		
		res.status(205).json({
			msg: 'ValidatorError',
			user: error.message,
			error,
		});
	}
};

//log out
exports.logout = (req, res, next) => {
   
    req.session.destroy();;
   
    req.logout();
    res.redirect("/");
  };
