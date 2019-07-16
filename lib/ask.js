const inquirer = require('inquirer')

function ask (questions) {
  return inquirer.prompt(questions)
}

module.exports = ask
