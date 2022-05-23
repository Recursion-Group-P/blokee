const DotEnv = require("dotenv");

module.exports = function () {
  return parsedEnv = DotEnv.config().parsed;
};
