'use strict';

const gulp = require('gulp');
const gulpEslint = require('gulp-eslint');
const gulpHtmllint = require('gulp-htmllint');
const gulpStylelint = require('gulp-stylelint');
const jsdoc = require('gulp-jsdoc3');

gulp.task('lint-html', () => gulp.src(['./src/html/*.html'])
  .pipe(gulpHtmllint({ config : '.htmllintrc.json' }))
);

gulp.task('lint-js', () => gulp.src(['gulpfile.js', './src/js/**/*.js'])
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

const jsdocsConfig = require('./jsdoc.json');
gulp.task('docs', () => gulp.src(['CHANGELOG.md', 'README.md', './src/js/*.js'], { read : false })
  .pipe(jsdoc(jsdocsConfig))
);
