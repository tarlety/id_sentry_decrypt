'use strict';

function json2csv(items) {
  const replacer = (key, value) => (value === null ? '' : value); // specify how you want to handle null values here
  const header = Object.keys(items[0]);
  let csv = items.map((row) =>
    header
      .map((fieldName) => JSON.stringify(row[fieldName], replacer))
      .join(',')
  );
  csv.unshift(header.join(','));
  csv = csv.join('\r\n');
  return csv;
}

function json2at_import_csv(items) {
  const replacer = (key, value) => (value === null ? '' : value); // specify how you want to handle null values here
  const header = ['scan_value', 'json_date', '', '', ''];
  let csv = items.map((row) =>
    header
      .map((fieldName) => {
        switch (fieldName) {
          case 'scan_value':
            return JSON.stringify(row[fieldName], replacer);
          case 'json_date':
            const dt = new Date(row[fieldName]);
            return `${dt.getFullYear()}${(dt.getMonth() + 1)
              .toString()
              .padStart(2, '0')}${dt
              .getDate()
              .toString()
              .padStart(2, '0')}${dt
              .getHours()
              .toString()
              .padStart(2, '0')}${dt.getMinutes().toString().padStart(2, '0')}`;
          default:
            return '';
        }
      })
      .join(',')
  );
  const at_import_csv_header = [
    '外觀卡號',
    '簽到時間',
    '簽退時間',
    '領物時間',
    '領餐時間',
  ];
  csv.unshift(at_import_csv_header.join(','));
  csv = csv.join('\r\n');
  return csv;
}

module.exports = { json2csv, json2at_import_csv };
