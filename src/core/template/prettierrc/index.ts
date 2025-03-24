import { Command } from 'commander'
import { fileExistsSync } from '../../../utils'
import { join } from 'path'
import { writeFileSync } from 'fs'
import log from '../../../utils/log'

export default {
	install(program: Command) {
		program.option('-p, --prettierrc', 'Generate .prettierrc')
	},
	action(opts: { prettierrc?: boolean; rewrite: boolean }) {
		if (!opts.prettierrc) return

		const currentExecPath = process.cwd()

		const exist = fileExistsSync(join(currentExecPath, '.prettierrc'))

		if (exist && !opts.rewrite) {
			log.error('.prettierrc already exists')
			process.exit(0)
		}

		writeFileSync(join(currentExecPath, '.prettierrc'), template)

		log.success('.prettierrc created')
	}
}

const template = `{
	"$schema": "https://json.schemastore.org/prettierrc",
	"semi": false,
	"tabWidth": 2,
	"singleQuote": true,
	"printWidth": 100,
	"trailingComma": "none",
	"useTabs": true
}
`
