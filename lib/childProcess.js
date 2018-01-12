import childProcess from 'child_process';

/**
 * Promisified wrapper for child_process#exec
 * @param {string} command - it will be executes with `sh -c` prefix
 * @param {object} [options={}]
 * @returns {Promise.<{stdout: string, stderr: string}, Error>}
 * @see https://nodejs.org/dist/latest-v4.x/docs/api/child_process.html
 */
export function exec(command, options = {}) {
  const promise = new Promise((resolve, reject) => {
    console.log(`Executing "${command}"...`);
    childProcess.exec(command, options, (err, stdout, stderr) => {
      if (err) {
        reject(`${err.stack}\n\n${stderr}`);
        return;
      }

      resolve({ stdout, stderr });
    });
  });

  return promise.then((results) => {
    console.log(results.stdout);
    return results;
  });
}

/**
 * Promisified wrapper for child_process#spawn
 * @returns {Promise}
 * @see https://nodejs.org/dist/latest-v4.x/docs/api/child_process.html
 */
export function spawn(...args) {
  return new Promise((resolve, reject) => {
    console.log(`Spawning "${args[0]}"..`);
    const child = childProcess.spawn(...args);

    child.on('error', reject);

    child.on('exit', (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`Process returned non zero code ${code} after signal ${signal}`));
    });
  });
}
