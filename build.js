var scriptFile = 'src/dataTables.contextualActions';

var fs = require('fs');
var UglifyJS = require("uglify-js");
var code = fs.readFileSync(scriptFile + '.js', 'utf8');
var uglifiedCode = UglifyJS.minify(
		code, 
		{
		    mangle: {
		        toplevel: true,
		    },
		    nameCache: {}
		}
	).code;


fs.writeFile(scriptFile + '.min.js', uglifiedCode , function (err){
  if(err) {
    console.log(err);
  } else {
    console.log('Minified file saved');
  }      
});