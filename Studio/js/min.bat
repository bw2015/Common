@echo off
rem npm install -g uglify-js
cd %~dp0
uglifyjs native.core.js native.prototype.array.js native.prototype.date.js native.prototype.element.js native.request.js native.media.js -o native.min.js > out.log
:loop
copy /B  native.core.js+native.prototype.array.js+native.prototype.date.js+native.prototype.element.js+native.request.js+native.media.js    native.js >> out.log
timeout /nobreak /t 3 >> out.log
goto loop