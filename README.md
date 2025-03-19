# 一些无聊的自动化脚本

未发布到 npm, clone 这个仓库, 然后 `pnpm link -g`, 然后就可以使用了

### [commitize](/src/cmd/commitize/index.js)

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

### [gitignore](/src/cmd/gitignore/index.js)

yak-gitignore

- 创建一个基于node的项目的gitignore文件
- gitignore模板来自gitee
- 执行文件夹不是一个git仓库时，会自动初始化一个git仓库
