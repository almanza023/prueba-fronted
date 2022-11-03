<template>
  <v-data-table
    ref="tabla"
    :loading="loadingTabla"
    :headers="headers"
    :items="pacientes"
    :search="search"
    sort-by="nombre"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>MODULO PACIENTES</v-toolbar-title>
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
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
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
                    <v-form ref="form" v-model="valid" lazy-validation>
                      <v-text-field
                        v-model="editedItem.nombres"
                        label="Nombres"
                        :rules="[(v) => !!v || 'Campo Nombres es obligatorio']"
                        outlined
                      ></v-text-field>
                      <v-text-field
                        v-model="editedItem.apellidos"
                        :rules="[
                          (v) => !!v || 'Campo Apellidos es obligatorio',
                        ]"
                        label="Apellidos"
                        outlined
                      ></v-text-field>
                      <v-text-field
                        v-model="editedItem.tipo_doc"
                        type="text"
                        :rules="[
                          (v) => !!v || 'Campo Documento es obligatorio',
                        ]"
                        label="Tipo Documento"
                        outlined
                      ></v-text-field>
                      <v-text-field
                        v-model="editedItem.num_doc"
                        type="number"
                        :rules="[
                          (v) => !!v || 'Campo Documento es obligatorio',
                        ]"
                        label="N° Documento"
                        outlined
                      ></v-text-field>
                      <v-text-field
                        v-model="editedItem.fecha_nac"
                        type="date"
                        :rules="[
                          (v) => !!v || 'Campo Documento es obligatorio',
                        ]"
                        label="Fecha Nacimiento"
                        outlined
                      ></v-text-field>
                      <v-text-field
                        v-model="editedItem.sexo"
                        type="text"
                        :rules="[
                          (v) => !!v || 'Campo Documento es obligatorio',
                        ]"
                        label="Sexo"
                        outlined
                      ></v-text-field>
                      <v-text-field
                        v-model="editedItem.telefono"
                        type="number"
                        :rules="[(v) => !!v || 'Campo Telefono es obligatorio']"
                        label="Telefono"
                        outlined
                      ></v-text-field>
                      <v-text-field
                        v-model="editedItem.direccion"
                        type="text"
                        label="Dirección"
                        outlined
                      ></v-text-field>
                      <v-text-field
                        v-model="editedItem.correo"
                        type="email"
                        label="Correo"
                        outlined
                      ></v-text-field>
                      <v-text-field
                        v-model="editedItem.eps_cod"
                        type="text"
                        label="Código EPS"
                        outlined
                      ></v-text-field>
                      <v-text-field
                        v-model="editedItem.eps_nombre"
                        type="text"
                        :rules="[(v) => !!v || 'Campo es obligatorio']"
                        label="EPS"
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
              <v-btn color="blue darken-1" text @click="close">
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
              >¿Estás seguro de que quieres eliminar este registro?
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete"
                >Cancelar</v-btn
              >
              <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                >Aceptar</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
      <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize"> Resetear </v-btn>
    </template>
  </v-data-table>
</template>
<script>
export default {
  data: () => ({
    options: ["1", "2"],
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
        value: "full_name",
      },
      {
        text: "Identificación",
        align: "start",
        sortable: false,
        value: "documento",
      },
      {
        text: "EPS",
        align: "start",
        sortable: false,
        value: "eps_nombre",
      },
      {
        text: "Telefono",
        align: "start",
        sortable: false,
        value: "telefono",
      },
      { text: "Acciones", value: "actions", sortable: false },
    ],
    editedIndex: -1,
    editedItem: {
      id: "",
      nombres: "",
      apellidos: "",
      tipo_doc: "",
      num_doc: "",
      eps_codigo: "",
      eps_nombre: "",
      sexo: "",
      direccion: "",
      fecha_nac: "",
      correo: "",
      telefono: "",
      estado: "",
    },
    defaultItem: {
      id: "",
      nombres: "",
      apellidos: "",
      tipo_doc: "",
      num_doc: "",
      eps_codigo: "",
      eps_nombre: "",
      sexo: "",
      direccion: "",
      fecha_nac: "",
      correo: "",
      telefono: "",
      estado: "",
    },
  }),
  async asyncData({ $http }) {
    try {
      const res = await $http.get("pacientes");
      const pacientes = await res.json();

      return { pacientes: pacientes.data };
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
      this.editedItem = item.id;
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedItem = item.id;
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
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
      this.pacientes=[]
        try {
          let res = await this.$http.get("/pacientes");
          this.pacientes=await res.data
        } catch (error) {
           console.log(error)
        }
    },

    async save () {
         if(this.$refs.form.validate()){
        if (this.editedIndex > -1) {

        } else {
          try {
            this.$http.$post('pacientes/update', this.editedItem)
            .then(function (response) {
              if(response.status=="success"){
            window.$nuxt.$swal.fire({
                        text: response.data,
                        icon: response.status,
                        confirmButtonText: "Aceptar",
                      });
              }else{
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
          }
          finally {
          this.initialize()
          this.close()

          }
        }

        }
      },
  },
}
</script>
