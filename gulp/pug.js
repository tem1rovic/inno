let path = require('./path/path.js')
let fs = require('fs')
let emittyPug = null

module.exports = function () {
	if (!emittyPug) {
		emittyPug = $.plugins.emitty.setup('src', 'pug', { makeVinylFile: true })
	}

	$.gulp.task('pug:build', () => {
		return new Promise((resolve, reject) => {
			emittyPug.scan(global.emittyPugChangedFile).then(() => {
				$.gulp.src(path.path.src.pug)
					.pipe($.plugins.plumber())
					.pipe(emittyPug.filter(global.emittyPugChangedFile))
					.pipe($.plugins.pug({
						pretty: !$.yargs.minifyHtml
					}))
					.pipe($.gulp.dest(path.path.build.root))
					.on('end', () => {
						$.browserSync.reload()
						resolve()
					})
					.on('error', reject)
			})
		})
	})
}
