import { exec, cd } from 'shelljs'
import prompts from 'prompts'

async function publish() {
	exec('pnpm install --frozen-lockfile')
	exec('pnpm build')

	cd('./dist')
	exec('npm pkg fix')

	const { otp } = await prompts({
		type: 'number',
		name: 'otp',
		message: 'please input your one-time password'
	})

	exec('npm publish --otp=' + otp)
}

publish()
