'use strict'

const ask = require('./ask.js')
const shell = require('./shell.js')
const PWD = process.env.PWD

async function getAndGotoWorkSpace (suffix = '') {
  const name = 'WORK_SPACE'
  const type = 'input'
  const message = 'Please enter the project path \n' +
    '(The default is the current path: ' + PWD + '):'
  let { WORK_SPACE } = await ask([{ name, type, message }])

  if (!WORK_SPACE) WORK_SPACE = `${PWD}`

  shell.mountFixedCWDExecToGlobal(WORK_SPACE)

  return WORK_SPACE + suffix
}

module.exports = { getAndGotoWorkSpace }
