import { defineConfig } from 'rolldown'
import fs from 'fs'
import path from 'path'
import { srcPath } from './scripts/path'

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
			buildEnd() {
				fs.cpSync(path.join(__dirname, 'README.md'), path.join(__dirname, 'dist', 'README.md'))

				const content = fs.readFileSync(path.join(srcPath, 'version.ts'))

				const version = content.toString().match(/\d+\.\d+\.\d+/)![0]

				let pkgContent = fs.readFileSync(path.join(__dirname, 'package.json')).toString()

				pkgContent = pkgContent.replace(/"version": "\d+\.\d+\.\d+"/, `"version": "${version}"`)

				fs.mkdirSync(path.join(__dirname, 'dist'), { recursive: true })
				fs.writeFileSync(path.join(__dirname, 'dist', 'package.json'), pkgContent)
			}
		}
	]
})
