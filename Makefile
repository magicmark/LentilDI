.PHONY: all
all: test

.PHONY: test
test: clean build build-examples
	NODE_PATH=. node_modules/.bin/mocha --require babel-core/register tests/**.js tests/**/*.js

build: node_modules
	node_modules/.bin/babel -d build LentilDI --no-comments

build-examples: node_modules
	node_modules/.bin/babel -d build-examples examples --no-comments
	mkdir build-examples/node_modules
	ln -s ../.. build-examples/node_modules/lentildi

node_modules:
	npm install

coverage: clean node_modules
	NODE_PATH=. ./node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha -- -R spec tests/**.js tests/**/*.js --compilers js:babel-register

.PHONY: coveralls
coveralls: coverage
	cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js

jsdoc: node_modules
	node_modules/.bin/jsdoc LentilDI/lib/lentil.js -c .jsdoc.json -r -d jsdoc

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
	rm -rf jsodc
