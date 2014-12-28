'use strict';

var browserify = require('browserify'),
  del = require('del'),
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  // livereload = require('gulp-livereload'),
  source = require('vinyl-source-stream'),
  watchify = require('watchify');


var staticDir = './openchordcharts_web_site/static',
  jsDir = staticDir +  '/js',
  indexJsFile = jsDir + '/index.js',
  distDir = staticDir + '/dist',
  vendorDir = distDir + '/vendor';


function handleError() {
  /* jshint validthis: true */
  var args = Array.prototype.slice.call(arguments);
  gutil.log(args);
  this.emit('end'); // Keep gulp from hanging on this task
}


// function startLiveReload() {
//   var port = 35731;
//   var liveReloadServer = livereload(port);
//   var reloadPage = function(event) {
//     gutil.log('Reload browser page.');
//     liveReloadServer.changed(event.path);
//   };
//   return gulp.watch([distDir + '/**/*'], reloadPage);
// }


gulp.task('bundle:dev', function() {
  var bundler = browserify(indexJsFile, {debug: true});
  var stream = bundler.bundle()
    .on('error', handleError)
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(distDir));
  return stream;
});


gulp.task('bundle:prod', function() {
  var bundler = browserify(indexJsFile);
  bundler.plugin('minifyify', {
    map: '/dist/bundle.map.json',
    output: distDir + '/bundle.map.json',
  });
  var stream = bundler.bundle()
    .on('error', handleError)
    .pipe(source('bundle.min.js'))
    .pipe(gulp.dest(distDir));
  return stream;
});


gulp.task('clean:dist', function() {
  del.sync([distDir]);
});


gulp.task('default', ['dev']);


gulp.task('dev', ['clean:dist', 'bundle:dev', 'vendor']);


gulp.task('prod', ['clean:dist', 'bundle:prod', 'bundle:dev', 'vendor']);


gulp.task('vendor', function() {
  gulp.src([
    './node_modules/html5shiv/src/html5shiv.js',
    './node_modules/react/dist/react-with-addons.js',
    './node_modules/react/dist/react-with-addons.min.js',
    './node_modules/jquery/dist/jquery.js',
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/jquery/dist/jquery.min.map',
  ]).pipe(gulp.dest(vendorDir));
  gulp.src('./node_modules/respond/main.js')
    .pipe(gulp.dest(vendorDir + '/respond'));
  gulp.src('./node_modules/bootstrap/dist/**')
    .pipe(gulp.dest(vendorDir + '/bootstrap'));
});


gulp.task('watch', ['clean:dist', 'vendor'], function() {
  function rebundle() {
    return bundler.bundle()
      .on('error', handleError)
      .pipe(source('bundle.js'))
      .pipe(gulp.dest(distDir));
  }

  var bundler = watchify(browserify(indexJsFile, {cache: {}, debug: true, fullPaths: true, packageCache: {}}));
  bundler.on('update', function() {
    gutil.log('Rebundle in progress...');
    rebundle().on('end', function() { gutil.log('Rebundle done.'); });
  });
  gutil.log('Initial bundle in progress...');
  var stream = rebundle().on('end', function() { gutil.log('Initial bundle done.'); });
  // startLiveReload();
  return stream;
});
