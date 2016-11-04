SystemJS.config({
  map: {
    "babel-plugin-transform-es2015-unicode-regex": "npm:babel-plugin-transform-es2015-unicode-regex@6.11.0",
    "babel-plugin-transform-merge-sibling-variables": "npm:babel-plugin-transform-merge-sibling-variables@6.8.0",
    "babel-plugin-transform-object-assign": "npm:babel-plugin-transform-object-assign@6.8.0"
  },
  packages: {
    "npm:babel-plugin-transform-es2015-unicode-regex@6.11.0": {
      "map": {
        "babel-runtime": "npm:babel-runtime@6.18.0",
        "regexpu-core": "npm:regexpu-core@2.0.0",
        "babel-helper-regex": "npm:babel-helper-regex@6.18.0"
      }
    },
    "npm:babel-runtime@6.18.0": {
      "map": {
        "core-js": "npm:core-js@2.4.1",
        "regenerator-runtime": "npm:regenerator-runtime@0.9.6"
      }
    },
    "npm:babel-plugin-transform-merge-sibling-variables@6.8.0": {
      "map": {
        "babel-runtime": "npm:babel-runtime@6.18.0"
      }
    },
    "npm:babel-plugin-transform-object-assign@6.8.0": {
      "map": {
        "babel-runtime": "npm:babel-runtime@6.18.0"
      }
    },
    "npm:babel-helper-regex@6.18.0": {
      "map": {
        "babel-runtime": "npm:babel-runtime@6.18.0",
        "babel-types": "npm:babel-types@6.18.0",
        "lodash": "npm:lodash@4.16.6"
      }
    },
    "npm:regexpu-core@2.0.0": {
      "map": {
        "regjsgen": "npm:regjsgen@0.2.0",
        "regjsparser": "npm:regjsparser@0.1.5",
        "regenerate": "npm:regenerate@1.3.1"
      }
    },
    "npm:babel-types@6.18.0": {
      "map": {
        "babel-runtime": "npm:babel-runtime@6.18.0",
        "lodash": "npm:lodash@4.16.6",
        "to-fast-properties": "npm:to-fast-properties@1.0.2",
        "esutils": "npm:esutils@2.0.2"
      }
    },
    "npm:regjsparser@0.1.5": {
      "map": {
        "jsesc": "npm:jsesc@0.5.0"
      }
    }
  }
});
