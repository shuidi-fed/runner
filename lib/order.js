'use strict'

function checkCommand (order, installCommand) {
  let promptMessage = `It was detected that you did not install ${order}, this command requires you to pre-install ${order}.`

  promptMessage += (installCommand ? `Start automatic installation: ${order}:` : `Please re-run the command after installing ${order}.`)

  const tail = installCommand ? `${installCommand}; }` : `exit 1; }`

  const command = `hash ${order} 2>/dev/null || { echo >&2  "${promptMessage}"; ${tail}`

  exec(command)
}

function checkCommands (orders) {
  orders.forEach(checkCommand)
}

module.exports = {
  checkCommand,
  checkCommands
}
