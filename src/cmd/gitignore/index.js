#!/usr/bin/env node

/**
 * yak-gitignore
 * 创建一个基于node的项目的gitignore文件
 * gitignore模板来自gitee
 * 执行文件夹不是一个git仓库时，会自动初始化一个git仓库
 */

const { fileExistsSync } = require("../../utils");
const gitignoreTmp = require("./gitignoreTmp");
const fs = require("fs");
const path = require("path");
const { errorIcon, successIcon } = require("../../icons");
const { execSync } = require("child_process");

const execPath = process.cwd();

const existGitignore = fileExistsSync(path.join(execPath, ".gitignore"));

const existGit = fileExistsSync(path.join(execPath, ".git"));

!existGit && execSync("git init");

if (existGitignore) {
  console.log(`${errorIcon} .gitignore already exists`);
  process.exit(0);
}

fs.writeFileSync(path.join(execPath, ".gitignore"), gitignoreTmp);

console.log(`${successIcon} create .gitignore`);
