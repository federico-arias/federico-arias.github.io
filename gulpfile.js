/*!
 * gulp
 * $ npm install gulp-ruby-sass gulp-autoprefixer gulp-minify-css gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache del --save-dev
 */

// Load plugins
var gulp = require('gulp'),
    plumber = require('gulp-plumber');
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass');

// Styles 
gulp.task('styles', function() {
  return gulp.src(['src/styles/{*.scss, *.css}'])
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer('last 4 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(concat('style.css'))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/styles'))
});

// Scripts
gulp.task('scripts', function() {
  return gulp.src('src/scripts/**/*.js')
    .pipe(concat('main.js'))
    //.pipe(uglify())
    .pipe(gulp.dest('dist/scripts'))
});

// Images
gulp.task('images', function() {
return gulp.src(['src/images/**/{*.png, *.jpeg, *.jpg, *.svg}'])
    .pipe(imagemin({
        svgoPlugins: [{removeViewBox: false}], 
        optimizationLevel: 3, 
        progressive: true, 
        interlaced: true }))
    .pipe(gulp.dest('dist/images'))
});

// HTML
gulp.task('html', function() {
  return gulp.src('src/*.html')
    .pipe(gulp.dest('dist/'))
  });

// Clean
gulp.task('clean', function(cb) {
    del(['dist/assets/css', 'dist/assets/js', 'dist/assets/img'], cb)
});

// Default task
gulp.task('default', function() {
    gulp.start('styles', 'scripts', 'images', 'html');
});

// Watch
gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch('src/styles/**/*.scss', ['styles']);

  // Watch .js files
  gulp.watch('src/scripts/**/*.js', ['scripts']);

  // Watch image files
  gulp.watch('src/images/**/*', ['images']);
      
  //Watch HTML
  gulp.watch('src/*.html', ['html']);

  // Create LiveReload server
  //livereload.listen();

  // Watch any files in dist/, reload on change
  //gulp.watch(['dist/**']).on('change', livereload.changed);

});

