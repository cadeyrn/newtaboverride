'use strict';

const gulp = require('gulp');
const gulpEslint = require('gulp-eslint');
const gulpStylelint = require('gulp-stylelint');

gulp.task('lint-js', () => gulp.src(['gulpfile.js', './src/js/*.js'])
  .pipe(gulpEslint({ configFile : '.eslintrc.json' }))
  .pipe(gulpEslint.format())
);

gulp.task('lint-css', () => gulp.src(['./src/css/*.css'])
  .pipe(gulpStylelint({
    failAfterError : false,
    reporters : [
      {
        formatter : 'string',
        console : true
      }
    ]
  }))
);
