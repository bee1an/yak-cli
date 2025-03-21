import fs from 'fs'
import path from 'path'
import readmePrefix from './prefix'

import { corePath, readmePath } from '../path'

fs.writeFileSync(readmePath, readmePrefix)

/**
 * 生成 README.md
 * 遍历 src/core 目录, 获取每个目录下的 index.ts 文件, 解析第一个注释, 生成 README.md
 */
fs.readdirSync(corePath).forEach((file) => {
	const cmd = path.join(corePath, file, 'index.ts')

	const content = fs.readFileSync(cmd).toString()

	const comment = content.match(/\/\*\*([\s\S]*?)\*\//)?.[0]

	if (!comment) return

	let descriptions = comment.split('\n').slice(1, -1)

	const cmdTitle = `\n### [${file}](/src/core/${file}/index.ts)\n\n`

	const cmdDes = descriptions.splice(0, 1)[0].replace(' * ', '') + '\n'

	descriptions = descriptions.map((des) => {
		return des.replace(' * ', '')
	})

	let codeSchema = false

	const detail = descriptions.reduce((pre, cur) => {
		const codeLine = cur.startsWith('```')

		codeLine && (codeSchema = !codeSchema)

		return pre + (codeSchema || codeLine ? '' : '- ') + cur + '\n'
	}, '\n')

	fs.appendFileSync(readmePath, cmdTitle + cmdDes + detail)
})
