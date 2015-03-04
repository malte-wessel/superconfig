/* global __dirname */
'use strict';

import superconfig from './../src';
import test from 'tape';

let p = superconfig({
	path: __dirname + '/config',
	env: 'production',
	denv: 'production'
});

let d = superconfig({
	path: __dirname + '/config',
	env: 'development',
	denv: 'production'
});

test('Throw error when key undefined', (t) => {
	t.throws(() => d('notfound'), 'Key notfound not found.', 'Should throw when key undefined');
	t.throws(() => d('not.found'), 'Key not.found not found.', 'Should throw when nested key undefined');
	t.end();
});

test('Get config object', (t) => {
	t.deepEqual(p('foo'), {foo: 'bar'}, 'Should equals config object');
	t.end();
});

test('Get config value', (t) => {
	t.ok(p('foo.foo') === 'bar', 'Should equals config value');
	t.end();
});

test('Get nested config value', (t) => {
	t.ok(p('nested.bar.foo') === 'bar', 'Should equal nested config value');
	t.end();
});

test('Get actual env', (t) => {
	t.ok(d('env') === 'development', 'Should equal env');
	t.end();
});

test('Config is immutable', (t) => {
	let obj = p('foo');
	obj.foo = 'mutated';
	t.deepEqual(p('foo'), {foo: 'bar'}, 'Should not be mutated');
	t.end();
});

test('Default config', (t) => {
	t.ok(d('foo.foo') === 'bar', 'Should assigns default values');
	t.end();
});

test('Overrides default config', (t) => {
	t.ok(d('bar.bar') === 'override', 'Should equal development config');
	t.deepEqual(d('bar.arr'), ['d', 'e'], 'Should equal development config');
	t.end();
});

test('Validate options', (t) => {
	let a = superconfig({path: __dirname + '/config'});
	t.throws(superconfig, /You need to provide a path to your config directory/, 'Should throw if no path options was defined');
	t.ok(a('foo.foo') === 'bar', 'Should use `production` as default env when not provided');
	t.ok(a('bar.bar') === 'override', 'Should use `development` when env not provided');
	t.end();
});