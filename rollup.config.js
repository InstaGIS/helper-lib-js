import uglify from 'rollup-plugin-uglify';
import alias from 'rollup-plugin-alias';

var input = "./src/ig_helper.js",
  plugins = [alias({
    ig_markerfactory: "node_modules/ig_markerfactory/dist/markerfactory.es6.js",
  })],
  output = [{
    file: "dist/ig_helper.bundle.js",
    format: "umd",
    exports: 'named',
    name: 'IGProviders'
  }, {
    file: "dist/ig_helper.js",
    format: "es",
  }];

if (process.env.LOADINGCIRCLE) {
  input = "./src/loadingcircle.js";
  plugins = [];
  output = [{
    file: "dist/loadingcircle.bundle.js",
    format: "umd",
    exports: 'named',
    name: 'LoadingCircle'
  }, {
    file: "dist/loadingcircle.js",
    format: "es",
  }];

}

if (process.env.MINIFY) {
  plugins.push(uglify({
    mangle: false
  }));
  output = {
    file: "dist/ig_helper.min.js",
    format: "umd",
    exports: 'named',
    name: 'IGProviders',
    sourcemap: true
  };
  if (process.env.LOADINGCIRCLE) {
    output = {
      file: "dist/loadingcircle.min.js",
      format: "umd",
      exports: 'named',
      name: 'LoadingCircle',
      sourcemap: true
    };
  }
}

var confObject = {
  input: input,
  plugins: plugins,
  output: output,
  extend: true,
  external: ['jquery'],
  globals: {
    jquery: '$'
  }
};

if (!process.env.LOADINGCIRCLE) {
  confObject.external.push('underscore');
  confObject.external.push('gmaps');
  confObject.globals.underscore = '_';
  confObject.globals.gmaps = 'gmaps';

}

export default confObject;
