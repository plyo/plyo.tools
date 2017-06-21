import { expect } from 'chai';
import logger from '../../lib/logger';

describe('Logger', () => {
  let writer;
  let errWriter;
  let log;
  let output = '';

  // restore process.stdout.write() and console.log() to their previous glory
  const cleanup = () => {
    process.stdout.write = writer;
    process.stderr.write = errWriter;
    console.log = log;
    output = '';
  };

  beforeEach(() => {
    // store these functions to restore later because we are messing with them
    writer = process.stdout.write;
    errWriter = process.stdout.write;
    log = console.log;

    // our stub will concatenate any output to a string
    process.stdout.write = process.stderr.write = console.log = (s) => {
      output += s;
    };
  });

  it('verbose should log with correct prefix and newline', () => {
    logger.verbose('foobar');
    expect(output).to.equal('verbose: foobar\n');
  });

  it('warn should log with correct prefix and newline', () => {
    logger.warn('foobar');
    expect(output).to.equal('warn: foobar\n');
  });

  it('error should log with correct prefix and newline', () => {
    logger.error('foobar');
    expect(output).to.equal('error: foobar\n');
  });

  it('info should log with correct prefix and newline', () => {
    logger.info('foobar');
    expect(output).to.equal('info: foobar\n');
  });

  afterEach(cleanup);
});
