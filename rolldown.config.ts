import { defineConfig } from 'rolldown'
import fs from 'fs'
import path from 'path'

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
				fs.cpSync(
					path.join(__dirname, 'package.json'),
					path.join(__dirname, 'dist', 'package.json')
				)
			}
		}
	]
})
