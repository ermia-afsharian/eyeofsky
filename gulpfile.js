var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    sass = require('gulp-sass'),
    terser = require("gulp-terser"),
    rename = require("gulp-rename"),
    eslint = require("gulp-eslint"),
    cssnano= require('gulp-cssnano'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync');

var plumberErrorHandler = {
   errorHandler: notify.onError({
      title: 'Gulp',
      message: 'Error: <%= error.message %>'
   })
};

gulp.task('sass', function() {
   gulp.src('./sass/*.scss')
      .pipe(plumber(plumberErrorHandler))
      .pipe(sass())
      .pipe(cssnano())
      .pipe(autoprefixer({
         browsers: ['last 2 versions']
      }))
      .pipe(cssnano())
      .pipe(rename("style.min.css"))
      .pipe(gulp.dest('./build/css'))
});

gulp.task('scripts', function(){
   return gulp
   .src('./js/index.js') // What files do we want gulp to consume?
   .pipe(eslint())
   .pipe(eslint.format())
   .pipe(eslint.failAfterError())
   .pipe(terser()) // Call the terser function on these files
   .pipe(rename( "index.min.js" )) // Rename the uglified file
   .pipe(gulp.dest("./build/js")); // Where do we put the result?
});

gulp.task('browser-sync', function() {
   browserSync.init({
      server: {
         baseDir: "./"
      }
   });

   gulp.watch(['build/css/*.css', 'build/js/*.js']).on('change', browserSync.reload);
});

gulp.task('watch', function() {
   gulp.watch('sass/*.scss', gulp.series('sass'));
   gulp.watch('js/*.js', gulp.series('scripts'));
});

gulp.task('default', gulp.parallel('watch', 'browser-sync'));
