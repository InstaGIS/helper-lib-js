VERSION = $(shell cat package.json | sed -n 's/.*"version": "\([^"]*\)",/\1/p')

SHELL = /usr/bin/env bash

default: build
.PHONY: test  default build


build:  build_esm build_bundle build_min

version:
	@echo $(VERSION)

install: 
	npm install
	jspm install 

test:
	grunt karma


	
	
	
build_esm:
	jspm build src - jquery dist/ig_helper.js  --format esm --skip-source-maps  

build_bundle:
	jspm build src - jquery dist/ig_helper.bundle.js --format umd  --global-name IGProviders  --global-deps '{"jquery":"$$", "gmaps":"gmaps","underscore":"_"}' --skip-encode-names

build_min:
	jspm build src - jquery dist/ig_helper.min.js --format umd  -m --global-name IGProviders  --global-deps '{"jquery":"$$", "gmaps":"gmaps", "underscore":"_"}' --skip-encode-names


update_version:
	@echo "Current version is " ${VERSION}
	@echo "Next version is " $(v)
	sed -i s/"$(VERSION)"/"$(v)"/g package.json

tag_and_push:
		git add --all
		git commit -a -m "Tag v $(v) $(m)"
		git tag v$(v)
		git push
		git push --tags


tag: update_version build tag_and_push		
release: update_version  tag_and_push		
	
