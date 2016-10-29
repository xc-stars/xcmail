var gulp = require('gulp')
var less = require('gulp-less')
var lessSrc = 'src/static/less/**/*.less'
var lessDist = 'src/static/css'
var jsSrc
var jsDist

gulp.watch(lessSrc, ['compile-less'])
gulp.task('default', ['compile-less'])
gulp.task('compile-less', function () {
  console.log('正在重新编译less')
  gulp.src(lessSrc)
    .pipe(less())
    .pipe(gulp.dest(lessDist))
})
