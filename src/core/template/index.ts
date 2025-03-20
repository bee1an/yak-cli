import { Command } from 'commander'
import { gitignoreInstall, gitignoreAction } from './gitignore'

export default function (program: Command) {
	const cmd = program.command('template').description('Generate template by option')

	gitignoreInstall(cmd)

	cmd.option('-l, --list', 'get template list')

	cmd.action((opts) => {
		gitignoreAction(opts)
	})
}
