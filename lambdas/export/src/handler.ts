import { Config } from "./config/config";
Config.init();
import ExportPayments from "./services/export-payment.service";

const exportPayments = async (
  event: any,
  context: { callbackWaitsForEmptyEventLoop: boolean },
  callback: any
) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    return await ExportPayments(event, context, callback);
  } catch (error: any) {
    console.log("CATCH FINAL ERROR ==> ", error);
    callback(null, {
      statusCode: error.statusCode || 500,
      body: "Error: ",
      error,
    });
  }
};

const exportAnotherThing = async (
  event: any,
  context: { callbackWaitsForEmptyEventLoop: boolean },
  callback: any
) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    return {
      success: true,
      message: "Another thing exported"
    };
  } catch (error: any) {
    console.log("CATCH FINAL ERROR ==> ", error);
    callback(null, {
      statusCode: error.statusCode || 500,
      body: "Error: ",
      error,
    });
  }
};

export { exportPayments, exportAnotherThing };
