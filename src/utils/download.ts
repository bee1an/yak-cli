import axios from 'axios'
import fs from 'fs'
import { fileExistsSync } from './file-exists-sync'

export async function downloadZip(
	url: string,
	outputPath: string,
	hooks?: {
		onProgress?: (progress: number) => void
		onComplete?: () => void
		onError?: (error: any) => void
	}
) {
	try {
		const response = await axios({ url, responseType: 'stream' })
		const writer = fs.createWriteStream(outputPath)

		// 进度跟踪
		let receivedBytes = 0
		const totalBytes = parseInt(response.headers['content-length'], 10)
		response.data.on('data', (chunk: any) => {
			receivedBytes += chunk.length
			const percent = ((receivedBytes / totalBytes) * 100).toFixed(2)
			hooks?.onProgress?.(parseFloat(percent))
		})

		// 管道传输
		response.data.pipe(writer)

		await new Promise<void>((resolve, reject) => {
			writer.on('finish', resolve)
			writer.on('error', reject)
		})

		hooks?.onComplete?.()
	} catch (err) {
		// 删除文件
		hooks?.onError?.(err)
		fileExistsSync(outputPath) && fs.unlinkSync(outputPath)
	}
}

// 使用示例
