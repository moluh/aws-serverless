const dotenv = require("dotenv");

export class Config {
  static init() {
    let result = dotenv.config({
      path: `.env`,
    });
    console.log("🚀 ~ result dotenv:", result)
    
    if (result.error) {
      throw Error(result.error);
    }
  }
}
