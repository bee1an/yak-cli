import { join } from 'path'
import { fileExistsSync } from '../../../utils/file-exists-sync'
import { OptionFlow } from '../../../utils/use-options'
import log from '../../../utils/log'
import { execSync } from 'child_process'
import { defaultClinkPath } from '../constant'

const optionFlow: OptionFlow = {
	install(program) {
		program.option('--prettier-wt', 'Prettier Windows Terminal')
	},
	action(opts: { prettierWt: boolean }) {
		if (!opts.prettierWt) return

		if (fileExistsSync(defaultClinkPath)) {
			// clink 执行前执行 oh-my-posh
			log.loading('Prettier cmd ...')
			// 原始管理员权限命令
			const targetCommand = `$content = @"\nload(io.popen('oh-my-posh init cmd'):read("*a"))()\n"@\n$content | Out-File '${join(process.env['ProgramFiles(x86)']!, 'clink', 'oh-my-posh.lua')}' -Encoding UTF8`
			// 转换为 Base64
			const encodedCommand = Buffer.from(targetCommand, 'utf16le').toString('base64')
			// 执行命令
			execSync(
				`powershell -Command "Start-Process PowerShell -ArgumentList '-EncodedCommand','${encodedCommand}' -Verb RunAs"`
			)
		} else {
			// 如果clink没有在默认路径, 则提示用户手动配置
			log.warning(
				'clink not found in default path, please Run the following command in the clink directory'
			)
			log.info(`echo load(io.popen('oh-my-posh init cmd'):read("*a"))() > oh-my-posh.lua`)
		}
	}
}

export default optionFlow
