var gulp = require('gulp');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var striplog = require('gulp-strip-debug');
var minifycss = require('gulp-minify-css');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var notify = require("gulp-notify");
var connect = require('gulp-connect');

//js files
gulp.task('scripts', function() {
  var js_src = 'assets/js/**/*.js'; 
  var js_dest = 'assets/build/js';
  // pipe the js through concat, console log stripping, uglification and then store
  return gulp.src(js_src)
      .pipe(concat('app.min.js')) // concat all files in the src
      .pipe(striplog())
      .pipe(uglify())   // uglify them all
      .pipe(gulp.dest(js_dest)) // save the file
      .on('error', gutil.log); 
});

gulp.task('css', function() {  
  return gulp.src(['assets/css/**/*.css', 'assets/scss/**/*.scss']) 
      .pipe(sass({style: 'compressed', errLogToConsole: true}))  // Compile sass
      .pipe(concat('app.min.css'))                               // Concat all css
      .pipe(minifycss())                                         // Minify the CSS
      .pipe(gulp.dest('assets/build/css/'))                      // Set the destination to assets/css
});

// Clean all builds
gulp.task('clean', function() {
  return gulp.src(['assets/build/'], {read: false})
    .pipe(clean());
});

// web server
gulp.task('webserver', function() {
  connect.server();
});

// Default task - clean the build dir
// Then rebuild the js and css files

gulp.task('watch', function(){
  gulp.watch(['assets/css/**/*.css','assets/scss/**/*.scss'], ['css']); // Watch and run sass on changes
  gulp.watch('assets/js/**/*.js', ['scripts']); // Watch and run javascripts on changes
  gulp.src('assets/*')
    .pipe(notify('An asset has changed'));
});

gulp.task('default', ['webserver', 'clean', 'css', 'scripts', 'watch']);
