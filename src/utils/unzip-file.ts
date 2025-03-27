import AdmZip from 'adm-zip'
import fs from 'fs'

export async function unzipFile(zipPath: string, outputDir: string) {
	return new Promise<void>((resolve, reject) => {
		try {
			// 1. 加载压缩包
			const zip = new AdmZip(zipPath)

			// 2. 创建解压目录（如果不存在）
			if (!fs.existsSync(outputDir)) {
				fs.mkdirSync(outputDir, { recursive: true })
			}

			// 3. 解压全部文件（带进度回调）
			zip.extractAllToAsync(outputDir, true, false, (error) => {
				if (error) {
					reject(error)
					return
				}
				resolve()
			})
		} catch (error) {
			reject(error)
		}
	})
}
