const { src, dest } = require('gulp');
const uglifyPlugin = require('gulp-uglify');
const concatPlugin = require('gulp-concat');

var copyJsTask = function (callback) {
    src('./lib/*.js')
        .pipe(dest('./dist/js'));

    callback();
}

var minifyJsTask = function (callback) {
    src([
        'node_modules/ajax-call-synchronizer/dist/js/ajax-call-synchronizer.min.js',
        './lib/*.js'])
        .pipe(uglifyPlugin())
        .pipe(concatPlugin('auto-complete.min.js'))
        .pipe(dest('./dist/js'));

    callback();
}

var defaultTask = function (callback) {
    copyJsTask(callback);
    minifyJsTask(callback);

    callback();
}

exports.copyJs = copyJsTask;
exports.minifyJs = minifyJsTask;
exports.default = defaultTask;