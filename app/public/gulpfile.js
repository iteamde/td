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
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var runSequence = require('gulp-run-sequence');
var browserSync = require('browser-sync');
var CacheBuster = require('gulp-cachebust');
var browserify = require('browserify');
var addsrc = require('gulp-add-src');
var angularOrder = require('gulp-angular-order');
var ngAnnotate = require('browserify-ngannotate');
var  source = require('vinyl-source-stream');
var sprite = require('gulp-sprite-generator');
var spritesmith = require('gulp.spritesmith');
var  cachebust = new CacheBuster();


// ===============================================================================
// Development Tasks
// ===============================================================================

// gulp.task('build-js', function() {
//     var b = browserify({
//         entries: './app/app.module.js',
//         debug: true,
//         paths: ['app/**/*.js'],
//         transform: [ngAnnotate]
//     });
//
//     return b..bundle()
//         .pipe(source('bundle.js'))
//         .pipe(buffer())
//         .pipe(cachebust.resources())
//         .pipe(sourcemaps.init({loadMaps: true}))
//         .pipe(uglify())
//         .on('error', gutil.log)
//         .pipe(sourcemaps.write('./'))
//         .pipe(gulp.dest('./dist/'));
// });
//


// Concat js
// gulp.task('concatJs', function () {
//     log('Concat js to dist');
//     log('Uglify js to dist');
//     //log([paths.vendorjs,'app/app.module.js', paths.js].flatten())
//     return gulp.src(['app/app.module.js', paths.js].flatten())
//         .pipe(addsrc.prepend(paths.vendorjs))
//         .pipe(concat('main.js'))
//         .pipe(gulp.dest('dist/'))
//         // .pipe(rename('main.min.js'))
//         // .pipe(uglify())
//         // .pipe(gulp.dest('dist/'));
// });



// Concat js
gulp.task('concatJs', function () {
    //log([paths.vendorjs,'app/app.module.js', paths.js].flatten())
    return gulp.src(paths.vendorjs)
        .pipe(concat('app.js'))
        .pipe(gulp.dest('dist/'))
        .pipe(rename('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/'));
});



// Sprites task - create sprite image
gulp.task('sprites', function () {
    var spriteData = gulp.src("content/images/**/*.png")
        .pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.scss',
    }));
    return spriteData.pipe(gulp.dest('./content/css'));
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

gulp.task('build', function (callback) {
    runSequence(['sprites', 'concatJs', 'sass', 'purifyCss', 'browserSync' ], 'watch',
        callback
    )
});


gulp.task('default', function (callback) {
    runSequence(['sass', 'purifyCss', 'browserSync'], 'watch',
        callback
    )
});