import { v2 as cloudinary } from 'cloudinary';
import ApiError from '../errors/ApiError';

// const getPublicIdFile = (file: string) => {
//   return file.match(/\/v\d+\/(.+)\.\w+/)[1];
// };

// @ts-ignore
cloudinary.config({
  api_key: process.env['CLOUDINARY_KEY'] ?? '',
  api_secret: process.env['CLOUDINARY_SECRET'],
  cloud_name: process.env['CLOUDINARY_NAME'],
  secure: true,
});

// eslint-disable-next-line import/prefer-default-export
export const uploadFiles = async (files: any[]) => {
  try {
    const urlsImage = await Promise.all(
      files.map(
        (file) =>
          new Promise((resolve) => {
            cloudinary.uploader
              .upload_stream({ resource_type: 'auto', public_id: file.fileName, folder: 'QLKS' }, (error, result) => {
                if (error) {
                  // console.error('Upload failed:', error);
                  throw new ApiError(400, 'Upload failed');
                } else {
                  resolve(result?.url);
                }
              })
              .end(file.buffer);
          })
      )
    );
    return urlsImage;
  } catch (err) {
    /* empty */
  }
};

// export const destroyFile = async (files: string[]) => {
//   if (files.length > 0) {
//     try {
//       await Promise.all(
//         files.map((file) => {
//           const publicId = getPublicIdFile(file);
//           return cloudinary.uploader.destroy(String(publicId));
//         })
//       );
//     } catch (err) {
//       console.log({ err });
//     }
//   }
// };
