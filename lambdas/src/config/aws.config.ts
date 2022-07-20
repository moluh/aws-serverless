import AWS from "aws-sdk";

const credentials: AWS.Credentials = <AWS.Credentials>{
  accessKeyId: String(process.env.AWS_ACCESS_KEY),
  secretAccessKey: String(process.env.AWS_SECRET_ACCESS_KEY),
};

const endpoint: string | AWS.Endpoint = (
  process.env.UPLOADS_BUCKET || "https://prod.moluh.com-files"
).toString();

const region: string = "localhost";
const s3ForcePathStyle: boolean = true;

export { credentials, endpoint, region, s3ForcePathStyle };
