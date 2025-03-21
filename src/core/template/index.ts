import { Command } from 'commander'
import { gitignoreInstall, gitignoreAction } from './gitignore'

/**
 * 根据配置创建对应模板
 * -g [xxx] 生成.gitignore模板, 默认node
 * [ ] '-l, --list' 获取模板列表
 */

export default function (program: Command) {
	const cmd = program.command('template').description('Generate template by option')

	gitignoreInstall(cmd)

	cmd.option('-l, --list', 'get template list')

	cmd.action((opts) => {
		gitignoreAction(opts)
	})
}
