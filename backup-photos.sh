#!/bin/bash

# author: john dimatteo
# created: 2022-04-20

usage() {                                 # Function: Print a help message.
  echo "Usage: $0 [ -t TARGET_FOLDER ] [ -s SOURCE_FOLDER ]" 1>&2 
}

exit_abnormal() {                         # Function: Exit with error.
  usage
  exit 1
}

while getopts ":s:t:" flag; do
    case "${flag}" in
        t) TARGET=${OPTARG};;
        s) SOURCE=${OPTARG};;
	:) exit_abnormal;;
	*) exit_abnormal;;
    esac
done
if [ -z "${SOURCE}" ] || [ -z "${TARGET}" ]; then
    exit_abnormal
fi
echo "Backing up files from: $SOURCE";
echo "To: $TARGET";


TODAY=$(date +'%m/%Y')
rsync -ar --no-relative --progress --files-from=<(find $SOURCE -newer $TARGET/last_sync -type f -exec basename {} \;) $SOURCE $TARGET/$TODAY
touch $TARGET/last_sync
