#!/usr/bin/env node

/**
 * 自动添加git commit message规范限制
 * 依赖 husky @commitlint/cli @commitlint/config-conventional cz-git commitizen lint-staged
 * 当项目安装了eslint或prettier时，才会依赖**lint-staged**
 * 全局安装commitizen cz-git
 * ```bash
 * npm install -g commitizen cz-git
 * ```
 * 在~/.czrc 中配置适配器
 * ```bash
 * node -e "fs.writeFileSync(path.join(os.homedir(), '/.czrc'), JSON.stringify({ path: 'cz-git', useEmoji: true }))"
 * ```
 * lint-staged 配置参考了 naive-ui
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const { fileExistsSync } = require('../../utils')
const {
	commitlintConfigMjs,
	husky_commitMsg,
	husky_preCommit,
	packageJson
} = require('./filenames')
const commitlintConfigMjsTmp = require('./commitlintConfigMjsTmp')
const { errorIcon, successIcon, loadingIcon } = require('../../icons')
const dependencies = require('./dependencies')

const execPath = process.cwd()

/* 文件检测 */
const existCommitlint = fileExistsSync(path.join(execPath, commitlintConfigMjs))

const existHusky = fileExistsSync(path.join(execPath, '.husky'))

const existPackageJson = fileExistsSync(path.join(execPath, packageJson))

!existPackageJson && console.log(`${errorIcon} package.json not found, please run init first`)

existCommitlint && console.log(`${errorIcon} commitlint.config.mjs already exists`)

existHusky && console.log(`${errorIcon} husky already exists`)

if (existCommitlint || existHusky || !existPackageJson) process.exit(0)

const { 'lint-staged': lintStage, ...restDependencies } = dependencies

let defaultDependencies = ''

for (const key in restDependencies) {
	defaultDependencies += `${key}@${restDependencies[key]} `
}

/* 依赖安装 */
console.log(`${loadingIcon} installing defaultDependencies`)

execSync(`pnpm add ${defaultDependencies} -D -E`, { stdio: 'inherit' })

execSync('npx husky init')

fs.writeFileSync(husky_commitMsg, 'commitlint --edit "$1"')

fs.writeFileSync('commitlint.config.mjs', commitlintConfigMjsTmp)

/* 依赖检测 */
let pkg = require(path.join(execPath, packageJson))

const lintStagedValue = {
	'*.{js,ts,tsx}': [],
	'*.vue': [],
	'*.css': [],
	'*.md': []
}

if (pkg.dependencies?.['eslint'] || pkg.devDependencies?.['eslint']) {
	;['*.{js,ts,tsx}', '*.vue', '*.md'].forEach((key) => {
		lintStagedValue[key].push('eslint --fix')
	})
}

if (pkg.dependencies?.['prettier'] || pkg.devDependencies?.['prettier']) {
	lintStagedValue['*.{js,ts,tsx}'].push('prettier --write')
	lintStagedValue['*.vue'].push('prettier --parser=vue --write')
	lintStagedValue['*.css'].push('prettier --write')
	lintStagedValue['*.md'].push('prettier --write --parser markdown --prose-wrap never')
}

for (const key in lintStagedValue) {
	if (lintStagedValue[key].length === 0) delete lintStagedValue[key]
}

if (Object.keys(lintStagedValue).length === 0) {
	console.log(`${successIcon} successfully`)
	fs.writeFileSync(husky_preCommit, '\n')
	process.exit(0)
}

console.log('Detecting that eslint or prettier is used, install lint-staged')

pkg = {
	...pkg,
	['lint-staged']: lintStagedValue
}

fs.writeFileSync(husky_preCommit, 'pnpm lint-staged')

fs.writeFileSync(packageJson, JSON.stringify(pkg, null, 2))

console.log(`${loadingIcon} installing lint-staged@${lintStage}`)

execSync(`pnpm add lint-staged@${lintStage} -D -E`, { stdio: 'inherit' })

console.log(`${successIcon} successfully`)
