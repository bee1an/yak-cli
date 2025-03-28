import { execSync } from 'child_process'
import { Command } from 'commander'
import { clink, ohMyPosh, pw } from './packageIds'
import { isInstalled } from '../../utils/is-installed'
import { downloadZip } from '../../utils/download'
import log from '../../utils/log'
import { uid } from 'uid'
import { createProgressBar } from '../../utils/create-progress-bar'
import { unzipFile } from '../../utils/unzip-file'
import { copyFileSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'fs'
import { join } from 'path'
import { fileExistsSync } from '../../utils'
import pc from 'picocolors'

const fontUrl = 'https://github.com/ryanoasis/nerd-fonts/releases/download/v3.3.0/CascadiaCode.zip'

/**
 * 美化终端(PowerShell & Windows Terminal)
 * 前置条件: Windows Terminal & winget
 * 依赖项: clink@1.7.12, oh-my-posh@25.5.1, CascadiaCode Nerd Font
 * 在命令结束后根据提示修改vscode终端字体
 * 将下面代码复制到 vscode settings.json 中
 * ```json
 * {
 * 	"terminal.integrated.fontFamily": "CaskaydiaCove Nerd Font"
 * }
 * ```
 */
export default function (program: Command) {
	program
		.command('terminalposh')
		.description('Posh your terminal')
		.action(async () => {
			// #region predictions
			const wtPath = join(
				process.env['LOCALAPPDATA']!,
				'Packages',
				'Microsoft.WindowsTerminal_8wekyb3d8bbwe'
			)

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
				log('You can download it from the following link:')
				log('https://github.com/microsoft/winget-cli?tab=readme-ov-file#installing-the-client')
				log('The client is distributed within the App Installer package')
				log('https://apps.microsoft.com/detail/9nblggh4nns1?hl=zh-CN&gl=GR')
			}
			;(!hasWinget || !exist) && process.exit()
			// #endregion

			// #region install oh-my-posh & clink
			log.loading('Installing oh-my-posh & clink')
			!isInstalled(ohMyPosh) &&
				execSync(`winget install --id ${ohMyPosh} --version 25.5.1 -s winget`, { stdio: 'inherit' })

			// 安装clink
			!isInstalled(clink) &&
				execSync(`winget install --id ${clink} --version 1.7.12`, { stdio: 'inherit' })
			// #endregion

			// #region install font
			log.loading('Installing font')
			const unzipFilename = `CascadiaCode-${uid(6)}`
			const temporaryFilename = `${unzipFilename}.zip`

			const progressBar = createProgressBar(100)
			await new Promise((resolve) => {
				// 下载字体
				downloadZip(fontUrl, temporaryFilename, {
					onProgress: (progress) => {
						progressBar(progress)
					},
					onComplete: async () => {
						log.success('Download fonts finished')

						// 解压字体
						await unzipFile(temporaryFilename, unzipFilename)

						rmSync(temporaryFilename, { recursive: true, force: true })

						const fontsPath = join(process.env.SystemRoot!, 'Fonts')

						try {
							// 安装字体
							readdirSync(unzipFilename).forEach((file) => {
								file.endsWith('.ttf') && copyFileSync(`${unzipFilename}/${file}`, fontsPath)
							})

							log.success('Install fonts success')

							rmSync(unzipFilename, { recursive: true, force: true })
						} catch (error: any) {
							log.error('Install fonts error but continue, error message:')
							log.error(error.message)
						}

						resolve(true)
					},
					onError: (error) => {
						log.error('Download fonts error, error message:')
						log.error(error)
						resolve(true)
					}
				})
			})
			// #endregion

			// #region prettier cmd
			if (fileExistsSync(join(process.env['ProgramFiles(x86)']!, 'clink'))) {
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

			const settingsPath = join(wtPath, 'LocalState', 'settings.json')

			// 修改终端settings.json
			const settings = JSON.parse(readFileSync(settingsPath, { encoding: 'utf-8' }))

			const profiles = settings.profiles

			// 修改终端样式
			profiles.defaults = {
				...(profiles.defaults || {}),
				colorScheme: 'One Half Dark',
				font: {
					face: 'CaskaydiaCove Nerd Font',
					size: 10
				},
				opacity: 85,
				useAcrylic: true
			}
			// #endregion

			// #region upgrade powershell
			log.loading('Try to upgrade powershell')
			// 尝试升级powershell

			let installPwError = false
			if (!isInstalled(pw)) {
				try {
					execSync('winget install --id Microsoft.PowerShell --version 7.5.0.0 -s winget', {
						stdio: 'inherit'
					})
					log.success('Upgrade powershell success')
					// #endregion
				} catch {
					installPwError = true
					// 忽略错误
					log.error('Upgrade or prettier powershell failed')
				}
			}

			if (!installPwError) {
				// #region config powershell
				const powershellItem = profiles.list.find((itme: any) => itme.name === 'Windows PowerShell')
				// 修改powershell的启动命令为最新安装的powershell
				powershellItem.commandline = process.env.ProgramFiles + '\\PowerShell\\7\\pwsh.exe'

				log.loading('Configuring your powershell')
				const psCmds = [
					// 设置 PowerShell 的执行策略为 RemoteSigned
					'set-executionpolicy RemoteSigned',
					// // 查看 PowerShell 的输出编码格式
					'$OutputEncoding',
					// // powershell初始化加载 PSReadLine 模块
					'Import-Module PSReadLine',
					// // 使用历史记录进行脚本提示
					'Set-PSReadLineOption -PredictionSource History'
					// alt在windows中有特殊用途，使用Tab键代替
					// 'Set-PSReadLineKeyHandler -Chord "Tab" -Function ForwardWord'
				]

				// 使用管理员权限运行powershell并执行这些命令
				execSync(`powershell -Command "Start-Process PowerShell -Verb RunAs '${psCmds.join(';')}'"`)

				const psProfile = join(
					process.env.USERPROFILE!,
					'Documents',
					'WindowsPowerShell',
					'Microsoft.PowerShell_profile.ps1'
				)

				if (fileExistsSync(psProfile)) {
					const config = readFileSync(
						join(
							process.env.USERPROFILE!,
							'Documents',
							'WindowsPowerShell',
							'Microsoft.PowerShell_profile.ps1'
						)
					)
						.toString()
						.split('\n')

					config.push('oh-my-posh init pwsh  | Invoke-Expression')
					writeFileSync(psProfile, config.join('\n'))
				} else {
					writeFileSync(psProfile, 'oh-my-posh init pwsh  | Invoke-Expression')
				}
				// #endregion config powershell
			}

			writeFileSync(settingsPath, JSON.stringify(settings, null, 2))

			// #region config vscode
			log('Now you have all the configurations')
			log('Finally replace the fonts in the vscode terminal')

			log.info('Option vscode settings.json')
			log('{\n  "terminal.integrated.fontFamily": "CaskaydiaCove Nerd Font"\n}')
			// #endregion
		})
}
