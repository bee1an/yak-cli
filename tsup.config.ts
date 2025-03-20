import { defineConfig } from 'tsup'
import fs from 'fs'

export default defineConfig({
	entry: ['src/index.ts'],
	minify: true,
	treeshake: true,
	async onSuccess() {
		const pkgContent = fs.readFileSync('package.json')

		fs.writeFileSync('dist/package.json', pkgContent)
	}
})
