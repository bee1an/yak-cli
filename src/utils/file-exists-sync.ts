import fs, { PathLike } from 'fs'

/**
 * @description: 判断文件或文件夹是否存在
 */
export function fileExistsSync(filePath: PathLike) {
	try {
		return fs.statSync(filePath)
	} catch {
		return false
	}
}
