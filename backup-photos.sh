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

if [ ! -f $TARGET/.newest ]
then
  echo "Fetching latest file..."
  # get newest file in TARGET directory
  NEWEST=$(find $TARGET -type f -not -path '*/.*' -printf '%TY %Tm%Td%TH%TM %p\n' |sort -nr |head -n 1 | cut -d' ' -f2)
  # create a new empty file with the same time as the newest
  touch -d "$NEWEST" $TARGET/.newest
  echo "Latest file cached."
fi  


TARGET=$(echo $TARGET | sed 's:/*$::')
SOURCE=$(echo $SOURCE | sed 's:/*$::')
TODAY=$(date +'%m-%Y')
mkdir -p $TARGET/$TODAY
rsync -ar --no-relative --progress --files-from=<(find $SOURCE -newer $TARGET/.newest -type f -exec realpath --relative-to=$SOURCE '{}' \;) $SOURCE $TARGET/$TODAY
touch $TARGET/.last_sync

if [ ! -z "$(ls -A $TARGET/$TODAY)" ]; then
  # get newest file in TARGET directory
  NEWEST_TODAY_FILE=$(find $TARGET/$TODAY -type f -not -path '*/.*' -printf '%TY %Tm%Td%TH%TM %p\n' |sort -nr |head -n 1 | cut -d' ' -f3)
  NEWEST_TODAY_DATE=$(find $TARGET/$TODAY -type f -not -path '*/.*' -printf '%TY %Tm%Td%TH%TM %p\n' |sort -nr |head -n 1 | cut -d' ' -f2)
  [[ $NEWEST_TODAY_FILE -nt $TARGET/.newest ]] && touch -d "$NEWEST_TODAY_DATE" $TARGET/.newest
fi

