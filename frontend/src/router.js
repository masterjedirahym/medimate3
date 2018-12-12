import Vue        from "vue";
import Router     from "vue-router";
import Home       from "@/views/Home.vue";
import About      from "@/views/About.vue";
import Doctors    from "@/views/doctors/Doctors.vue";
import Doctor     from "@/views/doctors/Doctor.vue";
import NewDoctor  from "@/views/doctors/NewDoctor.vue";
import Patients   from "@/views/patients/Patients.vue";
import Patient    from "@/views/patients/Patient.vue";
import NewPatient from "@/views/patients/NewPatient.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      meta: {
        icon: "home",
        breadcrumbs: []
      }
    },
    {
      path: "/about",
      name: "about",
      component: About,
      meta: {
        icon: "info",
        breadcrumbs: [
          { text: "Home", href: "/" }
        ]
      }
    },
    {
      path: "/doctors",
      name: "doctors",
      component: Doctors,
      meta: {
        icon: "school",
        breadcrumbs: [
          { text: "Home", href: "/" }
        ]
      }
    },
    {
      path: "/doctors/new",
      name: "new-doctor",
      component: NewDoctor,
      meta: {
        breadcrumbs: [
          { text: "Home", href: "/" },
          { text: "Doctors", href: "/doctors" }
        ]
      }
    },
    {
      path: "/doctors/:id",
      name: "doctor",
      component: Doctor,
      meta: {
        breadcrumbs: [
          { text: "Home", href: "/" },
          { text: "Doctors", href: "/doctors" }
        ]
      }
    },
    {
      path: "/patients",
      name: "patients",
      component: Patients,
      meta: {
        icon: "group",
        breadcrumbs: [
          { text: "Home", href: "/" }
        ]
      }
    },
    {
      path: "/patients/new",
      name: "new-patient",
      component: NewPatient,
      meta: {
        breadcrumbs: [
          { text: "Home", href: "/" },
          { text: "Patients", href: "/patients" }
        ]
      }
    },
    {
      path: "/patients/:id",
      name: "patient",
      component: Patient,
      meta: {
        breadcrumbs: [
          { text: "Home", href: "/" },
          { text: "Patients", href: "/patients" }
        ]
      }
    },
  ]
});
