'use strict';
const { app } = require('electron');
const commandLineArgs = require('command-line-args');
const path = require('path');
const fs = require('fs');
const Store = require('electron-store');
const { json2csv, json2at_import_csv } = require('./json2csv');
const csvParser = require('csv-parse/lib/sync');
const xlsx = require('xlsx');

try {
  const optionDefinitions = [
    { name: 'node', type: String },
    { name: 'encrypted', type: String, multiple: true },
    { name: 'csv', type: String },
    { name: 'at_import_xlsx', type: String },
  ];

  const options = commandLineArgs(optionDefinitions);
  console.log(options);

  const node_id = process.env.EIS_NODE_ID || options.node || '000-000-00';
  const encryptionKey = process.env.EIS_KEY || 'PLZIGNOREME';

  const enc_fn_prefix = `id-sentry-data_${node_id}`;

  function default_enc_fns() {
    const userPath = app.getPath('userData');
    if (!fs.existsSync(userPath)) {
      console.log('No user data found.');
      return [];
    }

    const fns = fs.readdirSync(userPath);
    let fns_filtered = [];

    fns.forEach((fn) => {
      const pathname = path.join(userPath, fn);
      const stat = fs.lstatSync(pathname);
      if (!stat.isDirectory() && fn.indexOf(enc_fn_prefix) == 0) {
        fns_filtered = [...fns_filtered, fn];
      }
    });

    console.log('Files to be processing:');
    console.log(fns_filtered);
    return fns_filtered;
  }

  const enc_fns = options.encrypted || default_enc_fns();

  let overall_records = [];

  enc_fns.forEach((enc_fn) => {
    const name = path.parse(enc_fn).name;

    try {
      const data_enc = new Store({
        name,
        encryptionKey,
      });
      const records = data_enc.get('records');
      overall_records = [...overall_records, ...records];
    } catch (e) {
      console.log('processing encrypted error, please check your EIS_KEY.');
      process.exit(1);
    }
  });

  if (overall_records.length > 0) {
    const name_dec = `decrypted_${node_id}`;
    try {
      if (options.at_import_xlsx) {
        const csv = json2at_import_csv(overall_records);
        const xlsx_pathname = options.at_import_xlsx;
        console.log(
          `decrypted to csv as at_import_xlsx format: ${xlsx_pathname}`
        );

        const csvOptions = {
          columns: true,
          delimiter: ',',
          ltrim: true,
          rtrim: true,
        };
        const records = csvParser(csv, csvOptions);

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(records);
        xlsx.utils.book_append_sheet(wb, ws);
        xlsx.writeFile(wb, xlsx_pathname);
      }
    } catch (e) {
      console.log(`converting at_import_xlsx error: ${e}`);
    }

    try {
      if (options.csv) {
        const csv = json2csv(overall_records);
        const csv_pathname = options.csv;
        console.log(`decrypted to csv: ${csv_pathname}`);
        fs.writeFileSync(csv_pathname, csv, { encoding: 'utf8', flag: 'w' });
      }
    } catch (e) {
      console.log(`converting csv error: ${e}`);
    }
  }
} catch (e) {
  console.log(`General app error: ${e}`);
  process.exit(1);
}

app.quit();
