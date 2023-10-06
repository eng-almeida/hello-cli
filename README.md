oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![GitHub license](https://img.shields.io/github/license/oclif/hello-world)](https://github.com/oclif/hello-world/blob/main/LICENSE)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g survey
$ survey COMMAND
running command...
$ survey (--version)
survey/0.0.0 darwin-x64 node-v18.15.0
$ survey --help [COMMAND]
USAGE
  $ survey COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`survey hello PERSON`](#survey-hello-person)
* [`survey hello world`](#survey-hello-world)
* [`survey help [COMMANDS]`](#survey-help-commands)
* [`survey plugins`](#survey-plugins)
* [`survey plugins:install PLUGIN...`](#survey-pluginsinstall-plugin)
* [`survey plugins:inspect PLUGIN...`](#survey-pluginsinspect-plugin)
* [`survey plugins:install PLUGIN...`](#survey-pluginsinstall-plugin-1)
* [`survey plugins:link PLUGIN`](#survey-pluginslink-plugin)
* [`survey plugins:uninstall PLUGIN...`](#survey-pluginsuninstall-plugin)
* [`survey plugins:uninstall PLUGIN...`](#survey-pluginsuninstall-plugin-1)
* [`survey plugins:uninstall PLUGIN...`](#survey-pluginsuninstall-plugin-2)
* [`survey plugins update`](#survey-plugins-update)

## `survey hello PERSON`

Say hello

```
USAGE
  $ survey hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/Personal/survey/blob/v0.0.0/dist/commands/hello/index.ts)_

## `survey hello world`

Say hello world

```
USAGE
  $ survey hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ survey hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [dist/commands/hello/world.ts](https://github.com/Personal/survey/blob/v0.0.0/dist/commands/hello/world.ts)_

## `survey help [COMMANDS]`

Display help for survey.

```
USAGE
  $ survey help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for survey.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.20/src/commands/help.ts)_

## `survey plugins`

List installed plugins.

```
USAGE
  $ survey plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ survey plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.8.3/src/commands/plugins/index.ts)_

## `survey plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ survey plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ survey plugins add

EXAMPLES
  $ survey plugins:install myplugin 

  $ survey plugins:install https://github.com/someuser/someplugin

  $ survey plugins:install someuser/someplugin
```

## `survey plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ survey plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ survey plugins:inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.8.3/src/commands/plugins/inspect.ts)_

## `survey plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ survey plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ survey plugins add

EXAMPLES
  $ survey plugins:install myplugin 

  $ survey plugins:install https://github.com/someuser/someplugin

  $ survey plugins:install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.8.3/src/commands/plugins/install.ts)_

## `survey plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ survey plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ survey plugins:link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.8.3/src/commands/plugins/link.ts)_

## `survey plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ survey plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ survey plugins unlink
  $ survey plugins remove
```

## `survey plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ survey plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ survey plugins unlink
  $ survey plugins remove
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.8.3/src/commands/plugins/uninstall.ts)_

## `survey plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ survey plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ survey plugins unlink
  $ survey plugins remove
```

## `survey plugins update`

Update installed plugins.

```
USAGE
  $ survey plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.8.3/src/commands/plugins/update.ts)_
<!-- commandsstop -->
