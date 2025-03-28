import { execSync } from 'child_process'
import log from '../../../utils/log'
import { OptionFlow } from '../../../utils/use-options'

const optionFlow: OptionFlow = {
	install(program) {
		program.option('-i, --init', 'init terminalposh')
	},
	action(opts: { init: boolean }) {
		if (!opts.init) return

		execSync('yak terminalposh --prediction --install --prettier-wt --upgrade-pw --config pw', {
			stdio: 'inherit'
		})

		log.success('Now you have all the configurations')
		log.info('This command does not install fonts for you')
		log.info('If you need to solve the problem of garbled fonts, you can visit the link below')
		log.info('https://www.nerdfonts.com/font-downloads')
		log.info('Choose a font you like to download and install it')
		log.info('The last of the last, run:')
		log.info('yak terminalposh -c font --no-prediction')
	}
}

export default optionFlow
