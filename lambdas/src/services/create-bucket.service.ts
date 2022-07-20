import AWS from "aws-sdk";
import { credentials, endpoint, region, s3ForcePathStyle } from "../config/aws.config";
const uuid = require("uuid");

const createBucket = async (bucketName: string, keyName: string) => {
  // Create a promise on S3 service object
  const bucketPromise = new AWS.S3({})
    .createBucket({ Bucket: bucketName })
    .promise();

  // Handle promise fulfilled/rejected states
  bucketPromise
    .then(function (data) {
      // Create params for putObject call
      var objectParams = {
        Bucket: bucketName,
        Key: keyName,
        Body: "Hello World!",
      };
      // Create object upload promise
      var uploadPromise = new AWS.S3({
        credentials,
        endpoint,
        region,
        s3ForcePathStyle,
      })
        .putObject(objectParams)
        .promise();

      uploadPromise.then(function (data) {
        console.log(
          "Successfully uploaded data to " + bucketName + "/" + keyName
        );
      });
    })
    .catch(function (err) {
      console.error(err, err.stack);
    });
};

export default createBucket;
