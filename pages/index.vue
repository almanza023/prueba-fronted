<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card class="elevation-12">
        <v-toolbar dark color="primary">
          <v-toolbar-title>INICIO DE SESION</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-img src="/logo.png"></v-img>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="usuario.user_name"
              :rules="passwordReglas"
              icon=" mdi-person"
              name="login"
              @keyup.enter="login"
              outlined
              label="Usuario"
              type="email"
            ></v-text-field>
            <v-text-field
              v-model="usuario.password"
              :rules="passwordReglas"
              id="password"
              icon="lock"
              name="password"
              label="Contraseña"
              type="password"
              outlined
              @keyup.enter="login"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :disabled="!valid" color="primary" @click="login" block
            >INGRESAR</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  layout: "login",
  data: () => ({
    valid: false,
    usuario: {
      user_name: "",
      password: "",
    },
     emailRules: [
      (v) => !!v || "Correo es obligatorio",
      (v) => /.+@.+\..+/.test(v) || "Correo no es valido",
    ],
    password: "",
    passwordReglas: [(v) => !!v || "Campo es obligatorio"],
  }),

  beforeCreate() {
    let id_usuario = localStorage.getItem("user_id");
    if (id_usuario !=null) {
      window.$nuxt.$router.push("/home");
    }
  },

  methods: {
    async login() {
      if (!this.$refs.form.validate()) {
        return;
      }
      try {
        let datos = await this.$http.$post("/usuarios/login", this.usuario);
        if (datos.status == "success") {
          localStorage.setItem("user_id", datos.user_id);
          localStorage.setItem("rol", datos.rol);
          window.$nuxt.$swal.fire({
            title: "Ingreso!",
            text: "Ingreso Exitoso",
            icon: "success",
            confirmButtonText: "Aceptar",
          });
          window.$nuxt.$router.push("/home");
        }else{
           window.$nuxt.$swal.fire({
            title: "Mensaje!",
            text: "Error al ingresar correo o contraseña. Intente nuevamente",
            icon: "error",
            confirmButtonText: "Aceptar",
          });
        }
      } catch (error) {
        console.log(error);
        window.$nuxt.$swal.fire({
          title: "Ingreso!",
          text: "Error al procesar petición en el servidor",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    },
  },
};
</script>
