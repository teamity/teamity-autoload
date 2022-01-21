const { readdir } = require('fs').promises
const path = require('path')

const defaults = {
  scriptPattern: /((^.?|\.[^d]|[^.]d|[^.][^d])\.ts|\.js|\.cjs|\.mjs)$/i,
  indexPattern: /^index(\.ts|\.js|\.cjs|\.mjs)$/i,
  dirAsScope: true,
  prefix: ''
}

async function loadDirents (teamity, dir, depth, opts) {
  const {
    scriptPattern,
    indexPattern,
    ignorePattern,
    maxDepth,
    dirAsScope,
    prefix
  } = opts

  const {
    $options: {
      router: { separator }
    }
  } = teamity
  const dirents = await readdir(dir, { withFileTypes: true })

  const indexDirent = dirents.find(dirent => indexPattern.test(dirent.name))
  if (indexDirent) {
    const file = path.join(dir, indexDirent.name)
    teamity.register(require(file))
    return
  }

  for (const dirent of dirents) {
    const { name } = dirent

    if (ignorePattern && name.match(ignorePattern)) {
      continue
    }

    const isMaxDepth = Number.isFinite(maxDepth) && maxDepth <= depth
    const childDir = path.join(dir, name)

    if (dirent.isDirectory() && !isMaxDepth) {
      const childPrefix = depth === 0 ? `${prefix}${separator}${name}` : name

      if (dirAsScope === true) {
        teamity.register(
          async ins => {
            // recursion
            await loadDirents(ins, childDir, depth + 1, opts)
          },
          {
            name: dirent.name,
            prefix: childPrefix
          }
        )
      } else {
        // recursion
        await loadDirents(teamity, childDir, depth + 1, opts)
      }
    }

    if (dirent.isFile() && scriptPattern.test(name)) {
      const fileModule = require(childDir)
      if (fileModule.$autoload === true) {
        fileModule.url = name.replace(path.extname(name), '')
        teamity.route(fileModule)
      } else {
        const childOpts = {}
        if (depth === 0) {
          childOpts.name = name
          childOpts.prefix = prefix
        }
        teamity.register(require(childDir), childOpts)
      }
    }
  }
}

module.exports = async function (teamity, options) {
  const opts = { ...defaults, ...options }

  const {
    $options: {
      router: { separator }
    }
  } = teamity

  teamity.addHook('onRoute', function (route) {
    if (route.$autoload === true) {
      const match = `${separator}_`
      const replace = `${separator}:`
      while (route.url.indexOf(match) >= 0) {
        route.url = route.url.replace(match, replace)
      }
    }
  })

  await loadDirents(teamity, opts.dir, 0, opts)
}

module.exports.route = function (route) {
  route.$autoload = true
  return route
}
