import { AutoloadOptions, TeamityAutoload } from './types/options'

declare const autoload: TeamityAutoload

export = autoload

declare module 'teamity' {
  interface Teamity {
    register(autoload: TeamityAutoload, options: AutoloadOptions): Teamity
  }
}
