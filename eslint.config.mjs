import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

/** @type {import('eslint').Linter.Config[]} */
export default defineConfig([
	{ files: ['**/*.{js,mjs,cjs,ts}'] },
	{ languageOptions: { globals: globals.node } },
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	{
		rules: {
			'@typescript-eslint/no-unused-vars': 1,
			'@typescript-eslint/no-unused-expressions': 0,
			'no-debugger': 0,
			'@typescript-eslint/no-explicit-any': 0
		}
	},
	globalIgnores(['node_modules', 'dist', '*.css', '*.jpg', '*.jpeg', '*.png', '*.gif', '*.d.ts'])
])
