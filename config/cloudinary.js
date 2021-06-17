var cloudinary = require("cloudinary").v2;

cloudinary.config({
  CLOUDINARY_URL: process.env.CLOUDINARY_URL,
});

module.exports.uploadSingleAvatar = (file) => {
  return new Promise((resolve) => {
    cloudinary.uploader
      .upload(file, {
        folder: "user",
      })
      .then((result) => {
        if (result) {
          resolve({
            url: result.secure_url,
            id: result.public_id,
          });
        }
      });
  });
};

module.exports.destroySingle = (id) => {
    return new Promise((resolve) => {
      cloudinary.uploader.destroy(id, (error, result) => {
        resolve(result);
      });
    });
  };