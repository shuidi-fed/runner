'use strict'

function getLastestVersionNumberByCurrentPackage (name) {
  return new Promise((resolve, reject) => {
    const order = `npm view ${name} version`
    const versionResult = fixedCWDExecSync(order)

    if (!versionResult.code) return resolve(versionResult.stdout)
    if (versionResult.stderr.includes('E404')) return resolve('0.0.0')

    return reject(new Error(versionResult.stderr))
  })
}

function setCurrentVersion (name, versionNumber) {
  fixedCWDExecSync(`npm dist-tag add ${name}@${versionNumber} latest`)
}

module.exports = {
  getLastestVersionNumberByCurrentPackage,
  setCurrentVersion
}
