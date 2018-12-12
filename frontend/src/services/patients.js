// import the patients service from feathers
import { patients } from "@/services/feathers";

/**
 * addPatient(patient)
 * 
 * This function will attempt to add a new patient to the 
 * database. In the event that there is a problem, an error
 * will be returned. Otherwise, the newly added patient 
 * object will be returned.
 * 
 * @param  {object} patient The patient to be created
 * @return {object}         The patient that was created
 */
export const addPatient = async patient => await patients.create(patient);

/**
 * getPatients(query)
 * 
 * This function will query the database and retrieve
 * a list of patients. For details on the syntax of
 * the `query` parameter, see the feathersjs documentation
 * for the `find()` function:
 * https://docs.feathersjs.com/api/databases/querying.html
 * 
 * @param  {object} query Any additional standard feathers params
 * @return {object}       A paginated feathers query result
 */
export const getPatients = async query => {
  // make sure the query parameter has a default value
  query = query || {};
  // execute and return the query results
  return await patients.find(query);
};

/**
 * getPatient(id, params)
 * 
 * This function gets a fully "hydrated" patient object, i.e.
 * in addition to the basic patient info (fn, ln, dob, gender, etc.),
 * it will also get all the doctor in which the patient is enrolled.
 * In other words it returns a patient along with all of its 
 * associated data.
 * 
 * @param  {number} id     The ID of the patient to be retrieved
 * @param  {object} params Any additional feathers query params
 * @return {object}        The hydrated patient object retrieved
 */
export const getPatient = async (id, params) => {
  // make sure a patient ID was specified
  if ("undefined" === typeof id) {
    throw new Error("Please provide a valid patient ID.");
  }
  params = params || {};
  return await patients.get(id, params);
};


/**
 * updatePatient(id, patient, params)
 * 
 * This function updates the data associated with a patient.
 * 
 * @param  {number} id      The ID of the patient to be retrieved
 * @param  {object} patient The patient data to be updated
 * @param  {object} params  Any additional feathers query params
 * @return {object}         The updated patient object
 */
export const updatePatient = async (id, patient, params) => {
  // make sure a patient ID was specified
  if ("undefined" === typeof id) {
    throw new Error("Please provide a valid patient ID.");
  }
  params = params || {};
  return await patients.patch(id, patient, params);
}