<template>
  <div class="container page">
    <h1>Add a New Patient</h1>
    <v-alert
      v-if="apiError"
      v-model="apiError"
      dismissable
      type="warning"
      transition="fade-transition"
    >
      {{ apiError.email }} {{ apiError.name }}: {{ apiError.message }}
    </v-alert>
    <form>
      <v-text-field
        v-model="patient.first_name"
        v-validate="'required'"
        :error-messages="errors.collect('first_name')"
        label="First Name*"
        data-vv-name="first_name"
        required
      ></v-text-field>
      <v-text-field
        v-model="patient.last_name"
        v-validate="'required'"
        :error-messages="errors.collect('last_name')"
        label="Last Name*"
        data-vv-name="last_name"
        required
      ></v-text-field>
      <v-text-field
        v-model="patient.gender"
        label="Gender"
      ></v-text-field>
      <v-btn @click="submit" class="secondary">Submit</v-btn>
    </form>
  </div>
</template>

<script>
// import the necessary database service functions
import { addPatient } from "@/services/patients";
// configure the Patient component (i.e. this page)
export default {
  name: "NewPatient",
  // variables defined for use in our template
  data: () => ({
    // the 'patient' is a default blank patient object that
    // receive the values in the form so we can create a 
    // new patient in the database
    patient: {
      first_name: "",
      last_name: "",
      gender: ""
    },
    // controls default visibility for the SSN field and date picker
    show_ssn: false,
    modal: false,
    // this variable will be populated if there is an error
    // when we try to submit something to the database, but
    // it defaults to `null`
    apiError: null,
    // the 'dictionary' provides additional configuration info
    // to Vee Validate, including customized error messages
    dictionary: {
      // the 'attributes' tells Vee Validate to use the prettier
      // string to refer to the form field in error messages
      attributes: {
        first_name: "First Name",
        last_name: "Last Name",
        gender: "Gender"
      },
    }
  }),
  methods: {
    async submit() {
      // validate the form
      const valid = await this.$validator.validateAll();
      // if everthing is okay...
      if (valid) {
        try { // try to add the patient to the database
          const patient = await addPatient(this.patient);
          // then redirect back to the Patients page with
          // a success message
          this.$router.replace({
            name: "patients",
            query: {
              status: "success",
              message: `Success! The patient ${patient.first_name} ` +
                `${patient.last_name} has been added!`
            }
          });
        } catch(err) {
          // uh-oh! there was a problem updating the patient
          this.apiError = err;
        }
      }
    }
  },
  async mounted() {
    // tell Vee Validate to use our custom dictionary
    this.$validator.localize("en", this.dictionary);
  },
  // initialize Vee Validate
  $_veeValidate: {
    validator: "new"
  }
};
</script>
