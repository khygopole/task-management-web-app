@echo off
echo Starting the whole web application build and execution process...

echo.
cd backend
if %errorlevel% neq 0 (
echo Error: Could not change to the backend directory.
pause
exit /b %errorlevel%
)

echo.
echo Installing Essential Modules and Building the project...
call npm run build
if %errorlevel% neq 0 (
echo Error: 'npm run build' failed.
pause
exit /b %errorlevel%
)

echo.
echo Starting the application...
call npm run start
if %errorlevel% neq 0 (
echo Error: 'npm run start' failed.
pause
exit /b %errorlevel%
)

echo.
echo Application is now running in http://localhost:3000...
pause