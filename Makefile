.PHONY: all
all: test

.PHONY: test
test: build-examples
	NODE_PATH=. node_modules/.bin/mocha --require babel-core/register tests/**.js tests/**/*.js
	node build-examples/hello_world/index.js
	node build-examples/orchestra/index.js

.PHONY: start
start: build
	npm start

build: clean node_modules
	node_modules/.bin/babel -d build LentilDI --no-comments

build-examples: clean node_modules
	node_modules/.bin/babel -d build-examples examples --no-comments
	cp examples/node_modules/lentildi/package.json build-examples/node_modules/lentildi/package.json 

node_modules:
	npm install

coverage: clean node_modules
	npm run coverage

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
