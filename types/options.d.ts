import { Teamity, TeamityPluginOptions, Route } from 'teamity'

export class AutoloadOptions extends TeamityPluginOptions {
  dir: string
  dirAsScope?: boolean
  ignorePattern?: RegExp
  indexPattern?: RegExp
  maxDepth?: number
}

export type TeamityAutoloadRoute = (route: Route<Teamity>) => Route<Teamity>

export type TeamityAutoload = {
  (teamity: Teamity, opts: AutoloadOptions): Promise<void>
  route: TeamityAutoloadRoute
}
