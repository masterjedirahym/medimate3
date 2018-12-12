const doctors = require('./doctors/doctors.service.js');
const patients = require('./patients/patients.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(doctors);
  app.configure(patients);
};
