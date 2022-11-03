<template>
  <div>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="6" md="12">
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>CONSULTAR ESTUDIOS </v-toolbar-title>
          </v-toolbar>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-card-text>
              <v-text-field
                v-model="form.fecha1"
                type="date"
                label="Fecha Inicio"
                outlined
                required
              ></v-text-field>
              <v-text-field
                v-model="form.fecha2"
                label="Fecha Final"
                outlined
                type="date"
                @keyup.enter="getDatos"
                required
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                :disabled="!valid"
                block
                color="success"
                class="mr-4"
                @click="getDatos()"
              >
                CONSULTAR
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

    <v-row justify="center" align="center" v-show="mostrar">
      <v-col cols="12" sm="6" md="12">
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>DETALLES DE ESTUDIOS </v-toolbar-title>
          </v-toolbar>
          <ConfirmDlg ref="confirm" />
          <v-data-table
            :headers="headers"
            :items="items"
            :items-per-page="10"
            :search="search"
            class="elevation-1"
          >
            <template v-slot:top>
              <v-text-field
                v-model="search"
                label="Buscar"
                class="mx-4"
              ></v-text-field>
            </template>
            <template v-slot:item.action="{ item }">
             <nuxt-link :to="'estudios/' + item.id">
               <v-icon small class="mr-2">
                  mdi-pencil
                </v-icon>
             </nuxt-link>
                <v-icon small @click="delRecord(item.id)" color="red"> mdi-delete </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
        </v-card>
      </v-col>
    </v-row>



<script>
export default {
  data() {
    return {
      search: "",
      valid:false,
      mostrar: false,
      items:[],
      headers: [
        {
          text: "PACIENTE",
          align: "left",
          sortable: true,
          value: "paciente.full_name",
        },
        { text: "IDENTIFICACION", value: "paciente.documento" },
        { text: "NOMBRE", value: "nombre" },
        { text: "N° RIPS", value: "rips" },
        { text: "SERVICIO", value: "servicio" },
        { text: "FECHA", value: "fecha" },
        { text: "REVISADO", value: "revision" },
        { text: "", value: "action" },
      ],
      form: {
        fecha1: "",
        fecha2: "",
      },
    };
  },
  mounted(){
    let fechaActual = new Date().toISOString().slice(0, 10);
    this.form.fecha1=fechaActual;
    this.form.fecha2=fechaActual;
  },
  methods: {
      async getDatos() {
      try {
        let respuesta = await this.$http.$post(
          "estudios/buscar",
          this.form
        );
        if (respuesta.status == "success") {
          this.items = await respuesta.data;
           this.mostrar = true;
        } else {
          window.$nuxt.$swal.fire({
            text:respuesta.data,
            icon: respuesta.status,
            confirmButtonText: "Aceptar",
          });
          this.mostrar = false;
        }
      } catch (error) {
        window.$nuxt.$swal.fire({
          title: "Mensaje!",
          text: "Error al procesar petición en el servidor",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
      console.log(this.items)
    },
    async delRecord(id) {
      if (
        await this.$refs.confirm.open(
          "Confirmar",
          "¿Esta seguro de eliminar el registro seleccionado?"
        )
      ) {
        this.deleteRecord(id);
      }
    },
    async deleteRecord(id) {
      try {
        let datos = await this.$http.$get("estudios/cambiar/estado/" + id);
        if(datos.status=="success"){
          window.$nuxt.$swal.fire({
          text: datos.data,
          icon: datos.status,
          confirmButtonText: "Aceptar",
        });
        }else{
          window.$nuxt.$swal.fire({
          text: "Error al intentar eliminar el registro seleccionado",
          icon: datos.status,
          confirmButtonText: "Aceptar",
        });
        }
      } catch (error) {
        window.$nuxt.$swal.fire({
          title: "Mensaje!",
          text: "Error al procesar la solicitud en el servidor",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      } finally {
        this.getDatos();
      }
    },
  },
};
</script>
