const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const slug = require("mongoose-slug-updater");
 
const enumType = {
  values: ["PC", "laptop", "mobile", "Network equipment - Security", "Components"],
  message: `Product type must be 'PC', 'laptop', 'mobile', 'Network equipment - Security' or 'Components'!`,
};
 
const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required!"],
  },
  slugName: {
    type: String,
    slug: "name",
  },
  code: {
    type: String,
    default: "",
  },
  rating: {
    type: Number,
    default: 5,
  },
  price: {
    type: String,
    required: [true, "Price is required!"],
  },
  oldPrice: {
    type: String,
    slug: "price",
  },
  type: {
    // chua co
    type: String,
    default: "",
    enum: enumType,
    required: [true, "Type is required!"],
  },
  images: {
    type: Array,
    default: [],
  },
  tags: {
    type: Array,
    default: [],
  },
  producer: {
    type: String,
    required: [true, "Producer is required!"],
  },
  video: {
    type: String,
    default: "",
  },
  countView: {
    type: Number,
    default: 0,
  },
  countLike: {
    type: Number,
    default: 0,
  },
  countRating: {
    type: Number,
    default: 0,
  },
  countSale: {
    type: Number,
    default: 0,
  },
  details: {

  },
  descriptions: [
    {
      title: {
        type: String,
        default: "",
      },
      content: {
        type: String,
        default: "",
      },
      img: {
        type: String,
        default: "",
      },
    },
  ],
  comments: {
    type: Array,
    default: [],
  },
  promotion: {
    code: {
      type: String,
      default: "",
    },
    desc: {
      type: String,
      default: "",
    },
    link: {
      type: String,
      default: "",
    },
  },
  isRemove: {
      type: Boolean,
      default: 0,
  }
});

// Add plugins
productSchema.set("timestamps", true);

mongoose.plugin(slug);

productSchema.plugin(mongoosePaginate);
 

const productModel = mongoose.model('products', productSchema,'products');

module.exports = productModel;


