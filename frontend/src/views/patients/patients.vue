<template>
  <div class="container page">
    <h1>Patients</h1>
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
      <v-btn large color="secondary" :to="'/patients/new'">
        <v-icon left dark>person_add</v-icon>
        Add New Patient
      </v-btn>
    </p>
    <v-card>
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="patients.data"
        select-all
        item-key="id"
        :total-items="patients.total"
        :pagination.sync="pagination"
        :rows-per-page-items="rowsPerPageItems"
        must-sort>
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
              <router-link :to="`/patients/${props.item.id}`">
                {{ props.item.first_name }} {{ props.item.last_name }}
              </router-link>
            </td>
            <td>{{ props.item.gender }}</td>
          </tr>
        </template>
      </v-data-table>
      <v-container fluid>
        <v-layout row justify-space-around align-top>
          <v-flex xs5>
            <v-select
              v-model="doctor"
              class="item"
              label="Pick a Doctor"
              item-text="email"
              item-value="id"
              item-key="id"
              :items="doctors"
              solo
              clearable
            ></v-select>
          </v-flex>
          <v-flex xs5>
            <v-btn
              class="secondary item"
              large block
              :disabled="allowDoctorAssociation"
              @click="associatePatientsWithDoctor"
            >Add Selected Patients to Doctor</v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import { getPatients } from "@/services/patients";
import { getDoctors, updateDoctor } from "@/services/doctors";
export default {
  name: "Patients",
  data: () => ({
    patients: {
      total: 0,
      data: []
    },
    selected: [],
    doctor: null,
    rowsPerPageItems: [10, 25, 50],
    pagination: {
      descending: false,
      page: 1,
      rowsPerPage: 10,
      sortBy: "last_name",
      totalItems: 0
    },
    headers: [
      {
        text: "Name",
        value: "last_name"
      },
      {
        text: "Gender",
        value: "gender"
      }
    ],
    alert: null
  }),
  asyncComputed: {
    patients: {
      async get() {
        let query = {
          $limit: this.pagination.rowsPerPage,
          $skip: (this.pagination.page - 1) * this.pagination.rowsPerPage,
          $sort: {
            [this.pagination.sortBy]:  this.pagination.descending ? -1 : 1
          }
        };
        return await getPatients({ query });
      },
      default: {
        total: 0,
        data: []
      }
    },
    doctors: {
      async get() {
        let c = await getDoctors({query:{$limit: 50, $sort:{email: 1}}});
        return c.data;
      },
      default: []
    }
  },
  computed: {
    allowDoctorAssociation() {
      return !this.doctor || this.selected.length == 0;
    }
  },
  methods: {
    async associatePatientsWithDoctor() {
      let crs = this.doctors.filter(s => s.id === this.doctor)[0];
      crs.patients = this.selected.map(c => c.id);
      let res;
      try {
        res = await updateDoctor(crs.id, crs);
        res = {
          status: 'success',
          message: `Success! Selected patients(s) added to ${res.email}!`
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
