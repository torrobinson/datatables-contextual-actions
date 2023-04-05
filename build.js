// Requires
var fs = require('fs');
var UglifyJS = require("uglify-js");
var uglifycss = require('uglifycss');
var replace = require('replace-in-file');

// Vars
var scriptFileName = 'dataTables.contextualActions';
var cssFileName = 'dataTables.contextualActions';
var dir = __dirname;
var sourceFolder = dir + '/src/';
var distFolder = dir + '/dist/';

// Minification
var code = fs.readFileSync(sourceFolder + scriptFileName + '.js', 'utf8');
var uglifiedCode = UglifyJS.minify(
		code, 
		{
		    mangle: {
		        toplevel: true,
		    },
		    nameCache: {}
		}
	).code;

var uglifiedCss = uglifycss.processFiles(
    [ (sourceFolder + cssFileName+ '.css') ],
    { maxLineLen: 500, expandVars: true }
);

// Create dist folder if not exists
if (!fs.existsSync(distFolder)){
	fs.mkdirSync(distFolder);
}

// Create the javascript
fs.writeFile(distFolder + scriptFileName + '.min.js', uglifiedCode , function (err){
	if(err) {
		console.log(err);
	} else {
		console.log('Minified javascript saved');
	}      
});

// Create the CSS
fs.writeFile(distFolder + cssFileName + '.min.css', uglifiedCss , function (err){
	if(err) {
		console.log(err);
	} else {
		console.log('Minified css saved');
	}      
});

// Copy over the index.html documentation to /docs/ with the script path replaced to use /dist/
fs.copyFile('index.html', 'docs/index.html', (err) => {
  	if (err) throw err;
  	
	// Replace script path
	replace({
		files: 'docs/index.html',
		from: `src="./src/dataTables.contextualActions.js"`,
 		to: `src="../dist/dataTables.contextualActions.min.js"`,
	})
	.then(() => {
		
		// Replace style path
		replace({ 
			files: 'docs/index.html',
			from: `href="./src/dataTables.contextualActions.css"`,
			to: `href="../dist/dataTables.contextualActions.min.css"`,
		})
		.then(() => {
			console.log('/docs/index.html built successfully');
		});

	});

});