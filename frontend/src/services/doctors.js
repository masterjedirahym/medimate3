// import the doctors service from feathers
import { doctors } from "@/services/feathers";

/**
 * addDoctor(doctor)
 * 
 * This function will attempt to add a new doctor to the 
 * database. In the event that there is a problem, e.g.
 * a doctor with the same `code` already exists, an error
 * will be returned. Otherwise, the newly added doctor 
 * object will be returned.
 * 
 * @param  {object} doctor The doctor to be created
 * @return {object}        The doctor that was created
 */
export const addDoctor = async doctor => await doctors.create(doctor);

/**
 * getDoctors(query)
 * 
 * This function will query the database and retrieve
 * a list of doctors. For details on the syntax of
 * the `query` parameter, see the feathersjs documentation
 * for the `find()` function:
 * https://docs.feathersjs.com/api/databases/querying.html
 * 
 * @param  {object} query Any additional standard feathers params
 * @return {object}       A paginated feathers query result
 */
export const getDoctors = async query => {
  // make sure the query parameter has a default value
  query = query || {};
  // execute and return the query results
  return await doctors.find(query);
};

/**
 * getDoctor(id, params)
 * 
 * This function gets a fully "hydrated" doctor object, i.e.
 * in addition to the basic doctor info (title, difficulty),
 * it will also get all the patients enrolled and the subjects
 * with which the doctor is associated. In other words it 
 * returns a doctor along with all of its associated data.
 * 
 * @param  {number} id     The ID of the doctor to be retrieved
 * @param  {object} params Any additional feathers query params
 * @return {object}        The hydrated doctor object retrieved
 */
export const getDoctor = async (id, params) => {
  // make sure a doctor ID was specified
  if ("undefined" === typeof id) {
    throw new Error("Please provide a valid doctor ID.");
  }
  params = params || {};
  return await doctors.get(id, params);
};


/**
 * updateDoctor(id, doctor, params)
 * 
 * This function updates the data associated with a doctor.
 * 
 * @param  {number} id     The ID of the doctor to be retrieved
 * @param  {object} doctor The doctor data to be updated
 * @param  {object} params Any additional feathers query params
 * @return {object}        The updated doctor object
 */
export const updateDoctor = async (id, doctor, params) => {
  // make sure a doctor ID was specified
  if ("undefined" === typeof id) {
    throw new Error("Please provide a valid doctor ID.");
  }
  params = params || {};
  return await doctors.patch(id, doctor, params);
}