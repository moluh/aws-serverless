import AWS from "aws-sdk";
import { credentials, endpoint } from "../config/aws.config";
import { logSaving } from "../utils/logSave";
const moment = require("moment");
const fs = require("fs");
const es = require("event-stream");
const parse = require("csv-parse/lib/sync");

const ExportPayments = async (
  event: { body: any },
  context: { callbackWaitsForEmptyEventLoop: boolean },
  callback: {
    (arg0: null, arg1: { statusCode: any; body: string; error: unknown }): void;
    (arg0: null, arg1: { statusCode: number; body: string }): void;
  }
) => {
  const data = event.body;
  const s3: any = new AWS.S3({ credentials, endpoint });
  // const s3 = new aws.S3({ apiVersion: '2006-03-01' });

  const filename = `${moment.utc().format("YYYYMMDD")}-Payments-Export.csv`;
  let filePath = "/home/deployer/";
  let inputFolder = "exports/";
  const uploadBucket = process.env.UPLOADS_BUCKET;

  const fileStream = fs.createWriteStream(filePath + filename);

  const s3Stream = s3
    .getObject({
      Bucket: uploadBucket,
      Key: inputFolder + filename,
    })
    .createReadStream();

  s3Stream.on("error", (err: any) => {
    logSaving(err);
  });

  s3Stream
    .pipe(fileStream)
    .on("error", (err: any) => {
      // capture any errors that occur when writing data to the file
      logSaving(err);
    })
    .on("close", async () => {
      const file = fs
        .createReadStream(filePath + filename)
        .pipe(es.split())
        .pipe(
          es
            .mapSync(async function (line: any) {
              // pause the readstream
              file.pause();
              const fields = parse(line, { delimiter: ";" })[0];
              console.log("fields ", fields);

              file.resume();
            })
            .on("error", async (err: any) => {
              console.log("Error while reading file at line ", err);
            })
            .on("end", async () => {
              console.log("PROCESS END");

              callback(null, {
                statusCode: 200,
                body: JSON.stringify({ Status: "OK" }),
              });
            })
        );
    });
};

export default ExportPayments;
