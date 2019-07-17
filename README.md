# sd-runner
A command line tool to ensure R&amp;D efficiency

[![NPM Version][npm-image]][npm-url]

## Installation

use `yarn` 

```bash
yarn global add sd-runner
```
or use `npm`

```bash
npm install -g sd-runner
```

## Documentation

```bash
➜  ~ run -h

Usage: index <command> [options]

Options:
  -v, --version            output the version number
  -h, --help               output usage information

Commands:
  release [taskOrderList]
      Release npm project. (prerequisites: git, yarn)
      eg: run release lint,ut,build.
      the default task order list is: lint,ut,build.

  install <type>
      Install the function for the project with the type parameter. (prerequisites: git, yarn)
      eg: run install changelog.
      The value range of the type parameter is: changelog.

  create-mysql [options]
      Create mysql database and tables for the development environment. (prerequisites: mysql)
      eg: run create-mysql -i 127.0.0.1 -p 3306 -u root -w root -d account.

      [Note] This command has the following expectations:
        1. your folder name where the sql script is stored must be "sql", eg: your_project/sql/.
        2. your create database file names to be prefixed with "createDb", eg: createDb.sql.
        3. your create table file names to be prefixed with "createTable", eg: createTableAccount.sql.
```

## quick start release package of NPM

```bash

cd your_project_path

run release
```

## quick start install changelog for your project

```bash

cd your_project_path

run install changelog
```

## quick start create mysql database and table for your project

```bash

cd your_project_path

run create-mysql
```

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/sd-runner.svg
[npm-url]: https://www.npmjs.com/package/sd-runner
