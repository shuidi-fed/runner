'use strict'

const ask = require('./ask.js')
const PWD = process.env.PWD

async function getAndGotoWorkSpace () {
  const name = 'WORK_SPACE'
  const type = 'input'
  const message = 'Please enter the project path \n' +
    '(The default is the current path: ' + PWD + '):'
  let { WORK_SPACE } = await ask([{ name, type, message }])

  if (!WORK_SPACE) WORK_SPACE = `${PWD}`

  exec(`cd ${WORK_SPACE}`)

  return WORK_SPACE
}

module.exports = { getAndGotoWorkSpace }