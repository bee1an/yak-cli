import path from 'path'
import { fileExistsSync } from '../../utils'
import { commitlintConfigMjs, packageJson } from './paths'
import prompts from 'prompts'
import log from '../../utils/log'

export default async function (execPath: string) {
	const existPackageJson = fileExistsSync(path.join(execPath, packageJson))

	if (!existPackageJson) {
		log.error('package.json not found, please run this command in a project directory')
		return true
	}

	const existCommitlint = fileExistsSync(path.join(execPath, commitlintConfigMjs))

	const existHusky = fileExistsSync(path.join(execPath, '.husky'))

	if (existCommitlint || existHusky) {
		const response = await prompts({
			type: 'confirm',
			name: 'value',
			message: 'commitlint.config.mjs already exists, do you want to overwrite it?'
		})

		if (!response.value) {
			return true
		}
	}

	return false
}
