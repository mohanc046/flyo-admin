import { notification } from "antd";
import AWS from "aws-sdk";

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  region: process.env.REACT_APP_AWS_REGION
});

const s3 = new AWS.S3();
const BUCKET_NAME = "flayashop";

export const uploadToS3 = async (file) => {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Key: `${Date.now()}-${file.name}`, // File name in S3
      Body: file,
      ContentType: file.type
    };

    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.Location); // Return the file's URL
        }
      });
    });
  } catch (error) {
    notification.open({
      type: "warning",
      message: "Facing issue with image upload!"
    });
  }
};

// ✅ Export variables correctly in ES Modules
export { s3, BUCKET_NAME };
