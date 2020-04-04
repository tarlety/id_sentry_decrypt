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

module.exports = { json2csv };
