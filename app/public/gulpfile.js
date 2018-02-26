var gulp = require('gulp');
var plug = require('gulp-load-plugins')();
var del = require('del');
var paths = require('./gulp.config.json');
var log = plug.util.log;
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var sass = require('gulp-sass');
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
var ngAnnotate = require('browserify-ngannotate');
var runSequence = require('gulp-run-sequence');
var browserSync = require('browser-sync');
var CacheBuster = require('gulp-cachebust');
var cachebust = new CacheBuster();


// ===============================================================================
// Development Tasks
// ===============================================================================


// Compile Sass
gulp.task('sass', function () {
    var dest = './content/css';
    log('Compiling Sass and copying it to ' + dest);
    return gulp.src(paths.scss)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['> 0%'],
            cascade: false
        }))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(dest))
        .pipe(browserSync.stream({match: '**/*.css'}));
})

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
    gulp.watch(paths.htmltemplates, browserSync.reload);
    gulp.watch(paths.js, browserSync.reload);
});


// Build Sequences
// ---------------

gulp.task('default', function (callback) {
    runSequence(['sass', 'browserSync'], 'watch',
        callback
    )
});