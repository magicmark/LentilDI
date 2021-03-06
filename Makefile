all: test

venv: Makefile requirements-dev.txt
	rm -rf venv
	virtualenv venv --python=python3
	venv/bin/pip install -r requirements-dev.txt
	venv/bin/pre-commit install -f --install-hooks

.PHONY: test
test: venv build build-examples
	# Run unit tests + coverage
	npm test
	# Test examples
	NODE_PATH=build-examples/orchestra ./node_modules/.bin/mocha -C build-examples/orchestra/tests/**.js
	# Run pre-commit hooks
	venv/bin/pre-commit run --all-files

.PHONY: build
build: node_modules
	./node_modules/.bin/babel -d dist src --no-comments

.PHONY: build-examples
build-examples: node_modules link-local-lentil
	./node_modules/.bin/babel -d build-examples examples --no-comments

link-local-lentil:
	mkdir -p build-examples/node_modules
	rm -rf build-examples/node_modules/lentildi
	ln -s ../.. build-examples/node_modules/lentildi

node_modules:
	npm install

coveralls: coverage node_modules
	cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js

.PHONY: jsdoc
jsdoc: node_modules
	./node_modules/.bin/jsdoc LentilDI/lib/lentil.js -c .jsdoc.json -r -d jsdoc

eslint: node_modules
	node_modules/.bin/eslint .

eslint-fix: node_modules
	node_modules/.bin/eslint --fix .

clean:
	rm -rf dist
	rm -rf build-examples
	rm -rf coverage
	rm -rf .nyc_output
	rm -rf jsdoc
	rm -rf node_modules
	rm -rf venv
