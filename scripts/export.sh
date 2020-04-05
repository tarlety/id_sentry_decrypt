#!/bin/bash

Ttag=`date +%Y%m%d%H%M`
name="$(hostname)_${Ttag}"

echo -n Scan PASSKEY:
read -s EIS_KEY
EIS_KEY=${EIS_KEY} ./id_sentry_decrypt . --node 001-001-00 --at_import_xlsx "$(pwd)/${name}.xlsx" --csv "$(pwd)/${name}.csv"

if [ $? -eq 0 ]
then
  exportdir="$(pwd)/exported/$(hostname)"
  mkdir -p "${exportdir}"
  mv ~/.config/ElectronIDSentry/id-sentry-data_* "${exportdir}"
fi
