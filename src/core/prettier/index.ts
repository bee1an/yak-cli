import { Command } from 'commander'
import fileDetect from './file-detect'
import fs from 'fs'
import path from 'path'
import { packageJson } from './paths'
import { execSync } from 'child_process'
import { isMonorepo } from '../../utils/is-monorepo'
import log from '../../utils/log'

const prettierVersion = '3.5.3'

export default function (program: Command) {
	program
		.command('prettier')
		.description('Prettier work line')
		.action(async () => {
			const currentExecPath = process.cwd()

			log('Prettier work line')
			log.loading('Detecting')
			const exit = await fileDetect(currentExecPath)
			exit && process.exit()

			log.loading('Writing')
			execSync('yak template -p -r')
			execSync('yak template -i prettier -r')

			const installOption = isMonorepo(currentExecPath) ? ' -w' : ''

			const pkg = JSON.parse(fs.readFileSync(path.join(currentExecPath, packageJson)).toString())

			let installLog = 'Installing'
			if (pkg.dependencies?.['prettier']) {
				log.warning('Prettier already exists in dependencies')
				installLog = 'Reinstalling'

				// 错误的依赖
				execSync('pnpm remove prettier' + installOption, { stdio: 'inherit' })
			}

			log.loading(installLog)
			execSync(`pnpm add prettier@${prettierVersion} -D -E` + installOption, { stdio: 'inherit' })
			log.success('Successfully')
		})
}
