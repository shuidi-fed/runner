'use strict'

const execa = require('execa')

const execSync = (command, options = {}) => {
  let result = {}
  const buildResult = res => ({ code: res.exitCode, stdout: res.stdout, stderr: res.stderr })

  try {
    result = execa.commandSync(command, options)
    return buildResult(result)
  } catch (err) {
    return buildResult(err)
  }
}

const genFixedCWDExecSync = cwd => {
  return (command, options = {}) => {
    if (!options.cwd) options.cwd = cwd
    return execSync(command, options)
  }
}

const mountFixedCWDExecToGlobal = cwd => {
  global.fixedCWDExecSync = genFixedCWDExecSync(cwd)
}

module.exports = {
  execSync,
  genFixedCWDExecSync,
  mountFixedCWDExecToGlobal
}
