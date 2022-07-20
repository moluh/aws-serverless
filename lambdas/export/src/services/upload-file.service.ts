import AWS from "aws-sdk";

async function uploadFile(file: string, data: any) {
  const credentials = {
    accessKeyId: "test",
    secretAccessKey: "test",
  };

  const s3 = new AWS.S3({
    /*
      credentials,
      endpoint: "http://localhost:4566",
      region: "localhost",
      s3ForcePathStyle: true,
      */
  });

  const keyName = "files/documentos/" + file;
  return new Promise((resolve) => {
    s3.upload(
      {
        Bucket: "cola-de-descarga",
        Key: keyName,
        Body: data,
        ACL: "public-read",
      },
      (err: any, response: unknown) => {
        if (err) throw err;
        resolve(response);
      }
    ).on("httpUploadProgress", function (evt) {
      console.log(evt);
    });
  });
}

export default uploadFile;
