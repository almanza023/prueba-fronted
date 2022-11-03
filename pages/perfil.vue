<template>
  <div>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="10">
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>ACTUALIZACION DATOS DE USUARIO</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="usuario.user_name"
                :rules="regla"
                label="Usuario"
                outlined
                required
              ></v-text-field>

              <v-text-field
                v-model="usuario.email"
                :rules="emailRules"
                label="Correo"
                outlined
                required
              ></v-text-field>

              <v-text-field
                v-model="usuario.password1"
                :rules="regla"
                label="Contraseña"
                type="password"
                outlined
                required
              ></v-text-field>

              <v-text-field
                v-model="usuario.password2"
                :rules="regla"
                label="Confirmar COntraseña"
                type="password"
                outlined
                required
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :disabled="!valid"
              color="success"
              block
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
  data: () => ({
    valid: true,
    usuario: {
      id: "",
      user_name: "",
      email: "",
      password1: "",
      password2: "",
    },
    regla: [(v) => !!v || "Campo es obligatorio"],
    email: "",
    emailRules: [
      (v) => !!v || "Correo es obligatorio",
      (v) => /.+@.+\..+/.test(v) || "Correo no es valido",
    ],
  }),

  mounted() {
    let id_usuario = localStorage.getItem("user_id");
    console.log(id_usuario);
    if (id_usuario == null) {
      window.$nuxt.$router.push("/");
    }
  },

  async asyncData({ $http }) {
    const id = localStorage.getItem("user_id");
    const res = await $http.get("/usuarios/" + id);
    const usuario = await res.json();
    return { usuario: usuario.data };
  },

  methods: {
    validarPassword(pass1, pass2) {
      if (pass1 != pass2) {
        return true;
      }
      return false;
    },
    async store() {
      if (!this.$refs.form.validate()) {
        return;
      }
      if (
        this.validarPassword(this.usuario.password1, this.usuario.password2)
      ) {
        window.$nuxt.$swal.fire({
          title: "Mensaje!",
          text: "Las contraseñas no coinciden",
          icon: "warning",
          confirmButtonText: "Aceptar",
        });
        return;
      }

      try {
        this.usuario.id = localStorage.getItem("user_id");
        let datos = await this.$http.$post("/usuarios/perfil", this.usuario);
        if (datos.status == "success") {
          window.$nuxt.$swal.fire({
            text: datos.data,
            icon: datos.status,
            confirmButtonText: "Aceptar",
          });
          window.$nuxt.$router.push("/home");
        } else {
          window.$nuxt.$swal.fire({
            text: "Error al actualizar datos",
            icon: datos.status,
            confirmButtonText: "Aceptar",
          });
          window.$nuxt.$router.push("/home");
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
