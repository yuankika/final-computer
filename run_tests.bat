@echo off
echo ===================================
echo Running Go Backend Tests...
echo ===================================
cd cmd\server
go test -v
cd ..\..

echo.
echo ===================================
echo Running Next.js Frontend Tests...
echo ===================================
cd web-next
echo Note: Before running frontend tests, make sure you have installed dependencies with:
echo npm install
echo.
echo To run the tests:
echo npm test
cd ..

echo.
echo ===================================
echo Testing Complete
echo =================================== 