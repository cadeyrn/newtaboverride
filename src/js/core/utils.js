'use strict';

const PERMISSION_FEED = { origins : ['https://www.soeren-hentzschel.at/*'] };
const PERMISSION_HOMEPAGE = { permissions: ['browserSettings'] };

// a not very advanced regex to match most URLs…
const URI_REGEX = /^https?:\/\//i;
