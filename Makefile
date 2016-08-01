.PHONY: all
all: test

.PHONY: test
test: node_modules
	npm test

.PHONY: start
start: build
	npm start

build: clean node_modules
	node_modules/.bin/babel -d build LentilDI --no-comments

build-examples: clean node_modules
	node_modules/.bin/babel -d build-examples examples --no-comments

node_modules:
	npm install

coverage: clean node_modules
	npm run coverage

.PHONY: coveralls
coveralls: coverage
	cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js

.PHONY: eslint
eslint:
	node_modules/.bin/eslint .

.PHONY: eslint-fix
eslint-fix:
	node_modules/.bin/eslint --fix .

.PHONY: clean
clean:
	rm -rf build
	rm -rf build-examples
	rm -rf coverage