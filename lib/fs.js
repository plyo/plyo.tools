/**
 * @fileOverview
 *
 * Promisified version of some methods from node.js `fs` module
 */

import fs from 'fs';

/**
 * Reads file in utf8 encoding
 * @param {string} path
 * @returns {Promise.<string>}
 */
export function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, content) => (err ? reject(err) : resolve(content)));
  });
}

/**
 * Renames file
 * @param {string} oldPath
 * @param {string} newPath
 * @returns {Promise}
 */
export function rename(oldPath, newPath) {
  return new Promise((resolve, reject) => {
    fs.rename(oldPath, newPath, err => (err ? reject(err) : resolve()));
  });
}

/**
 * Writes file in utf8 encoding
 * @param {string} path
 * @param {string} content
 * @returns {Promise}
 */
export function writeFile(path, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, content, 'utf8', err => (err ? reject(err) : resolve()));
  });
}

/**
 * Checks a file exists and we have read access for it
 * @param {string} path
 * @returns {Promise.<boolean>}
 */
export function readAccess(path) {
  return new Promise((resolve) => {
    fs.access(path, fs.R_OK, (err) => {
      if (err) {
        console.log(`File ${path} does not exist, going ahead without it`);
        resolve(false);
        return;
      }

      resolve(true);
    });
  });
}

/**
 * Get file's stat
 * @param {string} path
 * @returns {Promise.<fs.Stats>}
 */
export function stat(path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, fileStat) => (err ? reject(err) : resolve(fileStat)));
  });
}

/**
 * Removes file
 * @param {string} path
 * @returns {Promise}
 */
export function unlink(path) {
  return new Promise((resolve, reject) => {
    fs.unlink(path, err => (err ? reject(err) : resolve()));
  });
}
