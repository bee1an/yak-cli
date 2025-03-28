import { Command } from 'commander'

export interface OptionFlow {
	install: (program: Command) => void
	action: (...args: any[]) => void
}

export const useOptions = (cmd: Command) => {
	const optionFlows: OptionFlow[] = []

	const use = (...flows: OptionFlow[]) => {
		flows.forEach((flow) => {
			optionFlows.push(flow)
			flow.install(cmd)
		})
	}

	const action = () => {
		cmd.action((...opts) => {
			optionFlows.forEach((flow) => flow.action(...opts))
		})
	}

	return { use, action }
}
