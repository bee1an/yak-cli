const path = require("path");

const root = path.resolve(__dirname, "..");

const srcPath = path.join(root, "src");

const cmdPath = path.join(srcPath, "cmd");

const readmePath = path.join(root, "README.md");

module.exports = { root, srcPath, cmdPath, readmePath };
