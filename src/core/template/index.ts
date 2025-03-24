import { Command } from 'commander'
import ignore from './ignore'
import editconfig from './editconfig'
import prettierrc from './prettierrc'

/**
 * 根据配置创建对应模板
 * -i git-node 生成.gitignore node模板
 * -i prettier 生成.prettierignore模板
 * -i eslint 生成.eslintignore模板
 * -p 生成.prettierrc模板
 * -e 生成.editorconfig模板
 * 所有命令都支持-r参数，强制覆盖已存在的文件
 */

export interface TemplatePlugin {
	install: (program: Command) => void
	action: (...args: any[]) => void
}

export default function (program: Command) {
	const cmd = program
		.command('template')
		.option('-r, --rewrite', 'Rewrite the file if it exists')
		.description('Generate template by option')

	const plugins: TemplatePlugin[] = [ignore, editconfig, prettierrc]

	plugins.forEach((plugin) => {
		plugin.install(cmd)
	})

	cmd.action((opts) => {
		plugins.forEach((plugin) => {
			plugin.action(opts)
		})
	})
}
