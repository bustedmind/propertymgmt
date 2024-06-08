cd NodeJS/
rm -rf ./test-report.xml && CI=true ./node_modules/.bin/jest test/properties.test.js --testEnvironment=node --verbose --forceExit
cd ../ReactJS/
rm -rf ./junit.xml && CI=true ./node_modules/.bin/react-scripts test src/test/App.test.js src/test/AddShop.test.js src/test/DisplayShops.test.js src/test/LeaseShop.test.js src/test/Header.test.js --testResultsProcessor=\"jest-junit\" --watchAll=false
