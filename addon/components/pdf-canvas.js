import Ember from 'ember';
import layout from '../templates/components/pdf-canvas';

export default Ember.Component.extend({
  layout: layout,
  classNames: ['canvasWrapper'],
  height: Ember.computed.alias('viewport.height'),
  width: Ember.computed.alias('viewport.width'),

  renderCanvas: Ember.observer('page', 'viewport', function() {
    if (Ember.isPresent(this.get('page')) && Ember.isPresent(this.get('viewport'))) {
      this.get('page').render({
        canvasContext: this.$('canvas').get(0).getContext('2d'),
        viewport: this.get('viewport')
      });
    }
  })
});
