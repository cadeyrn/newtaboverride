'use strict';

const PERMISSION_FEED = { origins : ['https://www.soeren-hentzschel.at/*'] };

// a not very advanced regex to match most URLs…
const URI_REGEX = /^(https?|moz-extension):\/\//i;

// general protocol check
const PROTOCOL_REGEX = /^(.*):\/\//i;
