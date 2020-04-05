[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=tarlety_id_sentry_decrypt&branch=master&metric=bugs)](https://sonarcloud.io/dashboard?id=tarlety_id_sentry_decrypt)
[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=tarlety_id_sentry_decrypt&branch=master&metric=code_smells)](https://sonarcloud.io/dashboard?id=tarlety_id_sentry_decrypt)
[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=tarlety_id_sentry_decrypt&branch=master&metric=coverage)](https://sonarcloud.io/dashboard?id=tarlety_id_sentry_decrypt)
[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=tarlety_id_sentry_decrypt&branch=master&metric=duplicated_lines_density)](https://sonarcloud.io/dashboard?id=tarlety_id_sentry_decrypt)
[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=tarlety_id_sentry_decrypt&branch=master&metric=ncloc)](https://sonarcloud.io/dashboard?id=tarlety_id_sentry_decrypt)
[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=tarlety_id_sentry_decrypt&branch=master&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=tarlety_id_sentry_decrypt)
[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=tarlety_id_sentry_decrypt&branch=master&metric=alert_status)](https://sonarcloud.io/dashboard?id=tarlety_id_sentry_decrypt)
[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=tarlety_id_sentry_decrypt&branch=master&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=tarlety_id_sentry_decrypt)
[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=tarlety_id_sentry_decrypt&branch=master&metric=security_rating)](https://sonarcloud.io/dashboard?id=tarlety_id_sentry_decrypt)
[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=tarlety_id_sentry_decrypt&branch=master&metric=sqale_index)](https://sonarcloud.io/dashboard?id=tarlety_id_sentry_decrypt)
[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=tarlety_id_sentry_decrypt&branch=master&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=tarlety_id_sentry_decrypt)
[![Snyk Known Vulnerabilities](https://snyk.io/test/github/tarlety/id_sentry_decrypt/badge.svg)](https://snyk.io/test/github/tarlety/id_sentry_decrypt)

## Features

- Decrypt stores which is encrypted at app.getPath('userData').
- Decrypt and convert to csv and the "at" import xlsx format.
- Supported platforms: Linux, Windows.

## Getting started

- To develop: ```npm install && npm start```
- Quick start for development:
  ```
  $ export EIS_KEY='PLZIGNOREME'
  $ npm start -- 000-000-00
  ```
- To deploy: ```npm run package```
- Quick start for produciton test:
  ```
  $ set /p EIS_KEY=Input Encryption Key
  $ ./id-sentry-decrypt.AppImage . --node 000-000-00 --at_import_xlsx ./export.xlsx
  ```

## How to unhash hashed scan_value manually

Here is a sample csv file with hashed scan_value:

```csv
version,node_id,local_date,json_date,reader_type,scan_type,scan_value,hashed
1,"001-001-00","4/4/2020, 7:19:16 PM","2020-04-04T11:19:16.458Z","","invalid","s3c+E+gA7Efk1c8XaGT3LbWat5q97oeEfOl+vxuTv0c=",true
1,"001-001-00","4/4/2020, 7:19:19 PM","2020-04-04T11:19:19.235Z","","id","XdMgqoy9Pb8GTj3vVaEuO0akRBS5nw3ZNXc0j9sIfg0=",true
```

To unhash scan_value 'Xd...', concate 'node-id + previous hased scan_value + unhased scan_value', do sha256 then base64:

```bash
$ echo -n "001-001-00s3c+E+gA7Efk1c8XaGT3LbWat5q97oeEfOl+vxuTv0c=A1********" | openssl dgst -binary -sha256 | openssl base64 -A
```

If the output base64 is same as 'Xd...', then 'A1********' is the correct unhashed scan_value.

Notice that for first record, please use nonce instead of previous hashed scan_value.

