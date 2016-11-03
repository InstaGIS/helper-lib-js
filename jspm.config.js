SystemJS.config({
  nodeConfig: {
    "paths": {
      "gmaps": "https://maps.googleapis.com/maps/api/js",
      "github:": "jspm_packages/github/",
      "npm:": "jspm_packages/npm/",
      "jquery": "test/vendor/jquery.js",
      "ig_helper/": "dist/"
    }
  },
  transpiler: "plugin-babel",
  babelOptions: {
    "optional": [
      "runtime",
      "optimisation.modules.system"
    ]
  },
  meta: {
    "dist/**/*.js": {
      "build": false
    },
    "dist/*.js": {
      "build": false
    },
    "test/vendor/*": {
      "build": false
    },
    "https://maps.googleapis.com/maps/api/*": {
      "build": false,
      "parameters": {
        "v": "3.exp",
        "libraries": "drawing,geometry",
        "key": "AIzaSyCIa4v2dHNb4jMpdLaMCHy8vZZCj8HYv40"
      },
      "loader": "gmap"
    }
  },
  packages: {
    "ig_helper": {
      "main": "ig_helper.js",
      "format": "esm"
    },
    "src": {
      "main": "ig_helper.js",
      "format": "esm"
    }
  }
});

SystemJS.config({
  packageConfigPaths: [
    "npm:@*/*.json",
    "npm:*.json"
  ],
  map: {
    "gmap": "npm:amd-googlemaps-loader@1.7.1",
    "lodash-es": "npm:lodash-es@4.16.6",
    "plugin-babel": "npm:systemjs-plugin-babel@0.0.17",
    "process": "npm:jspm-nodelibs-process@0.2.0"
  },
  packages: {}
});
