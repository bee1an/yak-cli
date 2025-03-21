import { execSync } from 'child_process'

execSync('pnpm build')
execSync('npm publish')
