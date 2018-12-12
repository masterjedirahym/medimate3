<template>
  <div class="container page">
    <h1>Doctors</h1>
    <v-alert
      v-if="alert"
      v-model="alert"
      dismissible
      :type="alert.status"
      transition="fade-transition"
    >
      {{ alert.message }}
    </v-alert>
    <p>
      <v-btn large color="secondary" :to="'/doctors/new'">
        <v-icon left dark>add</v-icon>
        Add New Doctor
      </v-btn>
    </p>
    <v-card>
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="doctors.data"
        item-key="id"
        :total-items="doctors.total"
        select-all
        :pagination.sync="pagination"
        :rows-per-page-items="rowsPerPageItems"
        must-sort
      >
        <template slot="items" slot-scope="props">
          <tr :active="props.selected" @click="props.selected = !props.selected">
            <td>
              <v-checkbox
                v-model="props.selected"
                primary
                hide-details
              ></v-checkbox>
            </td>
            <td>
              <router-link :to="`/doctors/${props.item.id}`">
                {{ props.item.email }}
              </router-link>
            </td>
            <td>{{ props.item.password }}</td>
          </tr>
        </template>
      </v-data-table>
      <v-container fluid>
        <v-layout row justify-space-around align-top>
          <v-flex xs5>
            <v-select
              v-model="patient"
              class="item"
              label="Pick a Patient"
              item-text="name"
              item-value="id"
              item-key="id"
              :items="patients"
              solo
              clearable
            ></v-select>
          </v-flex>
          <v-flex xs5>
            <v-btn
              class="secondary item"
              large block
              :disabled="allowPatientAssociation"
              @click="associateDoctorsWithPatient"
            >Add Selected Doctors to Patient</v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import { getDoctors } from "@/services/doctors";
import { getPatients, updatePatient } from "@/services/patients";
export default {
  name: "Doctors",
  data: () => ({
    doctors: {
      total: 0,
      data: []
    },
    selected: [],
    patient: null,
    rowsPerPageItems: [10, 25, 50],
    pagination: {
      descending: false,
      page: 1,
      rowsPerPage: 10,
      sortBy: "email",
      totalItems: 0
    },
    headers: [
      {
        text: "Email",
        value: "email"
      },
      {
        text: "Password",
        value: "password"
      }
    ],
    alert: null
  }),
  asyncComputed: {
    doctors: {
      async get() {
        let query = {
          $limit: this.pagination.rowsPerPage,
          $skip: (this.pagination.page - 1) * this.pagination.rowsPerPage,
          $sort: {
            [this.pagination.sortBy]:  this.pagination.descending ? -1 : 1
          }
        };
        return await getDoctors({ query });
      },
      default: {
        total: 0,
        data: []
      }
    },
    patients: {
      async get() {
        let patis = await getPatients({query:{$limit: 50, $sort:{last_name: 1}}});
        patis = patis.data.map(s => Object.assign(s, {name: `${s.first_name} ${s.last_name}`}));
        return patis;
      },
      default: []
    },
  },  
  computed: {
    allowPatientAssociation() {
      return !this.patient || this.selected.length == 0;
    }
  },
  methods: {
    async associateDoctorsWithPatient() {
      let pati = this.patients.filter(s => s.id === this.patient)[0];
      pati.doctors = this.selected.map(c => c.id);
      // remove the temporary "name" field
      delete pati.name;
      let res;
      try {
        res = await updatePatient(pati.id, pati);
        res = {
          status: 'success',
          message: `Success! Selected doctor(s) added to ${res.first_name}'s profile!`
        };
      } catch(err) {
        res = err;
      }
      this.alert = res;      
    }
  },
  async mounted() {
    const query = await this.$route.query;
    this.alert = query.status ? query : null;
  }
}
</script>
