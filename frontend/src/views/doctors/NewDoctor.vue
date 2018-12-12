<template>
  <div class="container page">
    <h1>Add a New Doctor</h1>
    <v-alert
      v-if="creationError"
      v-model="creationError"
      dismissable
      type="warning"
      transition="fade-transition"
    >
      {{ creationError.email }} {{ creationError.name }}: {{ creationError.message }}
    </v-alert>
    <form>
      <v-text-field
        v-model="doctor.email"
        v-validate="{
          required: true,
          email: true,
          unique: true
        }"
        :counter="10"
        :error-messages="errors.collect('email')"
        label="Doctor Email (e.g. benton@er.com)"
        data-vv-name="email"
        required
      ></v-text-field>
      <v-text-field
        v-model="doctor.password"
        v-validate="'required|max:35'"
        :counter="35"
        :error-messages="errors.collect('password')"
        label="Doctor Password"
        data-vv-name="password"
        required
      ></v-text-field>
      <v-btn @click="submit" class="secondary">Submit</v-btn>
    </form>
  </div>
</template>

<script>
// import the necessary database service functions
import { addDoctor, getDoctors } from "@/services/doctors";
// configure the New Doctor component (i.e. this page)
export default {
  name: "NewDoctor",
  // variables defined for use in our template
  data: () => ({
    // the 'doctor' is a default blank doctor object that
    // receive the values in the form so we can create a 
    // new doctor in the database
    doctor: {
      email: "",
      password: "",
    },
    // this variable will be populated if there is an error
    // when we try to submit the doctor to the database, but
    // it defaults to `null`
    creationError: null,
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
  methods: {
    async submit() {
      // validate the form
      const valid = await this.$validator.validateAll();
      // if everthing is okay...
      if (valid) {
        try { // try to create the doctor in the database
          const doctor = await addDoctor(this.doctor);
          // then redirect back to the Doctors page with
          // a success message
          this.$router.replace({
            name: "doctors",
            query: {
              status: "success",
              message: `Success! The doctor "${doctor.email}: ` +
                `${doctor.password}" has been added to the database!`
            }
          });
        } catch(err) {
          // uh-oh! there was a problem creating the doctor
          this.creationError = err;
        }
      }
    }
  },
  mounted() {
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
      validate: value => {
        // query the database for a doctor with the email entered in the form.
        // if the number of returned results is NOT zero, then a doctor with
        // this email already exists in the database and we should return false.
        return getDoctors({ query: { email: value } })
          .then(res => res.data.length === 0);
      }
    }, { immediate: false });
  },
  // initialize Vee Validate
  $_veeValidate: {
    validator: "new"
  }
};
</script>
