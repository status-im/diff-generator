const gulp = require('gulp')
const clean = require('gulp-clean')
const mocha = require('gulp-mocha')
const print = require('gulp-print').default
const run = require('gulp-run-command').default
const nodemon = require('gulp-nodemon')

const CONT_NAME = 'diffgen'

gulp.task('devel', () => {
  nodemon({
      script: 'src/server.js',
      presets: ['env', 'stage-2'],
    })
    .on('restart', () => { console.log('>> node restart') })
})

//gulp.task('test', () =>
//  gulp.src('test/**/*.js', {read: false})
//    .pipe(mocha({sort: true, reporter: 'list'}))
//)
//
//gulp.task('testw', () =>
//  gulp.src('test/**/*.js', {read: false})
//    .pipe(mocha({sort: true, reporter: 'list', watch: true}))
//)

gulp.task('build', [])

gulp.task('image', ['build'], run(`docker build -t statusteam/${CONT_NAME} .`))

gulp.task('push', ['image'], run(`docker push statusteam/${CONT_NAME}`))

gulp.task('default', ['build'])
gulp.task('release', ['push'])
