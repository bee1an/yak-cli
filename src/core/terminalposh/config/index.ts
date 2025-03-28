import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import { isInstalled } from '../../../utils/is-installed'
import { OptionFlow } from '../../../utils/use-options'
import {
	pwId,
	pwExEPath,
	pwProfilePath,
	wtSettingsPath,
	psConfigCmds,
	pwProfileDir
} from '../constant'
import log from '../../../utils/log'
import { execSync } from 'child_process'
import { fileExistsSync } from '../../../utils'
import prompts from 'prompts'

type configType = 'font' | 'pw'

const optionFlow: OptionFlow = {
	install(program) {
		program.option('-c, --config <type...>', 'Set config')
	},
	async action(opts: { config?: configType[] }) {
		if (typeof opts.config === 'undefined' || opts.config.length === 0) return

		// 终端settings.json
		const settings = JSON.parse(readFileSync(wtSettingsPath, { encoding: 'utf-8' }))
		const profiles = settings.profiles

		if (opts.config.includes('font')) {
			const { font } = await prompts({
				type: 'text',
				name: 'font',
				message: "Please enter the font name, Make sure it's on your system"
			})

			profiles.defaults = {
				...(profiles.defaults || {}),
				colorScheme: 'One Half Dark',
				font: {
					face: font,
					size: 10
				},
				opacity: 85,
				useAcrylic: true
			}

			log.info('Finally replace the fonts in the vscode terminal')
			log.info('Option vscode settings.json')
			log(`{\n  "terminal.integrated.fontFamily": "${font}"\n}`)
		}

		if (opts.config.includes('pw')) {
			!isInstalled(pwId) && process.exit()

			const powershellItem = profiles.list.find((itme: any) => itme.name === 'Windows PowerShell')

			// 修改powershell的启动命令为最新安装的powershell
			powershellItem.commandline = pwExEPath

			log.loading('Configuring your powershell')

			// 使用管理员权限运行powershell并执行这些命令
			execSync(
				`powershell -Command "Start-Process PowerShell -Verb RunAs '${psConfigCmds.join(';')}'"`
			)

			!fileExistsSync(pwProfileDir) && mkdirSync(pwProfileDir)

			if (fileExistsSync(pwProfilePath)) {
				const config = Array.from(new Set(readFileSync(pwProfilePath).toString().split('\n')))

				config.push('oh-my-posh init pwsh  | Invoke-Expression')
				writeFileSync(pwProfilePath, config.join('\n'))
			} else {
				writeFileSync(pwProfilePath, 'oh-my-posh init pwsh  | Invoke-Expression')
			}
		}

		writeFileSync(wtSettingsPath, JSON.stringify(settings, null, 2))
	}
}

export default optionFlow
