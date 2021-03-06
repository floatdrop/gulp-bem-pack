var through = require('through');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var path = require('path');
var bempack = require('bem-pack');

module.exports = function (fileName, options) {
    var firstFile = null;
    var pack = bempack(options);

    function apply(obj) {
        if (!firstFile) { firstFile = obj; }
        pack.add(obj.path);
    }

    function compile() {
        pack.bundle(function (err, buf) {
            if (err) { return this.emit('error', new PluginError('gulp-bem-pack', err)); }
            if (firstFile) {
                var joinedFile = firstFile.clone();
                joinedFile.path = path.join(firstFile.base, fileName);
                joinedFile.contents = buf;
                this.emit('data', joinedFile);
            }
            this.emit('end');
        }.bind(this));
    }

    var rs = through(apply, compile);

    return rs;
};
