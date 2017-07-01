install: clean
	$(MAKE) _install_docs

build: install 
	mkdir build .tmp
	$(MAKE) _build_api
	$(MAKE) _build_docs
	rm -rf .tmp

_install_docs:
	virtualenv .tmp/build_env
	. .tmp/build_env/bin/activate
	pip install mkdocs
	python -m mkdocs --version
	pip install mkdocs-material

_build_docs:
	python -m mkdocs build --clean -d build/docs

_build_api:
	cp -r src/api build/api

clean:
	rm -rf build .tmp

dev:
	node_modules/pm2/bin/pm2 restart process-dev.yml --no-daemon
