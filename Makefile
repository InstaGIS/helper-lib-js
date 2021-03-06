VERSION = $(shell cat package.json | sed -n 's/.*"version": "\([^"]*\)",/\1/p')
current_babel_eslint = $(shell cat package.json | sed -n 's/.*"babel-eslint": "\([^"]*\)",/\1/p')
current_eslint = $(shell cat package.json | sed -n 's/.*"eslint": "\([^"]*\)",/\1/p')
SHELL = /usr/bin/env bash

YELLOW=\033[0;33m
RED=\033[0;31m
WHITE=\033[0m
GREEN=\u001B[32m

default: build
.PHONY: test  default build build_bundle




version:
	@echo $(VERSION)

install: 
	npm install

test:
	$$(npm bin)/karma start


	
update_eslint:
	@echo  -e "Current eslint is $(GREEN)$(current_eslint)$(WHITE), current babel-eslint is $(GREEN)$(current_babel_eslint)$(WHITE)" ;\
	npm remove --save-dev eslint babel-eslint ;\
	npm install --save-dev eslint babel-eslint



build:
	@$$(npm bin)/rollup -c 
	@MINIFY=true $$(npm bin)/rollup -c 
	@LOADINGCIRCLE=true $$(npm bin)/rollup -c 
	@LOADINGCIRCLE=true MINIFY=true $$(npm bin)/rollup -c 
	@cp dist/ig_helper.js dist/index.js 
	@cp dist/ig_helper.min.js dist/index.min.js



update_version:
ifeq ($(shell expr "${CURRENT_MAJOR}" \> "$(NEXT_MAJOR)"),1)
	$(error "v" parameter is lower than current version ${VERSION})
endif
ifeq ($(shell expr "${CURRENT_MINOR}" \> "$(NEXT_MINOR)"),1)
	$(error "v" parameter is lower than current version ${VERSION})
endif
ifeq ($(shell expr "${CURRENT_HOTFIX}" \> "$(NEXT_HOTFIX)"),1)
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
	sed -i s/'"version": "$(VERSION)"'/'"version": "$(v)"'/g package.json

check_version:
	$(eval SPLIT_VERSION = $(subst ., ,${VERSION}))
	$(eval NEXT_VERSION := $(subst ., ,${v}))
	$(eval CURRENT_MAJOR := $(word 1,$(SPLIT_VERSION)))
	$(eval CURRENT_MINOR := $(word 2,$(SPLIT_VERSION)))
	$(eval CURRENT_HOTFIX := $(word 3,$(SPLIT_VERSION)))
	$(eval NEXT_MAJOR := $(word 1,$(NEXT_VERSION)))
	$(eval NEXT_MINOR := $(word 2,$(NEXT_VERSION)))
	$(eval NEXT_HOTFIX := $(word 3,$(NEXT_VERSION)))


tag_and_push:
		git add --all
		git commit -a -m "Tag v $(v) $(m)"
		git tag v$(v)
		git push
		git push --tags

tag: build release

release: test check_version update_version tag_and_push		
	
