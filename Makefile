VERSION = $(shell cat package.json | sed -n 's/.*"version": "\([^"]*\)",/\1/p')

SHELL = /usr/bin/env bash

default: build
.PHONY: test  default ig_helper


build: ig_helper

version:
	@echo $(VERSION)

install: 
	npm install
	jspm install --quick

test:
	grunt karma



ig_helper: build_esm build_bundle build_min
	
	
	
	
build_esm:
	jspm build src - jquery dist/ig_helper.js  --format esm --skip-source-maps  

build_bundle:
	jspm build src - jquery dist/ig_helper.bundle.js --format umd  --global-name IGProviders  --global-deps '{"jquery":"$$", "gmaps":"gmaps"}' --skip-encode-names

build_min:
	jspm build src - jquery dist/ig_helper.min.js --format umd  -m --global-name IGProviders  --global-deps '{"jquery":"$$", "gmaps":"gmaps"}' --skip-encode-names


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

	