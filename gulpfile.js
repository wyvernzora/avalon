// -------------------------------------------------------------------------- //
//                                                                            //
// AVALON.js - Redefining the galgame development.                            //
//                                                                            //
// -------------------------------------------------------------------------- //
var gulp = require('gulp');
var babel = require('gulp-babel');

gulp.task('default', function() {

  gulp.src(['src/**/*.js', 'src/**/*.jsx'])
    .pipe(babel())
    .pipe(gulp.dest('lib'));

});
