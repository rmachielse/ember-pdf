import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['application'],
  document: Ember.computed.alias('controllers.application.document')
});
