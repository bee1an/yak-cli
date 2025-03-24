import pc from 'picocolors'

interface LogOptions {
	type: 'loading' | 'success' | 'error' | 'warning'
}

const errorIcon = '❌'
const successIcon = '✅'
const loadingIcon = '☕️'
const warningIcon = '🔔'

function log(message: string, options?: LogOptions, ...optionalParams: any[]) {
	const { type } = options || {}

	let messageIcon = ''

	switch (type) {
		case 'loading':
			message = pc.cyan(message)
			messageIcon = loadingIcon + ' '
			break
		case 'success':
			message = pc.green(message)
			messageIcon = successIcon + ' '
			break
		case 'error':
			message = pc.red(message)
			messageIcon = errorIcon + ' '
			break
		case 'warning':
			message = pc.yellow(message)
			messageIcon = warningIcon + ' '
			break
	}

	console.log(messageIcon + message, ...optionalParams)
}

log.error = function (message: string, options?: LogOptions, ...optionalParams: any[]) {
	log.call(this, message, { ...options, type: 'error' }, ...optionalParams)
}
log.success = function (message: string, options?: LogOptions, ...optionalParams: any[]) {
	log.call(this, message, { ...options, type: 'success' }, ...optionalParams)
}
log.loading = function (message: string, options?: LogOptions, ...optionalParams: any[]) {
	log.call(this, message, { ...options, type: 'loading' }, ...optionalParams)
}
log.warning = function (message: string, options?: LogOptions, ...optionalParams: any[]) {
	log.call(this, message, { ...options, type: 'warning' }, ...optionalParams)
}

export default log
