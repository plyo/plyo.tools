/**
 * @fileOverview
 *
 * here is the stub for logger, useful for isomorphic files
 */

/* eslint-disable no-console */

const timers = {};
let id = 0;

export default {
  /**
   * @param {string} level - one of error, warn, info or verbose
   * @param messages
   */
  log(level, ...messages) {
    this[level](...messages);
  },

  error: console.error.bind(console),
  warn: console.warn.bind(console),
  info: console.info.bind(console),
  verbose: console.log.bind(console),

  profile(label) {
    if (label in timers) {
      console.timeEnd(label);
      delete timers[label];
    } else {
      console.time(label);
      timers[label] = label;
    }
  },

  startTimer() {
    const timerId = `timer${id}`;
    console.time(timerId);
    id += 1;
    return {
      done(meta) {
        console.info(meta);
        console.timeEnd(timerId);
      },
    };
  },
};
