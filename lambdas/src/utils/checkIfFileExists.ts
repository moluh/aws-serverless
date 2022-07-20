import { logSaving } from "./logSave";

/**
 * It checks if a file exists in an S3 bucket.
 *
 * @param s3 - AWS.S3
 * @param db - is a sequelize instance
 * @param logImportacion - is a log object that I'm saving to a database
 * @param filename - '2019-10-01.xlsx'
 * @param uploadBucket - 'my-bucket-name'
 * @param inputFolder - 'input/'
 */
const checkIfFileExists = async (
  s3: {
    headObject: (arg0: { Bucket: any; Key: any }) => {
      (): any;
      new (): any;
      promise: { (): any; new (): any };
    };
    getSignedUrl: (arg0: string, arg1: { Bucket: any; Key: any }) => any;
  },
  db: any,
  filename: any,
  uploadBucket: any,
  inputFolder: any
) => {
  try {
    const params = {
      Bucket: uploadBucket,
      Key: inputFolder + filename,
    };
    await s3.headObject(params).promise();
    const signedUrl = s3.getSignedUrl("getObject", params);
    // Do stuff with signedUrl
  } catch (error: any) {
    if (error.name === "NotFound") {
      console.log("No se subió un archivo para procesar");
      await logSaving(error);
      throw Error(`Error: ${error}`);
    } else {
      await logSaving(error);
      throw Error(`Error: ${error}`);
    }
  }
};

export default checkIfFileExists;
