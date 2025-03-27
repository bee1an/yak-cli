import { program } from 'commander'

import prettier from './core/prettier'
import commitnorm from './core/commitnorm'
import template from './core/template'
import terminalposh from './core/terminalposh'
import { version } from './version'

export const name = 'yak'

export const description = 'Some boring scripts'

const commands = [prettier, commitnorm, template, terminalposh]

program.name(name).description(description).version(version)

commands.forEach((cmd) => cmd(program))

program.parse()
