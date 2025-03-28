import { Command } from 'commander'
import { useOptions } from '../../utils/use-options'
import prediction from './prediction'
import install from './install'
import prettierWt from './prettier-wt'
import upgradePw from './upgrade-pw'
import config from './config'
import init from './init'

/**
 * 美化终端(PowerShell & Windows Terminal)
 * 前置条件: Windows Terminal & winget
 * 依赖项: clink@1.7.12, oh-my-posh@25.5.1
 * -c, --config <font | pw> 配置字体或者PowerShell
 * --install 安装 oh-my-posh & clink
 * -p, --prediction 命令执行的前置条件(判断是否有Windows Terminal & winget)
 * --no-prediction 关闭前置条件判断
 * --prettier-wt 美化 Windows Terminal
 * -u, --upgrade-pw 升级PowerShell
 * -i, --init 相当于执行yak terminalposh --prediction --install --prettier-wt --upgrade-pw --config pw
 */
export default function (program: Command) {
	const cmd = program.command('terminalposh').description('Posh your terminal')

	const { action, use } = useOptions(cmd)

	use(prediction, install, prettierWt, upgradePw, config, init)

	action()
}
