const path = require("path");

const lintPath = path.resolve(__dirname, "run/lint");

module.exports = {
  "*.js": [`babel-node -- ${lintPath} --staged`]
};
