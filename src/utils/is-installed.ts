import { execSync } from 'child_process'

export function isInstalled(packageId: string) {
	try {
		execSync(`winget list --exact --id ${packageId}`, { stdio: 'ignore' })
		return true
	} catch {
		return false
	}
}
