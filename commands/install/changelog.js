'use strict'

const orderLib = require('../../lib/order.js')
const wsLib = require('../../lib/workspace.js')

async function main () {
  orderLib.checkCommands(['git', 'yarn'])

  orderLib.checkCommand('commitizen', 'yarn global add commitizen')

  const WORK_SPACE = await wsLib.getAndGotoWorkSpace()
  const packageJsonContent = require(`${WORK_SPACE}/package.json`)
  const name = packageJsonContent.name

  if (!packageJsonContent.scripts) packageJsonContent.scripts = {}

  packageJsonContent.scripts.version = 'conventional-changelog -p angular -i CHANGELOG.md -s && git add CHANGELOG.md'

  exec(`echo '${JSON.stringify(packageJsonContent, null, 2)}' > ./package.json`)
  exec('yarn add -D conventional-changelog-cli')
  exec('commitizen init cz-conventional-changelog --yarn --dev --exact')

  log.info(`
    [PROJECT NAME]：${name} Successful installation!

    [NEW WORKFLOW] The workflow after the changelog is installed will change:

      step 1. Modify the code

      step 2. commit (using git cz instead of git commit, a template will appear for selection)

      step 3. git fetch to get the tags

      step 4. yarn version or npm run version:

        1. Tag (the default behavior of version)
        2. Call changelog to generate CHANGELOG.md in the project root directory

      step 5. git push --tags (submit local tag; not rebase, otherwise it will not be tag)

      step 6. git push (submit local code)
  `)
}

module.exports = main
