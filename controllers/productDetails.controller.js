const Product= require('../models/ProductService');
const User = require('../models/user.model');
exports.detail = async(req, res, next) => {
    // Get books from model
    
    try{
        const id = req.user._id;
        const product = await Product.findbySlugname(req.params.slugName);
        
        
        if (!product){

            if (!product) 
            throw new Error("Product not found!");
        }
        // Pass data to view to display list of books
        //get 5 comments
        var comments = product.comments.slice(0, 4);
       
        res.render('product-details', {
            
            product: product,
            comments: comments,
            start: 1,
            NumComments: product.comments.length
        });
        
    }catch(error){
        console.log(error);
        res.status(500).json({
            msg: "ValidatorError",
            user: error.message,

        });
    }

    
};

module.exports.getComments = async (req, res) =>{

    try{

        const slugName = req.query.slugName;
        const numDisplay = parseInt(req.query.start);
      
        const product = await Product.findbySlugname(slugName);
        if (!product)
            return new Error("Product not found");
        
        var newComment = product.comments.slice(numDisplay*5, (numDisplay + 1) * 5 - 1);
        var check  = 0;
        if (product.comments.length < ((numDisplay + 1)* 5 - 1))
            check = 1;

        return res.status(200).json({
            msg: "success",
            data: {
                newComment, 
                check
            }
        })
    }catch(error){
        console.log(error);
        res.status(500).json({
            msg: "ValidatorError",
            user: error.message,
        });
    }

}

const getDay = (date) =>{

    var dateFormat = new Date(date);
  
    var d = dateFormat.toLocaleDateString();
    var h = dateFormat.toTimeString();
    console.log(h + ' ' + d);
    return h.split(':')[0] + ':' + h.split(':')[1] + ' ' + d;
  }
  

module.exports.postComment = async(req, res) => {

    try{
        //const user = req.user;
        const slugName = req.params.slugName;
        const {comment, rate} = req.body;
        const user = await User.findById(req.user._id);
        if (!user)
            return new Error("User not found");
        
        
        if (user.image === ''){
            user.image = "https://sieupet.com/sites/default/files/pictures/images/1-1473150685951-5.jpg";
        }
        
        var newComment = {
            comment: comment,
            user: user._id,
            imageUser: user.image,
            username: user.name,
            createAt: getDay(new Date()),
            rate: rate,
        }
        
        await Product.updateComments(slugName, newComment);
        
        return res.status(200).json({
            msg: "success",
            data: newComment
        })

    }catch(error){
        console.log(error);
        res.status(500).json({
            msg: "ValidatorError",
            user: error.message,
        });
    }

}