import Ember from 'ember';
import layout from '../templates/components/pdf-page';

export default Ember.Component.extend({
  layout: layout,
  scale: 1,
  textLayer: true,
  document: null,
  pdf: null,

  getDocument: Ember.on('init', Ember.observer('document', function() {
    if (!Ember.isEmpty(this.get('document'))) {
      PDFJS.getDocument(this.get('document')).then((pdf) => {
        this.set('pdf', pdf);
      });
    }
  })),

  getPage: Ember.on('init', Ember.observer('pdf', 'pageNumber', function() {
    if (!Ember.isEmpty(this.get('pdf'))) {
      this.get('pdf').getPage(this.get('pageNumber')).then((page) => {
        window.page = page;
        this.set('page', page);
      });
    }
  })),

  getViewport: Ember.observer('page', 'scale', function() {
    this.set('viewport', this.get('page').getViewport(this.get('scale')));
  }),

  width: Ember.computed('viewport.width', function() {
    return `${this.get('viewport.width')}px`.htmlSafe();
  }),

  height: Ember.computed('viewport.height', function() {
    return `${this.get('viewport.height')}px`.htmlSafe();
  })
});
