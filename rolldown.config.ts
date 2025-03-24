import { defineConfig } from 'rolldown'
import fs from 'fs'
import path from 'path'
import { srcPath } from './scripts/path'
import prettier from 'prettier'

export default defineConfig({
	input: 'src/index.js',
	output: {
		file: 'dist/index.js',
		format: 'cjs'
	},
	plugins: [
		{
			name: 'rolldown-plugin-remove',
			buildStart() {
				fs.rmSync(path.join(__dirname, 'dist'), { recursive: true, force: true })
			}
		},
		{
			name: 'rolldown-plugin-copy',
			async buildEnd() {
				fs.cpSync(path.join(__dirname, 'README.md'), path.join(__dirname, 'dist', 'README.md'))

				const content = fs.readFileSync(path.join(srcPath, 'version.ts'))
				const version = content.toString().match(/\d+\.\d+\.\d+/)![0]

				const pkgContent = JSON.parse(
					fs.readFileSync(path.join(__dirname, 'package.json')).toString()
				)

				pkgContent.version = version
				delete pkgContent.scripts

				fs.mkdirSync(path.join(__dirname, 'dist'), { recursive: true })
				const formatted = await prettier.format(JSON.stringify(pkgContent), {
					parser: 'json-stringify'
				})
				fs.writeFileSync(path.join(__dirname, 'dist', 'package.json'), formatted)
			}
		}
	]
})
