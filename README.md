superconfig
=========

Lightweight config loader.

[![Travis](https://img.shields.io/travis/malte-wessel/superconfig.svg?style=flat-square)](https://travis-ci.org/malte-wessel/superconfig)
[![David](https://img.shields.io/david/malte-wessel/superconfig.svg?style=flat-square)]()
[![NPM](https://img.shields.io/badge/npm-superconfig-brightgreen.svg?style=flat-square)]()


## Install

````
npm install superconfig --save
````

## Introduction

In big applications you have to deal with a lot of configuration variables. There are plenty of configuration modules out there that expect you to only have one configuration file for each environment. However, when your application grows you may want to encapsulate your variables in separate files in order to keep things overseeable. For example one file for your databases, one file for your server setup and so on. You probably also have some variables that doesn't change throughout your environments. If you only have one file for each environment you need to define every variable for each environment - even if they do not differ.

**superconfig let's you...**
* define your configuration variables in *separate files*
* have *separate directories* for your environments
* have a *default set of variables* that can be overriden by variables of your actual environment

## Usage
Your config directory may look like this:
````
/config
    /production
        database.js
        server.js
    /development
        database.js
````

Set up superconfig in a separate file
````javascript
// config.js
var superconfig = require('superconfig');

module.exports = superconfig({

    // Path to the config directory
    path: '/config',
    
    // The actual environment
    env: process.env.NODE_ENV,
    
    // The default environment,
    // these variables will be extended with those of the actual environment
    denv: 'production'
});

````

Use your configuration variables
````javascript
var config = require('/config.js');

// Pass the whole database configuration
var database = new Database(config('database'));

// Use a single value
var user = config('database.user');

// If you are working in the development environment
// superconfig will use the server configuration of your
// production environment, since we didn't provide one
// for the development environment
server.listen(config('server.port'));
````

### Nested directories/variables

You can work with nested directories:
````
/config
    /production
        /database
            mysql.js
            sqllite.js
````

Access your variables like:
````javascript
var user = config('database.mysql.user');
````

## API

### `superconfig(options)`
#### Params
* `options` {Object}
    * `options.path` {String} Path to your config directory
    * `options.env` {String} The actual environment
    * `options.denv` {String} Your default environment

* Returns
    * {Function} Invoking superconfig() returns a getter function, that let's you access your variables
    * The function takes a path to your variable e.g. `database.user`
