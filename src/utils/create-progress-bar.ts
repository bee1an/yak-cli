export function createProgressBar(total: number, width = 30) {
	let lastUpdate = 0

	return (current: number) => {
		const now = Date.now()
		// 控制刷新频率（至少每 100ms 更新一次）
		if (now - lastUpdate < 100 && current !== total) return
		lastUpdate = now

		const percent = Math.round((current / total) * 100)
		const filled = Math.round(width * (current / total))
		const bar = '█'.repeat(filled) + '░'.repeat(width - filled)

		// 使用 \r 回车符覆盖当前行
		process.stdout.write(
			`\r${bar} ${percent}%` +
				` | progress: ${current}/${total}` +
				` ${current === total ? '\n' : ''}`
		)
	}
}
