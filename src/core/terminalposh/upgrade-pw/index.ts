import { execSync } from 'child_process'
import log from '../../../utils/log'
import { OptionFlow } from '../../../utils/use-options'
import { isInstalled } from '../../../utils/is-installed'
import { pwId } from '../constant'

const optionFlow: OptionFlow = {
	install(program) {
		program.option('-u, --upgrade-pw', 'Upgrade powershell')
	},
	action(opts: { upgradePw: boolean }) {
		if (!opts.upgradePw) return

		log.loading('Try to upgrade powershell')
		// 尝试升级powershell

		if (!isInstalled(pwId)) {
			try {
				execSync('winget install --id Microsoft.PowerShell --version 7.5.0.0 -s winget', {
					stdio: 'inherit'
				})
				log.success('Upgrade powershell success')
			} catch {
				// 忽略错误
				log.error('Upgrade or prettier powershell failed')
			}
		}
	}
}

export default optionFlow
