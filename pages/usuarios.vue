<template>
  <div>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="12" xl="12">
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>MODULO DE USUARIOS</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-data-table
              ref="tabla"
              :loading="loadingTabla"
              :headers="headers"
              :items="usuarios"
              :search="search"
              sort-by="nombre"
              class="elevation-1"
            >
              <template v-slot:top>
                <v-toolbar flat>
                  <v-divider class="mx-4" inset vertical></v-divider>
                  <v-spacer></v-spacer>
                  <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Buscar"
                    single-line
                    hide-details
                  ></v-text-field>
                  <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="primary"
                        dark
                        class="mb-2"
                        v-bind="attrs"
                        v-on="on"
                      >
                        Nuevo
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-title>
                        <span class="text-h5">{{ formTitle }}</span>
                      </v-card-title>

                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col cols="12" sm="12" md="12">
                              <v-form
                                ref="form"
                                v-model="valid"
                                lazy-validation
                              >
                                <v-text-field
                                  v-model="editedItem.name"
                                  label="Nombre"
                                  :rules="[
                                    (v) => !!v || 'Campo  es obligatorio',
                                  ]"
                                  outlined
                                ></v-text-field>
                                <v-text-field
                                  v-model="editedItem.user_name"
                                  :rules="[
                                    (v) => !!v || 'Campo  es obligatorio',
                                  ]"
                                  label="Usuario"
                                  outlined
                                ></v-text-field>
                                <v-text-field
                                  v-model="editedItem.email"
                                  type="email"
                                  :rules="[
                                    (v) => !!v || 'Campo  es obligatorio',
                                  ]"
                                  label="Correo"
                                  outlined
                                ></v-text-field>
                              <v-select
                                  v-model="editedItem.rol"
                                  :items="options"
                                  :item-text="'desc'"
                                  :item-value="'id'"
                                  label="Rol"
                                  :rules="[(v) => !!v || 'Debe seleccionar una opcion']"
                                  required
                                  single-line
                                  outlined
                                ></v-select>
                                <v-text-field
                                  v-show="editedIndex == -1"
                                  v-model="editedItem.password"
                                  type="password"
                                  label="Contraseña"
                                  :rules="[
                                    (v) => !!v || 'Campo  es obligatorio',
                                  ]"
                                  outlined
                                  required
                                ></v-text-field>
                                <v-text-field
                                  v-show="editedIndex >-1"
                                  v-model="editedItem.password"
                                  type="password"
                                  label="Contraseña"
                                  outlined
                                ></v-text-field>
                              </v-form>
                            </v-col>
                            <v-col cols="12" sm="6" md="4"> </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="danger" text @click="close">
                          Cancelar
                        </v-btn>
                        <v-btn
                          :disabled="!valid"
                          color="success"
                          class="mr-4"
                          @click="save"
                        >
                          Guardar
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                  <v-dialog v-model="dialogDelete" max-width="500px">
                    <v-card>
                      <v-card-title class="text-h5"
                        >¿Estás seguro de cambiar el estado de este registro?
                      </v-card-title>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="closeDelete"
                          >Cancelar</v-btn
                        >
                        <v-btn
                          color="blue darken-1"
                          text
                          @click="deleteItemConfirm"
                          >Aceptar</v-btn
                        >
                        <v-spacer></v-spacer>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-toolbar>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">
                  mdi-pencil
                </v-icon>
                <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
              </template>
              <template v-slot:no-data>
                <v-btn color="primary" @click="initialize"> Resetear </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  data: () => ({
    options: [{id:1, desc:"ADMINISTRADOR"}, {id:2, desc:"RX"}, {id:3, desc:"MEDICO"}],
    pacientes: [],
    valid: true,
    search: "",
    dialog: false,
    loadingTabla: true,
    dialogDelete: false,
    headers: [
      {
        text: "Nombre",
        align: "start",
        sortable: false,
        value: "name",
      },
      {
        text: "Usuario",
        align: "start",
        sortable: false,
        value: "user_name",
      },
      {
        text: "Correo",
        align: "start",
        sortable: false,
        value: "email",
      },
      {
        text: "Estado",
        align: "start",
        sortable: false,
        value: "estado",
      },
      { text: "Acciones", value: "actions", sortable: false },
    ],
    editedIndex: -1,
    editedItem: {
      id: "",
      name: "",
      user_name: "",
      email: "",
      password: "",
      rol: "",
      estado: "",
    },
  }),
  async asyncData({ $http }) {
    try {
      const res = await $http.get("usuarios");
      const usuarios = await res.json();
      return { usuarios: usuarios.data };
    } catch (error) {
      return { error };
    }
  },
  async created() {
    this.loadingTabla = false;
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo" : "Editar";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

    beforeCreate() {
    let id_usuario = localStorage.getItem("user_id");
    let rol = localStorage.getItem("rol");
    console.log(id_usuario);
    if ((id_usuario == null)) {
      window.$nuxt.$router.push("/");
    }
    if ((rol != 1)) {
      window.$nuxt.$router.push("/home");
    }
  },

  methods: {
    editItem(item) {
      this.editedIndex = item.id;
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = item.id;
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;

    },

    async deleteItemConfirm() {
       try {
           let response = await this.$http.$get("usuarios/cambiar/estado/" + this.editedIndex)
              if (response.status == "success") {
                window.$nuxt.$swal.fire({
                  text: response.data,
                  icon: response.status,
                  confirmButtonText: "Aceptar",
                });
              } else {
                window.$nuxt.$swal.fire({
                  text: "Se ha presentado un error al actualizar la información",
                  icon: response.status,
                  confirmButtonText: "Aceptar",
                });
              }
        } catch (error) {
          console.log(error);
        } finally {
          this.close();
          this.initialize();
        }
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async initialize() {

      try {
        let res = await this.$http.get("/usuarios");
        this.usuarios = await res.data;

      } catch (error) {
        console.log(error);
      }

    },

    async save() {
      if (this.$refs.form.validate()) {
        if (this.editedIndex == -1) {
          try {
            let response =await this.$http.$post("usuarios/register", this.editedItem)
                if (response.status == "success") {
                  window.$nuxt.$swal.fire({
                    text: response.data,
                    icon: response.status,
                    confirmButtonText: "Aceptar",
                  });
                } else {
                  window.$nuxt.$swal.fire({
                    text: "Se ha presentado un error al registrar la información",
                    icon: response.status,
                    confirmButtonText: "Aceptar",
                  });
                }
          } catch (error) {
            console.log(error);
          } finally {

            this.close();
          }
           window.$nuxt.$router.push("/usuarios");
        } else {
          try {
            let response = await this.$http.$post("usuarios/update", this.editedItem)
                if (response.status == "success") {
                  window.$nuxt.$swal.fire({
                    text: response.data,
                    icon: response.status,
                    confirmButtonText: "Aceptar",
                  });
                } else {
                  window.$nuxt.$swal.fire({
                    text: "Se ha presentado un error al registrar la información",
                    icon: response.status,
                    confirmButtonText: "Aceptar",
                  });
                }
          } catch (error) {
            console.log(error);
          } finally {
            this.initialize()
            this.close();
          }
        }
      }
    },
  },
};
</script>
