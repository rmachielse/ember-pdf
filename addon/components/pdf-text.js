import Ember from 'ember';
import layout from '../templates/components/pdf-text';

export default Ember.Component.extend({
  layout: layout,
  styles: null,
  attributeBindings: ['css:style'],

  style: Ember.computed('text.fontName', 'styles', function() {
    return this.get('styles.' + this.get('text.fontName'));
  }),

  transform: Ember.computed('viewport.transform', 'text.transform', function() {
    return PDFJS.Util.transform(this.get('viewport.transform'), this.get('text.transform'));
  }),

  angle: Ember.computed('transform.1', 'transform.0', 'style.vertical', function() {
    var angle = Math.atan2(this.get('transform.1'), this.get('transform.0'));
    if (this.get('style.vertical')) {
      angle += Math.PI / 2;
    }
    return angle;
  }),

  fontHeight: Ember.computed('transform.2', 'transform.3', function() {
    return Math.sqrt((this.get('transform.2') * this.get('transform.2')) + (this.get('transform.3') * this.get('transform.3')));
  }),

  fontAscent: Ember.computed('style.ascent', 'style.descent', 'fontHeight', function() {
    if (this.get('style.ascent')) {
      return this.get('style.ascent') * this.get('fontHeight');
    } else if (this.get('style.descent')) {
      return (1 + this.get('style.descent')) * this.get('fontHeight');
    }
  }),

  left: Ember.computed('angle', 'transform.4', 'fontAscent', function() {
    if (this.get('angle') === 0) {
      return this.get('transform.4') + 'px';
    } else {
      return this.get('transform.4') + (this.get('fontAscent') * Math.sin(this.get('angle'))) + 'px';
    }
  }),

  top: Ember.computed('angle', 'transform.5', 'fontAscent', function() {
    if (this.get('angle') === 0) {
      return this.get('transform.5') - this.get('fontAscent') + 'px';
    } else {
      return this.get('transform.5') - (this.get('fontAscent') * Math.cos(this.get('angle'))) + 'px';
    }
  }),

  fontSize: Ember.computed('fontHeight', function() {
    return `${this.get('fontHeight')}px`;
  }),

  fontFamily: Ember.computed.alias('style.fontFamily'),

  rotate: Ember.computed('angle', function() {
    if (this.get('angle')) {
      return 'rotate(' + this.get('angle') + 'deg)';
    }
  }),

  canvasWidth: Ember.computed('style.vertical', 'text.height', 'text.width', 'viewport.scale', function() {
    if (this.get('style.vertical')) {
      return this.get('text.height') * this.get('viewport.scale');
    } else {
      return this.get('text.width') * this.get('viewport.scale');
    }
  }),

  textWidth: Ember.computed('fontSize', 'fontFamily', 'text.str', function() {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');

    context.font = this.get('fontSize') + ' ' + this.get('fontFamily');

    return context.measureText(this.get('text.str')).width;
  }),

  scaleX: Ember.computed('canvasWidth', 'textWidth', function() {
    if (this.get('textWidth') > 0) {
      return 'scaleX(' + this.get('canvasWidth') / this.get('textWidth') + ')';
    }
  }),

  css: Ember.computed('left', 'top', 'fontSize', 'fontFamily', 'rotate', 'scaleX', function() {
    return ([
      'left: ' + this.get('left'),
      'top: ' + this.get('top'),
      'font-size: ' + this.get('fontSize'),
      'font-family: ' + this.get('fontFamily'),
      'transform: ' + [this.get('rotate'), this.get('scaleX')].compact().join(' ')
    ].join('; ') + ';').htmlSafe();
  })
});
