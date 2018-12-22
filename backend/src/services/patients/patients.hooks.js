

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [
      // add related doctors to the doctor_patient table
      async function(context) {
        if ("undefined" !== typeof context.data.doctors) {
          // get the data we want to add to the join table
          const doctors = context.data.doctors;
          // remove the doctors property from the data
          delete context.data.doctors;
          // get the knex db client
          const knex = context.app.get('knexClient');
          // create the raw queries to modify doctor_patient
          await knex.raw(
            `DELETE FROM doctor_patient WHERE patient_id = ${context.id};`
          );
          doctors.forEach(async c => {
            await knex.raw(
              `INSERT INTO doctor_patient (patient_id, doctor_id) ` +
              `VALUES (${context.id}, ${c});`
            );
          })
        }
        return context;
      }
    ],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [
      // get all doctors related to this patient
      async function(context) {
        // write our sql
        const sql = `SELECT d.id, d.email
                     FROM   doctor_patient dp, doctors d
                     WHERE  dp.doctor_id = d.id AND
                            dp.patient_id = ?`;
        // get the knex db client
        const knex = context.app.get('knexClient');
        // run our query
        const result = await knex.raw(sql, [context.id]);
        // add our results to the previous result
        context.result['doctors'] = result;
        return context;
      }
    ],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
