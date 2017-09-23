VERSION = $(shell cat package.json | sed -n 's/.*"version": "\([^"]*\)",/\1/p')

SHELL = /usr/bin/env bash

default: build
.PHONY: test  default build build_bundle


build:  build_bundle test build_esm build_min

version:
	@echo $(VERSION)

install: 
	npm install
	$$(npm bin)/jspm install 

test:
	$$(npm bin)/karma start


	
	
	
build_esm:
	$$(npm bin)/jspm build src - jquery dist/ig_helper.js  --format esm --skip-source-maps  

build_bundle:
	$$(npm bin)/jspm build src - jquery dist/ig_helper.bundle.js --format umd  --global-name IGProviders  --global-deps '{"jquery":"$$", "gmaps":"gmaps","underscore":"_"}' --skip-encode-names
	$$(npm bin)/jspm build src/loadingcircle.js - jquery dist/loadingcircle.bundle.js --format umd  --global-name LoadingCircle  --global-deps '{"jquery":"$$"}' --skip-encode-names

build_min:
	$$(npm bin)/jspm build src - jquery dist/ig_helper.min.js --format umd  -m --global-name IGProviders  --global-deps '{"jquery":"$$", "gmaps":"gmaps", "underscore":"_"}' --skip-encode-names
	$$(npm bin)/jspm build src/loadingcircle.js - jquery dist/loadingcircle.min.js --format umd  -m --global-name LoadingCircle  --global-deps '{"jquery":"$$"}' --skip-encode-names

update_version:
ifeq ($(shell expr "${VERSION}" \> "$(v)"),1)
	$(error "v" parameter is lower than current version ${VERSION})
endif
ifeq ($(v),)
	$(error v is undefined)
endif
ifeq (${VERSION},$(v))
	$(error v is already the current version)
endif
	@echo "Current version is " ${VERSION}
	@echo "Next version is " $(v)
	sed -i s/"$(VERSION)"/"$(v)"/g package.json

tag_and_push:
		git add --all
		git commit -a -m "Tag v $(v) $(m)"
		git tag v$(v)
		git push
		git push --tags


tag: build release
release: test update_version  tag_and_push		
	
