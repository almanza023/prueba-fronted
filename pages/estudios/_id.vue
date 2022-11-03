<template>
  <div>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="10">
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>DETALLES DE ESTUDIO</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-simple-table>
              <template v-slot:default>
                <tbody>
                  <tr>
                    <th class="text-left">NOMBRE PACIENTE</th>
                    <th class="text-left">
                      {{ estudio.paciente.full_name }}
                    </th>
                  </tr>
                  <tr>
                    <th class="text-left">IDENTIFICACION</th>
                    <th class="text-left">
                      {{ estudio.paciente.documento }}
                    </th>
                  </tr>
                  <tr>
                    <th class="text-left">RIPS</th>
                    <th class="text-left">
                      {{ estudio.rips }}
                    </th>
                  </tr>
                  <tr>
                    <th class="text-left">NOMBRE IMAGEN</th>
                    <th class="text-left">
                      {{ estudio.nombre }}
                    </th>
                  </tr>
                  <tr>
                    <th class="text-left">SERVICIO</th>
                    <th class="text-left">
                      {{ estudio.servicio }}
                    </th>
                  </tr>
                  <tr>
                    <th class="text-left">FECHA</th>
                    <th class="text-left">
                      {{ estudio.fecha }}
                    </th>
                  </tr>
                  <tr>
                    <th class="text-left">EPS</th>
                    <th class="text-left">
                      {{ estudio.paciente.eps_nombre }}
                    </th>
                  </tr>
                  <tr>
                    <th class="text-left">OBSERVACIONES</th>
                    <th class="text-left">
                      {{ estudio.observaciones }}
                    </th>
                  </tr>
                  <tr>
                    <th class="text-left">VER EN LINEA</th>
                    <th class="text-left">
                      <v-btn
                        :href="
                          'https://tdx.teleradiologia.com:3004/viewer/' +
                          estudio.url
                        "
                        target="_blank"
                        color="info"
                        block
                        class="mr-4"
                      >
                        VISOR WEB
                      </v-btn>
                      <a></a>
                    </th>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            <ImagenesEstudios :imagenes="estudio.imagenes"></ImagenesEstudios>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :disabled="!valid"
              color="success"
              block
              class="mr-4"
              @click="save()"
            >
              finalizar revision
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
    form: {
      user_id: "",
      estudio_id: "",
    },
  }),

  mounted() {
    this.form.user_id = localStorage.getItem("user_id");
    this.form.estudio_id = this.estudio.id;
    if (this.form.user_id == null) {
      window.$nuxt.$router.push("/");
    }
  },

  async asyncData({ $http, params }) {
    const res = await $http.get("/estudios/detalles/" + params.id);
    const estudio = await res.json();
    return { estudio: estudio.data };
  },

  methods: {
    async save() {
      try {
        this.$http
          .$post("estudios/finalizar", this.form)
          .then(function (response) {
            if (response.status == "success") {
              window.$nuxt.$swal.fire({
                text: response.data,
                icon: response.status,
                confirmButtonText: "Aceptar",
              });
              window.$nuxt.$router.back();
            } else {
              window.$nuxt.$swal.fire({
                text: "Se ha presentado un error al registrar la información",
                icon: response.status,
                confirmButtonText: "Aceptar",
              });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      } finally {
      }
    },
  },
};
</script>
