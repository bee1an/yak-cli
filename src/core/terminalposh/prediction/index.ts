import { Command } from 'commander'
import { OptionFlow } from '../../../utils/use-options'
import { fileExistsSync } from '../../../utils'
import log from '../../../utils/log'
import pc from 'picocolors'
import { execSync } from 'child_process'
import { wtPath } from '../constant'

const optionFlow: OptionFlow = {
	install: (cmd: Command) => {
		cmd.option('-p, --prediction', 'prediction', true).option('--no-prediction', 'prediction')
	},
	action: (opts: { prediction?: boolean }) => {
		if (!opts.prediction) {
			return
		}

		const exist = fileExistsSync(wtPath)
		if (!exist) {
			// 安装Windows Terminal引导
			log.error('Windows Terminal not found, please install it first')
			log('You can download it from the following link:')
			log('https://apps.microsoft.com/detail/9n0dx20hk701?hl=zh-CN&gl=CN')
			log(pc.red('You are advised to change the default Terminal to Windows Terminal'))
		}

		let hasWinget = false
		try {
			execSync('winget -v')
			hasWinget = true
		} catch {
			// 安装winget引导
			log.error('winget not found, please install it first')
			log('Detail:')
			log('https://github.com/microsoft/winget-cli?tab=readme-ov-file#installing-the-client')
			log('Open PowerShell as Administrator and type:')
			log('1: Install-Script winget-install -Force')
			log('2: winget-install')
		}

		;(!hasWinget || !exist) && process.exit()
	}
}
export default optionFlow
