import { Command } from 'commander'
import fileDetect from './file-detect'
import devDependencies from './dev-dependencies'
import installNecessary from './install-necessary'
import installLintStaged from './install-lint-staged'
import log from '../../utils/log'

/**
 * 自动添加git commit message规范限制
 * 依赖 husky @commitlint/cli @commitlint/config-conventional cz-git commitizen lint-staged
 * 当项目安装了eslint或prettier时，才会依赖**lint-staged**
 * lint-staged 配置参考了 naive-ui
 * 全局安装commitizen cz-git
 * ```bash
 * npm install -g commitizen cz-git
 * ```
 * 在~/.czrc 中配置适配器
 * ```bash
 * node -e "fs.writeFileSync(path.join(os.homedir(), '/.czrc'), JSON.stringify({ path: 'cz-git', useEmoji: true }))"
 * ```
 */

export default function (program: Command) {
	program
		.command('commitnorm')
		.description('Generate commit message norm')
		.action(async () => {
			const currentExecPath = process.cwd()

			const exit = await fileDetect(currentExecPath)
			exit && process.exit()

			const { 'lint-staged': lintStage, ...restDevDependencies } = devDependencies

			installNecessary(currentExecPath, restDevDependencies)

			const exit2 = await installLintStaged(currentExecPath, lintStage)

			exit2 && process.exit()

			log.success('Successfully')
		})
}
