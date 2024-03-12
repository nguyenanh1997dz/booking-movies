const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.SECRET_KEY,
});
const cloudinaryUploadImg = async (fileToUploads,folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(fileToUploads,{ folder: folder }, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve({
          url: result.secure_url,
          asset_id: result.asset_id,
          public_id: result.public_id,
        });
      }
    });
  });
};

const cloudinaryDeleteImg = async (fileToDelete) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(fileToDelete, (error, result) => {
      if (error) {
        console.error('Lỗi khi xóa hình ảnh từ Cloudinary:', error);
        reject(error);
      } else {
        if (result.result === 'not found') {
          console.warn('Hình ảnh đã không tồn tại trên Cloudinary:', result);
          resolve(); // Hình ảnh đã không tồn tại, coi như xóa thành công
        } else if (result.result === 'ok') {
          console.log('Xóa hình ảnh thành công từ Cloudinary:', result);
          resolve({
            url: result.secure_url,
            asset_id: result.asset_id,
            public_id: result.public_id,
          });
        } else {
          console.error('Xóa hình ảnh không thành công từ Cloudinary:', result);
          reject(new Error('Xóa không thành công'));
        }
      }
    });
  });
};


module.exports = { cloudinaryUploadImg, cloudinaryDeleteImg };
