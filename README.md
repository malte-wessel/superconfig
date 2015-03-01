superconfig
=========

Lightweight config loader. Support for environmental loading, default config, nested keys.

[![Build Status](https://travis-ci.org/malte-wessel/superconfig.svg?branch=master)](https://travis-ci.org/malte-wessel/superconfig)

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
/...
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
    default: 'production'
});

````

Use your configuration variables
````javascript
var config = require('/config.js');

// Pass the whole database configuration
var database = new Database(config('database'));

// Use a single value
var user = config('database.user');
````
