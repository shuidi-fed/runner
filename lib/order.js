'use strict'

function checkCommand (order, installCommand) {
  let promptMessage = `
    It was detected that you did not install ${order},
    this command requires you to pre-install ${order}.
  `

  promptMessage += (
    installCommand
      ? `Start automatic installation: ${order}:`
      : `Please re-run the command after installing ${order}.`
  )

  const existsResult = execSync(`hash ${order}`)

  if (!existsResult.code) return existsResult.stdout

  log.error(promptMessage)

  if (installCommand) {
    const installResult = execSync(installCommand)

    if (installResult.code) {
      log.error(
        `exec: ${installCommand} failed. ERROR:${installResult.stderr}`
      )
    }
  }
}

function checkCommands (orders) {
  orders.forEach(checkCommand)
}

module.exports = {
  checkCommand,
  checkCommands
}
