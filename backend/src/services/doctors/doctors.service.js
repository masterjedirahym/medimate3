// Initializes the `doctors` service on path `/doctors`
const createService = require('feathers-knex');
const createModel = require('../../models/doctors.model');
const hooks = require('./doctors.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'doctors',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/doctors', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('doctors');

  service.hooks(hooks);
};
  