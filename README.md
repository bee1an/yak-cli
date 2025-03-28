# 一些无聊的自动化脚本

## 安装：

```bash
npm install -g @yakk/cli
```

## 使用：

```bash
yak <command> [options]
```

## 命令：

### [commitnorm](/src/core/commitnorm/index.ts)

自动添加git commit message规范限制

- 依赖 husky @commitlint/cli @commitlint/config-conventional cz-git commitizen lint-staged
- 当项目安装了eslint或prettier时，才会依赖**lint-staged**
- lint-staged 配置参考了 naive-ui
- 全局安装commitizen cz-git

```bash
npm install -g commitizen cz-git
```

- 在~/.czrc 中配置适配器

```bash
node -e "fs.writeFileSync(path.join(os.homedir(), '/.czrc'), JSON.stringify({ path: 'cz-git', useEmoji: true }))"
```

### [prettier](/src/core/prettier/index.ts)

自动添加prettier配置

- 依赖 prettier@3.5.3
- [ ] 添加脚本

### [template](/src/core/template/index.ts)

根据配置创建对应模板

- -i git-node 生成.gitignore node模板
- -i prettier 生成.prettierignore模板
- -i eslint 生成.eslintignore模板
- -p 生成.prettierrc模板
- -e 生成.editorconfig模板
- 所有命令都支持-r参数，强制覆盖已存在的文件

### [terminalposh](/src/core/terminalposh/index.ts)

美化终端(PowerShell & Windows Terminal)

- 前置条件: Windows Terminal & winget
- 依赖项: clink@1.7.12, oh-my-posh@25.5.1, CascadiaCode Nerd Font
- 在命令结束后根据提示修改vscode终端字体
- 将下面代码复制到 vscode settings.json 中

```json
{
	"terminal.integrated.fontFamily": "CaskaydiaCove Nerd Font"
}
```
