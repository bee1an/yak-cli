import path from 'path'
import fs from 'fs'
import { husky_preCommit, packageJson, pnpmWorkspaceYaml } from './paths'
import { execSync } from 'child_process'
import log from '../../utils/log'
import { fileExistsSync } from '../../utils'

export default async function (execPath: string, version: string) {
	let pkg = JSON.parse(fs.readFileSync(path.join(execPath, packageJson)).toString())

	const lintStagedValue = {
		'*.{js,ts,tsx}': [],
		'*.vue': [],
		'*.css': [],
		'*.md': []
	} as Record<string, string[]>

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
		return true
	}

	log('Detecting that eslint or prettier is used, install lint-staged')

	pkg = {
		...pkg,
		['lint-staged']: lintStagedValue
	}

	fs.writeFileSync(path.join(execPath, husky_preCommit), 'pnpm lint-staged')

	fs.writeFileSync(path.join(execPath, packageJson), JSON.stringify(pkg, null, 2))

	log.loading(`Installing lint-staged@${version}`)

	execSync(
		`pnpm add lint-staged@${version} -D -E` + (fileExistsSync(pnpmWorkspaceYaml) ? ' -w' : ''),
		{ stdio: 'inherit' }
	)

	return false
}
