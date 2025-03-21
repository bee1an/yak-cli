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
- 全局安装commitizen cz-git

```bash
npm install -g commitizen cz-git
```

- 在~/.czrc 中配置适配器

```bash
node -e "fs.writeFileSync(path.join(os.homedir(), '/.czrc'), JSON.stringify({ path: 'cz-git', useEmoji: true }))"
```

- lint-staged 配置参考了 naive-ui

### [template](/src/core/template/index.ts)

根据配置创建对应模板

- -g [xxx] 生成.gitignore模板, 默认node
- -e 生成.editorconfig模板
