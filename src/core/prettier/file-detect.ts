import path from 'path'
import { fileExistsSync } from '../../utils'
import { prettierrc, prettierignore, packageJson } from './paths'
import prompts from 'prompts'
import log from '../../utils/log'

export default async function (execPath: string) {
	const existPackageJson = fileExistsSync(path.join(execPath, packageJson))

	if (!existPackageJson) {
		log.error('package.json not found, please run this command in a project directory')
		return true
	}

	const existPrettierConfig = fileExistsSync(path.join(execPath, prettierrc))

	const existPrettierIgnore = fileExistsSync(path.join(execPath, prettierignore))

	if (existPrettierConfig || existPrettierIgnore) {
		const response = await prompts({
			type: 'confirm',
			name: 'value',
			message: `Prettier config or prettier ignore already exists, do you want to overwrite it?`
		})

		if (!response.value) {
			return true
		}
	}

	return false
}
