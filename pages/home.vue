<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-jumbotron>
            <v-container fill-height>
              <v-layout align-center>
                <v-flex>
                  <h3 class="display-3">Bienvenido</h3>


                  <v-divider class="my-3"></v-divider>

                  <div class="title mb-3">
                    <v-img src="/logo.png"></v-img>
                  </div>

                  <nuxt-link to="/cargar">
                    <v-btn class="mx-0" color="primary" large>
                      CARGAR IMAGENES
                    </v-btn>
                  </nuxt-link>
                </v-flex>
              </v-layout>
            </v-container>
          </v-jumbotron>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
    };
  },
  beforeCreate() {
    let id_usuario = localStorage.getItem("user_id");
    console.log(id_usuario);
    if (id_usuario == null) {
      window.$nuxt.$router.push("/");
    }
  },

  methods: {},
};
</script>
