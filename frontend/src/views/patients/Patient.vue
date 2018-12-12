<template>
  <div class="container page">
    <h1>{{ name }}</h1>
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
        v-model="patient.middle_initial"
        v-validate="{ max: 1, regex: /[A-Z]/ }"
        :error-messages="errors.collect('middle_initial')"
        label="Middle Initial"
        data-vv-name="middle_initial"
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
        v-model="patient.ssn"
        :append-icon="show_ssn ? 'visibility_off' : 'visibility'"
        v-validate="{ required: true, regex: /\d{9}/ }"
        :type="show_ssn ? 'text' : 'password'"
        label="Social Security Number*"
        data-vv-name="ssn"
        hint="Numbers only (no dashes)"
        :counter="9"
        @click:append="show_ssn = !show_ssn"
        required
      ></v-text-field>
      <v-dialog
        ref="dialog"
        v-model="modal"
        :return-value.sync="patient.dob"
        persistent
        lazy
        full-width
        width="290px"
      >
        <v-text-field
          slot="activator"
          v-model="patient.dob"
          label="Birth Date"
          prepend-icon="event"
          readonly
        ></v-text-field>
        <v-date-picker v-model="patient.dob" scrollable>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="modal = false">Cancel</v-btn>
          <v-btn flat color="primary" @click="$refs.dialog.save(patient.dob)">OK</v-btn>
        </v-date-picker>
      </v-dialog>
      <v-text-field
        v-model="patient.address"
        v-validate="'required'"
        :error-messages="errors.collect('address')"
        label="Address (e.g. Street, City, State)*"
        data-vv-name="address"
        required
      ></v-text-field>
      <v-text-field
        v-model="patient.zip"
        v-validate="{ required: true, regex: /\d{5}/ }"
        :counter="5"
        :error-messages="errors.collect('zip')"
        label="Zip Code (5-digit)*"
        data-vv-name="zip"
        required
      ></v-text-field>
      <v-text-field
        v-model="patient.phone"
        v-validate="{ required: true, regex:/\d{10}/ }"
        :counter="10"
        mask="phone"
        :error-messages="errors.collect('phone')"
        label="Phone Number (10-digit)*"
        data-vv-name="phone"
        required
      ></v-text-field>
      <v-text-field
        v-model="patient.gender"
        label="Gender"
      ></v-text-field>
      <v-btn :disabled="!edited" @click="submit" class="secondary">Submit</v-btn>
    </form>
    <v-layout row mt-4>
      <v-flex xs12 sm6>
        <v-card>
          <v-toolbar color="secondary" dark>
            <v-toolbar-title>Doctors</v-toolbar-title>
          </v-toolbar>
          <v-list two-line>
            <template v-for="doctor in patient.doctors">
              <v-list-tile
                :key="doctor.id"
                avatar
                @click="$router.push('/doctors/' + doctor.id)"
              >
                <v-list-tile-avatar>
                  <v-icon>school</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title v-html="doctor.email"></v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-divider :key="doctor.id + 'd'"></v-divider>
            </template>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
// import the necessary database service functions
import { getPatient, updatePatient } from "@/services/patients";
// configure the Patient component (i.e. this page)
export default {
  name: "Patient",
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
  computed: {
    edited() {
      return Object.keys(this.fields).some(key => this.fields[key].dirty);
    },
    name() {
      return `${this.patient.first_name} ${mi}${this.patient.last_name}`;
    }
  },
  methods: {
    async submit() {
      // validate the form
      const valid = await this.$validator.validateAll();
      // if everthing is okay...
      if (valid) {
        try { // try to update the patient in the database
          const patient = await updatePatient(this.patient.id, this.patient);
          // then redirect back to the Patients page with
          // a success message
          this.$router.replace({
            name: "patients",
            query: {
              status: "success",
              message: `Success! The patient ${patient.first_name} ` +
                `${patient.last_name} has been updated!`
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
    // load the patient
    try {
      this.patient = await getPatient(this.$route.params.id);
    } catch(err) {
      this.apiError = err;
    }
    // tell Vee Validate to use our custom dictionary
    this.$validator.localize("en", this.dictionary);
  },
  // initialize Vee Validate
  $_veeValidate: {
    validator: "new"
  }
};
</script>
