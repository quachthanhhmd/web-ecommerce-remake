const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const slug = require("mongoose-slug-updater");

const enumType = {
  values: [
    'Laptop & Macbook',
    'Linh kiện máy tính',
    'Màn hình máy tính',
    'Máy ảnh - Máy quay phim',
    'PC - Máy tính đồng bộ',
    'Thiết bị mạng - An ninh',
    'Thiết bị ngoại vi',
    'Thiết bị văn phòng',
    'Thiết bị âm thanh',
    'Điện máy - Điện gia dụng',
    'Điện thoại & Thiết bị thông minh'
  ],
  message: `Product type not found!`,
};

const enumTypeSmart = {
  values: [
    "Điện thoại",
    "Máy tính bảng",
    "Phụ kiện",
    "Đồng hồ thông minh",
    "Thiết bị Smart Home"
  ],
  message: `Type not found!`,
}


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
    //enum: enumType,
    required: [true, "Type is required!"],
  },
  device: {
    // chua co
    type: String,
    default: ""
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

productSchema.index({ name: "text", slugName: 'text' })
// Add plugins
productSchema.set("timestamps", true);

mongoose.plugin(slug);

productSchema.plugin(mongoosePaginate);


const productModel = mongoose.model('products', productSchema, 'products');

module.exports = productModel;


