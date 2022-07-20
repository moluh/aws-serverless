const dotenv = require("dotenv");

export class Config {
  static init() {
    let result = dotenv.config({
      path: `.env`,
    });
    if (result.error) {
      throw Error(result.error);
    }
  }
}
