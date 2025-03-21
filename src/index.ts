import { program } from 'commander'

import template from './core/template'
import commitnorm from './core/commitnorm'

export const name = 'yak'

export const description = 'Some boring scripts'

export const version = '1.0.0'

const commands = [template, commitnorm]

program.name(name).description(description).version(version)

commands.forEach((cmd) => cmd(program))

program.parse()
