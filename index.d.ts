import { Teamity } from 'teamity'

import { AutoloadOptions, TeamityAutoload } from './types/options'

declare const autoload: TeamityAutoload

export = autoload

declare module 'teamity' {
  interface TeamityPlugin {
    (plugin: TeamityAutoload, opts: AutoloadOptions): Teamity
  }
}
