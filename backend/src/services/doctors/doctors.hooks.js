

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [
      // add related students to the courses_students table
      async function(context) {
        if ("undefined" !== typeof context.data.patients) {
          // get the data we want to add to the join table
          const patients = context.data.patients;
          // remove the students property from the data
          delete context.data.patients;
          // get the knex db client
          const knex = context.app.get('knexClient');
          // create the raw queries to modify courses_students
          await knex.raw(
            `DELETE FROM doctors_patients WHERE doc_id = ${context.id};`
          );
          students.forEach(async s => {
            await knex.raw(
              `INSERT INTO doctors_patients (doc_id, id) ` +
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
      async function(context) {
        // write our sql
        const sql = `SELECT s.id, s.first_name, s.last_name
                     FROM   doctors_patients cs, patients s
                     WHERE  cs.id = s.id AND
                            cs.doc_id = ?`;
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
