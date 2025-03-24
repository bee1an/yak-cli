import path from 'path'
import { fileExistsSync } from './file-exists-sync'

export function isMonorepo(execPath: string) {
	return !!fileExistsSync(path.join(execPath, 'pnpm-workspace.yaml'))
}
