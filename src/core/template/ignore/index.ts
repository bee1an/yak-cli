import { Command } from 'commander'
import GitNode from './git-node'
import eslint from './eslint'
import prettier from './prettier'
import { writeFileSync } from 'fs'
import { join } from 'path'
import { fileExistsSync } from '../../../utils'
import { execSync } from 'child_process'
import log from '../../../utils/log'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IgnoreTemplate {}
type IgnoreTemplateKeys = keyof IgnoreTemplate

type IgnoreType = 'git' | 'eslint' | 'prettier'

const ignoreFilename: Record<IgnoreType, string> = {
	git: '.gitignore',
	eslint: '.eslintignore',
	prettier: '.prettierignore'
}

export default {
	install(program: Command) {
		program.option('-i, --ignore <type>', 'Generate ignore file')
	},

	action(opts: { ignore?: IgnoreTemplateKeys; rewrite: boolean }) {
		if (!opts.ignore) return

		const { ignore } = opts
		const type = ignore.split('-')[0] as IgnoreType

		const ignoreTemplates: { [k in IgnoreTemplateKeys]: string } = {
			'git-node': GitNode,
			eslint,
			prettier
		}

		const currentExecPath = process.cwd()

		const filename = ignoreFilename[type]

		const existIgnore = fileExistsSync(join(currentExecPath, filename))

		if (existIgnore && !opts.rewrite) {
			log.error(filename + ' already exists')
			process.exit(0)
		}

		if (type === 'git') {
			const existGit = fileExistsSync(join(currentExecPath, '.git'))
			!existGit && execSync('git init')
		}

		writeFileSync(join(currentExecPath, filename), ignoreTemplates[ignore])

		log.success(filename + ' created')
	}
}
