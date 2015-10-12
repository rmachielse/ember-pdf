/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-pdf',

  included: function(app) {
    this._super.included(app);

    app.import(app.bowerDirectory + '/pdfjs-dist/build/pdf.combined.js');
    app.import('vendor/pdfjs.css');
  }
};
