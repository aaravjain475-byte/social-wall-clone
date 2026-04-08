@echo off
echo Setting up Social Wall Clone project...

echo.
echo Installing frontend dependencies...
call npm install

echo.
echo Installing date-fns for time formatting...
call npm install date-fns

echo.
echo Setup complete!
echo.
echo To start the project:
echo 1. Open terminal and run: npm run dev
echo 2. Open another terminal and run: npm run server
echo 3. Open http://localhost:3000 in your browser
echo.
echo Press any key to exit...
pause
