import Ember from 'ember';
import layout from '../templates/components/pdf-document';

export default Ember.Component.extend({
  layout: layout,
  document: null,
  scale: 2,

  getDocument: Ember.on('init', Ember.observer(function(){
    var _this = this;
    if (!Ember.isEmpty(this.get('document'))) {
      PDFJS.getDocument(this.get('document')).then(function(pdf){
        _this.set('pdf', pdf);
      });
    }
  }, 'document')),

  pages: Ember.computed(function(){
    return Array.apply(null, {
      length: this.get('pdf.pdfInfo.numPages')
    }).map(function(_, index){
      return index + 1;
    });
  }).property('pdf.pdfInfo.numPages')

});
