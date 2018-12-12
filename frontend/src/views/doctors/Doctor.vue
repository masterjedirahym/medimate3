<template>
  <div class="container page">
    <h1>{{ doctor.email }}: {{ doctor.password }}</h1>
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
        v-model="doctor.email"
        v-validate="{
          required: true,
          regex:/[A-Z]{2,5}\s\d{3}[A-Z]?/,
          unique: {
            doctor_id: doctor.id
          }
        }"
        :counter="10"
        :error-messages="errors.collect('email')"
        label="Doctor"
        data-vv-name="email"
        data-vv-validate-on="change"
        required
      ></v-text-field>
      <v-text-field
        v-model="doctor.password"
        v-validate="'required|max:35'"
        :counter="35"
        :error-messages="errors.collect('password')"
        label="Doctor Password (e.g. Software Development)"
        data-vv-name="password"
        required
      ></v-text-field>
      <v-select
        v-validate="'required'"
        v-model="doctor.id"
        :error-messages="errors.collect('id')"
        label="Doctor ID"
        data-vv-name="id"
        required
      ></v-select>
      <v-btn :disabled="!edited" @click="submit" class="secondary">Submit</v-btn>
    </form>
    <v-container grid-list-md text-xs-center>
    <v-layout row mt-4>
      <v-flex xs6>
        <v-card>
          <v-toolbar color="secondary" dark>
            <v-toolbar-title>Patients</v-toolbar-title>
          </v-toolbar>
          <v-list two-line>
            <template v-for="patient in doctor.patients">
              <v-list-tile
                :key="patient.id"
                avatar
                @click="$router.push('/patients/' + patient.id)"
              >
                <v-list-tile-avatar>
                  <v-icon>school</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title v-html="`${patient.first_name} ${patient.last_name}`"></v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-divider :key="patient.id + 'd'"></v-divider>
            </template>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
    </v-container>
  </div>
</template>

<script>
// import the necessary database service functions
import { getDoctor, getDoctors, updateDoctor } from "@/services/doctors";
// configure the Doctor component (i.e. this page)
export default {
  name: "Doctor",
  // variables defined for use in our template
  data: () => ({
    // the 'doctor' is a default blank doctor object that
    // receive the values in the form so we can create a 
    // new doctor in the database
    doctor: {
      email: "",
      password: "",
      id: null
    },
    // this variable will be populated if there is an error
    // when we try to submit something to the database, but
    // it defaults to `null`
    apiError: null,
    // these are the values that show up in the dropdown
    // menu for Doctor ID
    // the 'dictionary' provides additional configuration info
    // to Vee Validate, including customized error messages
    dictionary: {
      // the 'attributes' tells Vee Validate to use the prettier
      // string to refer to the form field in error messages
      attributes: {
        email: "Doctor Email",
        password: "Doctor Password",
        id: "Doctor ID"
      },
      // the 'custom' property is where we define custom error
      // messages; most of the time this is not strictly
      // necessary as Vee Validate comes with useful default
      // error messages out of the box.
      custom: {
        email: {
          regex: () => {
            return (
              `The Doctor Email must be ALL-CAPS, start with a
               2-5 character department identifier (e.g. ISAT),
               followed by a space, followed by a 3-digit number,
               followed optionally by a single letter (e.g. "H"
               for honors doctors).`
            );
          }
        },
        password: {
          max: "The Doctor Password can be at most 35 characters long."
        }
      }
    }
  }),
  computed: {
    edited() {
      return Object.keys(this.fields).some(key => this.fields[key].dirty);
    }
  },
  methods: {
    async submit() {
      // validate the form
      const valid = await this.$validator.validateAll();
      // if everthing is okay...
      if (valid) {
        try { // try to update the doctor in the database
          const doctor = await updateDoctor(this.doctor.id, this.doctor);
          // then redirect back to the Doctors page with
          // a success message
          this.$router.replace({
            name: "doctors",
            query: {
              status: "success",
              message: `Success! The doctor "${doctor.email}: ` +
                `${doctor.password}" has been updated!`
            }
          });
        } catch(err) {
          // uh-oh! there was a problem creating the doctor
          this.apiError = err;
        }
      }
    }
  },
  async mounted() {
    // load the doctor
    try {
      this.doctor = await getDoctor(this.$route.params.id);
    } catch(err) {
      this.apiError = err;
    }
    // tell Vee Validate to use our custom dictionary
    this.$validator.localize("en", this.dictionary);
    // below is a custom validator that will check the database
    // to make sure that the Doctor Email is unique BEFORE we are
    // allowed to submit this form; using custom validators like
    // this is an advanced technique but can greatly improve the
    // user experience as well as the data integrity of your app.
    this.$validator.extend("unique", {
      getMessage: field => 
        `This ${field} already exists in the database. It must be unique.`,
      validate(value, {doctor_id}) {
        // query the database for a doctor with the email entered in the form.
        // if the number of returned results is NOT zero, then a doctor with
        // this email already exists in the database and we should return false.
        return getDoctors({
          query: {
            email: value,
            id: { $ne: doctor_id } // exclude the current doctor from the query
          }
        })
        .then(res => res.data.length === 0);
      }
    }, {
      immediate: false,
      paramNames: ["doctor_id"]
    });
  },
  // initialize Vee Validate
  $_veeValidate: {
    validator: "new"
  }
};
</script>
