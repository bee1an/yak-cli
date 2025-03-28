import { join } from 'path'

/**
 * @description oh-my-posh id
 */
export const ohMyPoshId = 'JanDeDobbeleer.OhMyPosh'

/**
 * @description oh-my-posh 版本
 */
export const ohMyPoshVersion = '25.5.1'

/**
 * @description clink id
 */
export const clinkId = 'chrisant996.Clink'

/**
 * @description clink 版本
 */
export const clinkVersion = '1.7.12'

/**
 * @description 新版 pwsh id
 */
export const pwId = 'Microsoft.PowerShell'

/**
 * @description 默认 clink 安装路径
 */
export const defaultClinkPath = join(process.env['ProgramFiles(x86)']!, 'clink')

/**
 * @description windows terminal 配置路径
 */
export const wtPath = join(
	process.env.LOCALAPPDATA!,
	'Packages',
	'Microsoft.WindowsTerminal_8wekyb3d8bbwe'
)

/**
 * @description windows terminal 配置文件路径
 */
export const wtSettingsPath = join(wtPath, 'LocalState', 'settings.json')

/**
 * @description pwsh 安装路径
 */
export const pwExEPath = join(process.env.ProgramFiles!, '\\PowerShell\\7\\pwsh.exe')

/**
 * @description pwsh config
 */
export const psConfigCmds = [
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

/**
 * @description pwsh profile 文件夹路径
 */
export const pwProfileDir = join(process.env.USERPROFILE!, 'Documents', 'PowerShell')

/**
 * @description pwsh profile 文件路径
 */
export const pwProfilePath = join(pwProfileDir, 'Microsoft.PowerShell_profile.ps1')
