

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [
      // add related patients to the doctor_patient table
      async function(context) {
        if ("undefined" !== typeof context.data.patients) {
          // get the data we want to add to the join table
          const patients = context.data.patients;
          // remove the patients property from the data
          delete context.data.patients;
          // get the knex db client
          const knex = context.app.get('knexClient');
          // create the raw queries to modify doctor_patient
          await knex.raw(
            `DELETE FROM doctor_patient WHERE doctor_id = ${context.id};`
          );
          patients.forEach(async s => {
            await knex.raw(
              `INSERT INTO doctor_patient (doctor_id, patient_id) ` +
              `VALUES (${context.id}, ${s});`
            );
          })
        }
        return context;
      },
      // add related patients to the doctor_patient table
      async function(context) {
        if ("undefined" !== typeof context.data.patients) {
          // get the data we want to add to the join table
          const patients = context.data.patients;
          // remove the patients property from the data
          delete context.data.patients;
          // get the knex db client
          const knex = context.app.get('knexClient');
          // create the raw queries to modify doctor_patient
          await knex.raw(
            `DELETE FROM doctor_patient WHERE doctor_id = ${context.id};`
          );
          patients.forEach(async s => {
            await knex.raw(
              `INSERT INTO doctor_patient (doctor_id, patient_id) ` +
              `VALUES (${context.id}, ${s});`
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
      // get all patients related to this doctor
      async function(context) {
        // write our sql
        const sql = `SELECT p.id, p.first_name, p.last_name
                     FROM   doctor_patient dp, patients p
                     WHERE  dp.patient_id = p.id AND
                            dp.doctor_id = ?`;
        // get the db client (Express global)
        const knex = context.app.get('knexClient');
        // run our query
        const result = await knex.raw(sql, [context.id]);
        // add our results to the previous result
        context.result['patients'] = result;
        return context;
      },
      // get all patients related to this doctor
      async function(context) {
        // write our sql
        const sql = `SELECT p.id, p.first_name, p.last_name
                     FROM   doctor_patient dp, patients p
                     WHERE  dp.patient_id = p.id AND
                            dp.doctor_id = ?`;
        // get the db client (Express global)
        const knex = context.app.get('knexClient');
        // run our query
        const result = await knex.raw(sql, [context.id]);
        // add our results to the previous result
        context.result['patients'] = result;
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
