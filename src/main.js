'use strict';
const { app } = require('electron');
const path = require('path');
const fs = require('fs');
const Store = require('electron-store');

const node_id = process.env.EIS_NODE_ID || process.argv[2] || '000-000-00';
const encryptionKey = process.env.EIS_KEY || 'PLZIGNOREME';

const data_dec = new Store({
  name: `decrypted_id-sentry-data_${node_id}`,
});
const enc_fn_prefix = `id-sentry-data_${node_id}`;

function default_enc_fns() {
  const userPath = app.getPath('userData');
  if (!fs.existsSync(userPath)) {
    return [];
  }

  const fns = fs.readdirSync(userPath);
  let fns_filtered = [];

  fns.forEach((fn) => {
    const pathname = path.join(userPath, fn);
    const stat = fs.lstatSync(pathname);
    if (!stat.isDirectory() && fn.indexOf(enc_fn_prefix) == 0) {
      fns_filtered = [fn, ...fns_filtered];
    }
  });
  return fns_filtered;
}

const enc_fns =
  process.argv.length >= 3 ? process.argv.slice(3) : default_enc_fns();

enc_fns.forEach((enc_fn) => {
  const name = path.parse(enc_fn).name;

  const data_enc = new Store({
    name,
    encryptionKey,
  });

  const records = data_enc.get('records');
  data_dec.set(name, records);
});

app.quit();
