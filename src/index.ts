import { program } from 'commander'

import template from './core/template'
import prettier from './core/prettier'
import commitnorm from './core/commitnorm'
import { version } from './version'

export const name = 'yak'

export const description = 'Some boring scripts'

const commands = [template, prettier, commitnorm]

program.name(name).description(description).version(version)

commands.forEach((cmd) => cmd(program))

program.parse()
