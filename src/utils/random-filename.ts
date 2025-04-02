import { uid } from 'uid'
import { fileExistsSync } from './file-exists-sync'

export default function randomFilename(extension: string, prefix: string = ''): string {
	const filename = `${prefix && prefix + '-'}${uid(6)}.${extension}`

	return fileExistsSync(filename) ? randomFilename(extension, prefix) : filename
}
