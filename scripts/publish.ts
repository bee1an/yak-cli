import { exec, cd } from 'shelljs'

exec('pnpm install --frozen-lockfile')
exec('pnpm build')

cd('./dist')
exec('npm publish')
