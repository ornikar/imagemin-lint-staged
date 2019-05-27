"use strict";
const fs = require("fs");
const promisify = require("util.promisify");
const cosmiconfig = require("cosmiconfig");

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const explorer = cosmiconfig("imagemin-lint-staged");
const cosmiconfigResult = explorer.searchSync();
const config = cosmiconfigResult ? cosmiconfigResult.config : {};

const plugins = [
  [
    "imagemin-gifsicle",
    Object.assign({
      interlaced: true
    }, config.gifsicle),
  ],
  [
    "imagemin-jpegtran",
    Object.assign({
      progressive: true
    }, config.jpegtran),
  ],
  [
    "imagemin-optipng",
    Object.assign({
      optimizationLevel: 5
    }, config.optipng),
  ],
  [
    "imagemin-svgo",
    Object.assign({
      plugins: [{ removeViewBox: false }]
    }, config.svgo),
  ]
].map(([name, opts]) => require(name)(opts));

const minifyFile = (exports.minifyFile = filename =>
  [...plugins, it => writeFile(filename, it)].reduce(
    (acc, it) => acc.then(it),
    readFile(filename)
  ));
