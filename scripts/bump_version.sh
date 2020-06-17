#!/usr/bin/env bash

##----------------------------------------------------------------------------##
## Imports                                                                    ##
##----------------------------------------------------------------------------##
source /usr/local/src/stdmatt/shellscript_utils/main.sh


##----------------------------------------------------------------------------##
## Variables                                                                  ##
##----------------------------------------------------------------------------##
SCRIPT_DIR="$(pw_get_script_dir)";
SRC_DIR="$(pw_abspath "${SCRIPT_DIR}/../src")";
SRC_FILE="${SRC_DIR}/Version.js";


##----------------------------------------------------------------------------##
## Script                                                                     ##
##----------------------------------------------------------------------------##
BUMP_THE_VERSION="$(pw_get_program_path "bump-the-version")";
if [ -z "$BUMP_THE_VERSION" ]; then
    pw_log_fatal "Coundn't find (bump-the-version) program - Aborting...";
fi;

"${BUMP_THE_VERSION}" "${SRC_FILE}" "const GAME_OF_LIFE_VERSION =" bump "$1";
