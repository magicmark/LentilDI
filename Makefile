all: test

.PHONY: test
test: build build-examples link-local-lentil
	NODE_PATH=. ./node_modules/.bin/mocha -C --require babel-core/register tests/**.js tests/**/*.js
	NODE_PATH=build-examples/orchestra ./node_modules/.bin/mocha -C build-examples/orchestra/tests/**.js

.PHONY: build
build: node_modules
	./node_modules/.bin/babel -d build LentilDI --no-comments

.PHONY: build-examples
build-examples: node_modules
	./node_modules/.bin/babel -d build-examples examples --no-comments

link-local-lentil:
	mkdir -p build-examples/node_modules
	rm -rf build-examples/node_modules/lentildi
	ln -s ../.. build-examples/node_modules/lentildi

node_modules:
	npm install

.PHONY: coverage
coverage: build build-examples
	NODE_PATH=. ./node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha -- -C -R spec tests/**.js tests/**/*.js --compilers js:babel-register

coveralls: coverage
	cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js

jsdoc: node_modules
	./node_modules/.bin/jsdoc LentilDI/lib/lentil.js -c .jsdoc.json -r -d jsdoc

eslint: node_modules
	node_modules/.bin/eslint .

eslint-fix: node_modules
	node_modules/.bin/eslint --fix .

clean:
	rm -rf build
	rm -rf build-examples
	rm -rf coverage
	rm -rf jsodc
	rm -rf node_modules
