/* global __dirname */
'use strict';

import superconfig from './../src';
import test from 'tape';

let p = superconfig({
	path: __dirname + '/config',
	env: 'production',
	default: 'production'
});

let d = superconfig({
	path: __dirname + '/config',
	env: 'development',
	default: 'production'
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