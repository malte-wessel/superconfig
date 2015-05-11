/* global process */
'use strict';

import merge from 'lodash.merge';
import clonedeep from 'lodash.clonedeep';
import isArray from 'lodash.isarray';
import requireAll from 'require-all';
import { resolve } from 'path';

let filter = /(.*)\.js|.json$/;

function notfound(key) {
	return new Error(`Key ${key} not found.`);
}

export default function superconfig(options = {}) {
	let { path, env, denv } = options;

	if(!path) throw new Error('You need to provide a path to your config directory');
	env = env || process.env.NODE_ENV || 'development';
	denv = denv || 'production';

	// Load default config
	let config = requireAll({
		dirname: resolve(path, denv),
		filter: filter
	});

	// Load environmental config
	if (options.env !== options.default) {
		let override = requireAll({
			dirname: resolve(path, env),
			filter: filter
		});

		// Merge with defaults, do not merge arrays.
		merge(config, override, (a, b) => isArray(a) ? b : undefined);
	}

	// Return getter function
	return function get(key) {
		if(key === 'env') return options.env;

		let result;

		try {
			result = key.split('.').reduce((obj, i) => obj[i], config);
		} catch(e) {
			throw notfound(key);
		}

		if(result === undefined) throw notfound(key);	

		return clonedeep(result);
	};
}