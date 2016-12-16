var gulp = require('gulp');
var mocha = require('gulp-mocha');
var browserify = require('gulp-browserify');

gulp.task('test-models', function() {
  var error = false;
  gulp.
    src('./server/tests/test-models.js').
    pipe(mocha()).
    on('error', function() {
      console.log('Tests failed!');
      error = true;
    }).
    on('end', function() {
      if (!error) {
        console.log('Tests succeeded!');
        process.exit(0);
      }
    });
});

gulp.task('test-api', function() {
  var error = false;
  gulp.
    src('./server/tests/test-api.js').
    pipe(mocha()).
    on('error', function() {
      console.log('Tests failed!');
      error = true;
    }).
    on('end', function() {
      if (!error) {
        console.log('Tests succeeded!');
        process.exit(0);
      }
    });
});

gulp.task('test-auth', function() {
  var error = false;
  gulp.
    src('./server/tests/test-auth.js').
    pipe(mocha()).
    on('error', function() {
      console.log('Tests failed!');
      error = true;
    }).
    on('end', function() {
      if (!error) {
        console.log('Tests succeeded!');
        process.exit(0);
      }
    });
});


gulp.task('test-client', function() {
  return gulp.
    src('./client/index.js').
    pipe(browserify()).
    pipe(gulp.dest('./bin'));
});


gulp.task('watch', function() {
  gulp.watch(['./server/models/produce.js','./server/models/recipe.js))'], ['test-models']);
  gulp.watch(['./client/controllers/recipes.js'], ['test-client']);
});
