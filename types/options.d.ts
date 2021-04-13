import { Teamity, PluginOptions, Route } from 'teamity'

export class AutoloadOptions extends PluginOptions {
  dir: string
  dirAsScope?: boolean
  ignorePattern?: RegExp
  indexPattern?: RegExp
  maxDepth?: number
}

export type TeamityAutoloadRoute = (route: Route) => Route

export type TeamityAutoload = {
  (teamity: Teamity, opts: AutoloadOptions): Promise<void>
  route: TeamityAutoloadRoute
}
