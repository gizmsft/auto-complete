const { src, dest } = require('gulp');
const uglifyPlugin = require('gulp-uglify');
const renamePlugin = require('gulp-rename');

var copyJsTask = function (callback) {
    src('./lib/*.js')
        .pipe(dest('./dist/js'));

    callback();
}

var minifyJsTask = function (callback) {
    src('./lib/*.js')
        .pipe(uglifyPlugin())
        .pipe(renamePlugin(function (path) {
            path.basename += '.min';
        }))
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