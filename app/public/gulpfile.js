var gulp = require('gulp');
var plug = require('gulp-load-plugins')();
var del = require('del');
var paths = require('./gulp.config.json');
var log = plug.util.log;
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var purify = require('gulp-purifycss');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var webserver = require('gulp-webserver');
var karma = require('gulp-karma');
var jshint = require('gulp-jshint');
var spritesmith = require('gulp.spritesmith');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var runSequence = require('gulp-run-sequence');
var browserSync = require('browser-sync');
var CacheBuster = require('gulp-cachebust');
var cachebust = new CacheBuster();


// ===============================================================================
// Development Tasks
// ===============================================================================

// Concat js
gulp.task('concatJs', function () {
    log('Concat js ' + paths.js);
    return gulp.src(paths.js)
        .pipe(concat('main.js'))
        .pipe(gulp.dest('../my'));
});



// Compile Sass
gulp.task('sass', function () {
    log('Compiling Sass and copying it to ' + paths.destCss);
    return gulp.src(paths.scss)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['> 0%'],
            cascade: false
        }))
        .pipe(sourcemaps.write('./maps'))
        .pipe(cleanCSS())
        .pipe(gulp.dest(paths.destCss))
});


//delete unused css
gulp.task('purifyCss', function () {
    return gulp.src(paths.css)
        .pipe(purify(paths.js.concat(paths.htmlTemplates)))
        .pipe(gulp.dest(paths.destCss))
});


// Start browserSync server
gulp.task('browserSync', function () {
    browserSync({
        server: {
            baseDir: './'
        }
    })
});


// All Watchers
gulp.task('watch', function () {
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.scss, ['sass']);
    gulp.watch(paths.htmlTemplates, browserSync.reload);
    gulp.watch(paths.js, browserSync.reload);
});


// Build Sequences
// ---------------

gulp.task('default', function (callback) {
    runSequence(['sass', 'purifyCss', 'browserSync'], 'watch',
        callback
    )
});