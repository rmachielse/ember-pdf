import Ember from 'ember';
import layout from '../templates/components/pdf-text-layer';

export default Ember.Component.extend({
  layout: layout,
  classNames: ['textLayer'],
  styles: Ember.computed.alias('textContent.styles'),

  getTextContent () {
    if (!Ember.isEmpty(this.get('page'))) {
      this.get('page').getTextContent().then((textContent) => {
        this.set('textContent', textContent);
      });
    }
  },

  getTextContentThrottled: Ember.observer('page', function() {
    Ember.run.throttle(this, this.getTextContent, 0);
  })
});
