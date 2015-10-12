import Ember from 'ember';
import layout from '../templates/components/pdf-document';

export default Ember.Component.extend({
  layout: layout,
  document: null,
  scale: 1,
  pageNumber: 1,
  textLayer: true,

  didInsertElement: function() {
    this.$().parent().on('scroll', () => {
      this.setPage();
    });
  },

  getDocument: Ember.on('init', Ember.observer('document', function() {
    console.log('getDocument');
    if (!Ember.isEmpty(this.get('document'))) {
      PDFJS.getDocument(this.get('document')).then((pdf) => {
        this.set('pdf', pdf);
      });
    }
  })),

  pages: Ember.computed('pdf.pdfInfo.numPages', function() {
    return Array.apply(null, {
      length: this.get('pdf.pdfInfo.numPages')
    }).map((_, index) => {
      return index + 1;
    });
  }),

  setPageNumber: Ember.observer('pageNumber', function() {
    if (this.get('pageNumber') !== this.get('currentPage')) {
      this.send('goToPage', this.get('pageNumber'));
    }
  }),

  currentPage: Ember.computed(function() {
    return 1 + Math.round(this.$().parent().scrollTop() / (this.$('.page').height() - 10));
  }).volatile(),

  setPage: function() {
    var page = this.get('currentPage');
    if (this.get('pageNumber') !== page) {
      this.set('pageNumber', page);
    }
  },

  actions: {
    goToPage (page) {
      this.$().parent().animate({
        scrollTop: this.$().parent().scrollTop() + this.$("#pageContainer" + page).position().top + 5
      });
    }
  }
});
