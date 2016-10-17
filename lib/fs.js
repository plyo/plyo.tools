import fs from 'fs';

export function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, content) => (err ? reject(err) : resolve(content)));
  });
}

export function rename(oldPath, newPath) {
  return new Promise((resolve, reject) => {
    fs.rename(oldPath, newPath, err => (err ? reject(err) : resolve()));
  });
}
