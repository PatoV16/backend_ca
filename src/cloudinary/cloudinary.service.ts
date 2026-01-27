// import { Injectable } from '@nestjs/common';
// import cloudinary from './cloudinary.config';
// import { Readable } from 'stream';

// @Injectable()
// export class CloudinaryService {
//   uploadImage(file: Express.Multer.File) {
//     return new Promise((resolve, reject) => {
//       const uploadStream = cloudinary.uploader.upload_stream(
//         { folder: 'nest-images' },
//         (error, result) => {
//           if (error) return reject(error);
//           resolve(result);
//         },
//       );

//       Readable.from(file.buffer).pipe(uploadStream);
//     });
//   }
// }
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  // =====================
  // UPLOAD IMAGE
  // =====================
  uploadImage(file: Express.Multer.File) {
    return new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'nest-images', // puedes cambiar el folder
          resource_type: 'image',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      Readable.from(file.buffer).pipe(uploadStream);
    });
  }

  // =====================
  // DELETE IMAGE
  // =====================
  async deleteImage(publicId: string) {
    return cloudinary.uploader.destroy(publicId);
  }
}
