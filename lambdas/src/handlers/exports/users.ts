import { Config } from "src/config/config";

Config.init();

const exportUsers = async (
    event: any,
    context: { callbackWaitsForEmptyEventLoop: boolean },
    callback: any
  ) => {
    context.callbackWaitsForEmptyEventLoop = false;
  
    try {
      return await {
        
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