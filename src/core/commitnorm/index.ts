import { Command } from 'commander'

export default function (program: Command) {
	const cmd = program.command('commitnorm').description('Generate commit message norm')

	cmd.action((opts) => {
		console.log('opts', opts)
	})
}
