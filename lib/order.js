const shell = require('shelljs')
const exec = shell.exec

function checkCommand (order) {
  exec(`hash ${order} 2>/dev/null || { echo >&2 "It was detected that you did not install ${order}, this command requires you to pre-install ${order}. Please re-run the command after installing ${order}."; exit 1; }`)
}

function checkCommands (orders) {
  orders.forEach(checkCommand)
}

module.exports = {
  checkCommand,
  checkCommands
}
