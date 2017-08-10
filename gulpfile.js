'use strict';

const gulp = require('gulp');
const gulpEslint = require('gulp-eslint');

gulp.task('lint-js', () => gulp.src(['gulpfile.js', './src/js/*.js'])
  .pipe(gulpEslint({ configFile : '.eslintrc.json' }))
  .pipe(gulpEslint.format())
);
