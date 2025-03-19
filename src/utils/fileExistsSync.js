const fs = require("fs");

/**
 * @description: 判断文件或文件夹是否存在
 */
function fileExistsSync(filePath) {
  try {
    return fs.statSync(filePath);
  } catch (err) {
    return false;
  }
}

module.exports = fileExistsSync;
