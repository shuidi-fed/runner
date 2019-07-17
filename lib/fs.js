'use strict'

const fs = require('fs')
const util = require('util')
const readdir = util.promisify(fs.readdir)
const readFile = util.promisify(fs.readFile)

module.exports = {
  readdir,
  readFile
}
