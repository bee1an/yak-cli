import { Command } from 'commander'
import gitignore from './gitignore'
import editconfig from './editconfig'

/**
 * 根据配置创建对应模板
 * -g [xxx] 生成.gitignore模板, 默认node
 * -e 生成.editorconfig模板
 */

export interface TemplatePlugin {
	install: (program: Command) => void
	action: (...args: any[]) => void
}

export default function (program: Command) {
	const cmd = program.command('template').description('Generate template by option')

	const plugins: TemplatePlugin[] = [gitignore, editconfig]

	plugins.forEach((plugin) => {
		plugin.install(cmd)
	})

	cmd.action((opts) => {
		plugins.forEach((plugin) => {
			plugin.action(opts)
		})
	})
}
