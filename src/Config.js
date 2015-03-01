'use strict';

import merge from 'lodash.merge';
import clonedeep from 'lodash.clonedeep';
import isArray from 'lodash.isarray';
import requireAll from 'require-all';
import path from 'path';

let filter = /(.*)\.js|.json$/;

/**
 * Returns a Not Found error
 * @param  {string} key Key path
 * @return {error}
 */
function notfound(key) {
	return new Error(`Key ${key} not found.`);
}

/**
 * 
 */
export default class Config {

	/**
	 * [constructor description]
	 * @param  {[type]} options [description]
	 * @return {[type]}         [description]
	 */
	constructor(options) {
		this.options = options;
		// Load config files
		this.load(options);
		// Return getter function
		return this.get.bind(this);
	}

	/**
	 * [load description]
	 * @param  {[type]} options [description]
	 * @return {[type]}         [description]
	 */
	load(options) {
		// Load default config
		let config = requireAll({
			dirname: path.join(options.path, options.default),
			filter: filter
		});

		// Load environmental config
		if (options.env !== options.default) {
			let override = requireAll({
				dirname: path.join(options.path, options.env),
				filter: filter
			});

			// Merge with defaults, do not merge arrays.
			merge(config, override, (a, b) => isArray(a) ? b : undefined);
		}

		// Store config
		this._config = config;
	}

	/**
	 * [get description]
	 * @param  {[type]} key [description]
	 * @return {[type]}     [description]
	 */
	get(key) {
		let result;

		try {
			result = key.split('.').reduce((obj, i) => obj[i], this._config);
		} catch(e) {
			throw notfound(key);
		}

		if(result === undefined) throw notfound(key);	

		return clonedeep(result);
	}

}