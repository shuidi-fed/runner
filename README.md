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
Usage: run <command> [options]

Options:
  -v, --version            output the version number
  -h, --help               output usage information

Commands:
  release [taskOrderList]
      release npm project. (prerequisites: git, yarn)
      eg: run release lint,ut,build.
      the default task order list is: lint,ut,build.
```

## Quick Start

```bash

cd your_project_path

run release
```

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/sd-runner.svg
[npm-url]: https://www.npmjs.com/package/sd-runner
