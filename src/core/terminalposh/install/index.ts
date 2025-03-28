import { execSync } from 'child_process'
import { isInstalled } from '../../../utils/is-installed'
import log from '../../../utils/log'
import { OptionFlow } from '../../../utils/use-options'
import { clinkId, clinkVersion, ohMyPoshId, ohMyPoshVersion } from '../constant'

const optionFlow: OptionFlow = {
	install(program) {
		program.option('--install', 'Install oh-my-posh & clink')
	},
	action(opts: { install: boolean }) {
		if (!opts.install) return

		log.loading('Installing oh-my-posh & clink')
		!isInstalled(ohMyPoshId) &&
			execSync(`winget install --id ${ohMyPoshId} --version ${ohMyPoshVersion} -s winget`, {
				stdio: 'inherit'
			})

		// 安装clink
		!isInstalled(clinkId) &&
			execSync(`winget install --id ${clinkId} --version ${clinkVersion}`, {
				stdio: 'inherit'
			})
	}
}

export default optionFlow
