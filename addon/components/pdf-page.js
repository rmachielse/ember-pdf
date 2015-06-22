import Ember from 'ember';
import layout from '../templates/components/pdf-page';

export default Ember.Component.extend({
  layout: layout,
  scale: 1,
  document: null,
  pdf: null,

  getDocument: Ember.on('init', Ember.observer(function(){
    var _this = this;
    if (!Ember.isEmpty(this.get('document'))) {
      PDFJS.getDocument(this.get('document')).then(function(pdf){
        _this.set('pdf', pdf);
      });
    }
  }, 'document')),

  getPage: Ember.on('init', Ember.observer(function(){
    var _this = this;
    if (!Ember.isEmpty(this.get('pdf'))) {
      this.get('pdf').getPage(this.get('pageNumber')).then(function(page){
        window.page = page;
        _this.set('page', page);
      });
    }
  }, 'pdf', 'pageNumber')),

  getViewport: Ember.observer(function(){
    this.set('viewport', this.get('page').getViewport(this.get('scale')));
  }, 'page', 'scale'),

  getTextContent: Ember.observer(function(){
    var _this = this;
    this.get('page').getTextContent().then(function(textContent){
      _this.set('textContent', textContent);
    });
  }, 'page'),

  renderPage: Ember.observer(function(){
    var canvas = this.$('canvas').get(0);
    var context = canvas.getContext('2d');

    canvas.height = this.get('viewport.height');
    canvas.width = this.get('viewport.width');

    this.$('.page').height(this.get('viewport.height'));
    this.$('.page').width(this.get('viewport.width'));
    this.$('.canvasWrapper').height(this.get('viewport.height'));
    this.$('.canvasWrapper').width(this.get('viewport.width'));
    this.$('.textLayer').height(this.get('viewport.height'));
    this.$('.textLayer').width(this.get('viewport.width'));

    var _this = this;
    this.get('page').render({
      canvasContext: context,
      viewport: this.get('viewport')
    }).then(function(){
      _this.renderTextContent();
    });
  }, 'viewport'),

  renderTextContent: Ember.observer(function(){
    var _this = this;
    this.get('textContent.items').forEach(function(textItem){
      var style = _this.get('textContent.styles')[textItem.fontName];
      var textDiv = $('<div>');

      var tx = PDFJS.Util.transform(_this.get('viewport.transform'), textItem.transform);
      var angle = Math.atan2(tx[1], tx[0]);
      if (style.vertical) {
        angle += Math.PI / 2;
      }
      var fontHeight = Math.sqrt((tx[2] * tx[2]) + (tx[3] * tx[3]));
      var fontAscent = fontHeight;
      if (style.ascent) {
        fontAscent = style.ascent * fontAscent;
      } else if (style.descent) {
        fontAscent = (1 + style.descent) * fontAscent;
      }

      var left;
      var top;
      if (angle === 0) {
        left = tx[4];
        top = tx[5] - fontAscent;
      } else {
        left = tx[4] + (fontAscent * Math.sin(angle));
        top = tx[5] - (fontAscent * Math.cos(angle));
      }

      textDiv.css({
        'left': left + 'px',
        'top': top + 'px',
        'font-size': fontHeight + 'px',
        'font-family': style.fontFamily
      });

      textDiv.text(textItem.str);

      _this.$('.textLayer').append(textDiv);
    });
  }, 'textContent')
});
