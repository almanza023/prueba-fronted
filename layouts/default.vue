<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" :clipped="clipped" fixed app primary>
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action >
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
         <v-list-item v-show="rol==1"
          v-for="(item, i) in itemsAdmin"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action >
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="logout">
          <v-list-item-action>
            <v-icon>mdi-logout-variant</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Cerrar Sesión</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app color="blue-grey lighten-4">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant"> </v-btn>

      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer />
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "DefaultLayout",
  data() {
    return {
      user_id: "",
      rol: "",
      clipped: true,
      drawer: true,
      fixed: false,
      items: [
        {
          icon: "mdi-apps",
          title: "Inicio",
          to: "/home",

        },
        {
          icon: "mdi-chart-bubble",
          title: "Estudios",
          to: "/estudios",
        },
        {
          icon: "mdi-chart-bubble",
          title: "Cargar Estudios",
          to: "/cargar",
        },
        {
          icon: "mdi-account",
          title: "Perfil",
          to: "/perfil",
        },
      ],
       itemsAdmin: [

        {
          icon: "mdi-chart-bubble",
          title: "Usuarios",
          to: "/usuarios",
          permiso:"1"
        },
        {
          icon: "mdi-chart-bubble",
          title: "Pacientes",
          to: "/pacientes",
          permiso:"1"
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "SISTEMA DE CARGUE DE IMAGENES RX",
    };
  },
  mounted() {
    this.user_id = localStorage.getItem("user_id");
    this.rol = localStorage.getItem("rol");
  },
  methods: {
    async logout() {
      await window.$nuxt.$swal
        .fire({
          title: "¿Esta seguro de cerrar la sesión?",
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: "Aceptar",
          denyButtonText: `Cancelar`,
        })
        .then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            try {
              this.$http
                .$post("/usuarios/logout")
                .then(function (response) {
                  localStorage.clear();
                  window.$nuxt.$router.push("/");
                })
                .catch(function (error) {
                  console.log(error);
                });
            } catch (error) {
              console.log(error);
            }
          } else if (result.isDenied) {
            return;
          }
        });
    },
  },
};
</script>
