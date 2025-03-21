import { Command } from 'commander'
import node from './node'
import { writeFileSync } from 'fs'
import { join } from 'path'
import { fileExistsSync } from '../../../utils'
import { execSync } from 'child_process'
import { errorIcon, successIcon } from '../../../icons/states'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GitignoreTemplate {}
type GitignoreTemplateKeys = keyof GitignoreTemplate

export default {
	install(program: Command) {
		program.option('-g, --gitignore [type]', 'Generate .gitignore')
	},

	action(opts: { gitignore?: GitignoreTemplateKeys }) {
		if (!opts.gitignore) return

		const { gitignore } = opts

		const gitignoreTemplates: { [k in GitignoreTemplateKeys]: string } = { node: node }

		const currentExecPath = process.cwd()

		const existGitignore = fileExistsSync(join(currentExecPath, '.gitignore'))

		if (existGitignore) {
			console.log(`${errorIcon} .gitignore already exists`)
			process.exit(0)
		}

		const existGit = fileExistsSync(join(currentExecPath, '.git'))
		!existGit && execSync('git init')

		writeFileSync(
			join(currentExecPath, '.gitignore'),
			gitignoreTemplates[gitignore] ?? gitignoreTemplates['node']
		)

		console.log(`${successIcon} .gitignore created`)
	}
}
