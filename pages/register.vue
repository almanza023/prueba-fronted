<template>
  <div>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="10">
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>REGISTRO DE USUARIOS</v-toolbar-title>
          </v-toolbar>
          <v-card-text>

          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :disabled="!valid"
              block
              color="success"
              class="mr-4"
              @click="store"
            >
              Guardar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  layout: "login",
  data: () => ({
    valid: true,
    usuario: {
      name: "",
      email: "",
      user_name: "",
      password: "",
      password2: "",
    },
    regla: [(v) => !!v || "Campo es obligatorio"],
    email: "",
    emailRules: [
      (v) => !!v || "Correo es obligatorio",
      (v) => /.+@.+\..+/.test(v) || "Correo no es valido",
    ],
  }),

  methods: {
    validarPassword(pas1, pas2) {
      if (pas1 != pas2) {
        return true;
      }
      return false;
    },


    async store() {
      if (!this.$refs.form.validate()) {
        return;
      }
      if (this.validarPassword(this.usuario.password, this.usuario.password2)) {
        window.$nuxt.$swal.fire({
          title: "Mensaje!",
          text: "Las contraseñas ingresadas NO coinciden",
          icon: "warning",
          confirmButtonText: "Aceptar",
        });
        return;
      }

      try {
        let datos = await this.$http.$post("/usuarios/register", this.usuario);
        if (datos.user_id != "") {
          window.$nuxt.$swal.fire({
            title: "Mensaje!",
            text: "Datos registrados exitosamente",
            icon: "success",
            confirmButtonText: "Aceptar",
          });
          window.$nuxt.$router.push("/");
        }
      } catch (error) {
        console.log(error);
        window.$nuxt.$swal.fire({
          title: "Mensaje!",
          text: "Error al procesar petición en el servidor",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
  },
};
</script>
