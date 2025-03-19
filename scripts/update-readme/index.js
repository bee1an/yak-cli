const fs = require("fs");

const path = require("path");

const readmePrefix = require("./prefix");
const { cmdPath, readmePath } = require("../paths");

fs.writeFileSync(readmePath, readmePrefix);

fs.readdirSync(cmdPath).forEach((file) => {
  const cmd = path.join(cmdPath, file, "index.js");

  const content = fs.readFileSync(cmd).toString();

  const comment = content.match(/\/\*\*([\s\S]*?)\*\//)[0];

  let descriptions = comment.split("\n").slice(1, -1);

  const cmdTitle = `\n### [${file}](/src/cmd/${file}/index.js)\n\n`;

  const cmdDes = descriptions.splice(0, 1)[0].replace(" * ", "") + "\n";

  descriptions = descriptions.map((des) => {
    return des.replace(" * ", "");
  });

  let codeSchema = false;

  const detail = descriptions.reduce((pre, cur) => {
    const codeLine = cur.startsWith("```");

    codeLine && (codeSchema = !codeSchema);

    return pre + (codeSchema || codeLine ? "" : "- ") + cur + "\n";
  }, "\n");

  fs.appendFileSync(readmePath, cmdTitle + cmdDes + detail);
});
