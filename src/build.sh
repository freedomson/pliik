rm -rf build
node node_modules/requirejs/bin/r.js -o app.build.js
node node_modules/uglify-js/bin/uglifyjs -nm -nmf -ns --no-seqs --no-dead-code -nc -o build/js/main.js --overwrite build/js/main.js
node node_modules/uglify-js/bin/uglifyjs -nm -nmf -ns --no-seqs --no-dead-code -nc -o build/js/libs/vendor/require/require.js --overwrite build/js/libs/vendor/require/require.js

# Browser Compat Hack v1
cd build
ln -s ../app .
