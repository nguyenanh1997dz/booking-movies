const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv").config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.SECRET_KEY,
});
console.log(123123);
const cloudinaryUploadImg = (fileToUpload, folder = "products") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(fileToUpload, { folder }, (error, result) => {
      if (error) reject(error);
      else resolve({
        url: result.secure_url,
        asset_id: result.asset_id,
        public_id: result.public_id,
      });
    });
  });
};

const cloudinaryDeleteImg = (fileToDelete) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(fileToDelete, (error, result) => {
      if (error) reject(error);
      else if (result.result === 'not found') resolve(); 
      else if (result.result === 'ok') resolve(result);
      else reject(new Error('Deletion unsuccessful'));
    });
  });
};

module.exports = { cloudinaryUploadImg, cloudinaryDeleteImg };
