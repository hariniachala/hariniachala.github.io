//gulpfile.js

var gulp = require('gulp');
var gutil = require('gulp-util');
var clean = require('gulp-clean-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var ngAnnotate = require('gulp-ng-annotate');
var minifyCSS = require('gulp-minify-css');
var plumber = require('gulp-plumber');
var concatCss = require('gulp-concat-css');
var runSeq = require('run-sequence');

//concatenate and minify css
gulp.task('minify_styles', function () {
    gulp.src([
        "scss/layout.css",
        "scss/modal.css",
        "scss/responsive.css"
    ])
        .pipe(plumber())
        .pipe(concat('style.css'))
        .pipe(gulp.dest('build/'))
        .pipe(minifyCSS())
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest('build/'));
});
//concatenate and minify app components
gulp.task('minify_app', function () {
    gulp.src([
        "app.js",
        "constants.js",
        "services/cache.js",
        "services/spotify.js",
        "directives/resize-height.js",
        "directives/modal-box.js",
        "app-controller.js"
    ])
        .pipe(plumber())
        .pipe(concat('app_concat.js'))
        .pipe(ngAnnotate())
        .pipe(gulp.dest('build/'))
        .pipe(uglify({mangle: true}))
        .pipe(rename('app.min.js'))
        .pipe(gulp.dest('build/'))
        .on('error', gutil.log);
})

// make a master gulp task to run all the above tasks
gulp.task('build', function () {
    runSeq(
        'minify_styles',
        'minify_app'
    );
});