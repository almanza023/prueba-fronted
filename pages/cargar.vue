<template>
  <div>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="6" md="12">
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>CONSULTAR PACIENTE </v-toolbar-title>
          </v-toolbar>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-card-text>
              <v-text-field
                v-model="paciente.rips"
                type="number"
                label="Rips"
                outlined
                required
                 @keyup.enter="consultar"
              ></v-text-field>
              <v-text-field
                v-model="paciente.identificacion"
                label="N° Documento"
                type="number"
                outlined
                required
                 @keyup.enter="consultar"
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                :disabled="!valid"
                block
                color="success"
                class="mr-4"
                @click="consultar"
              >
                CONSULTAR
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

    <v-row justify="center" align="center" v-show="mostrar">
      <v-col cols="6" sm="6" md="6">
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>DATOS DE PACIENTE </v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-simple-table>
              <template v-slot:default>
                <tbody>
                  <tr>
                    <th class="text-left">NOMBRE PACIENTE</th>
                    <th class="text-left">
                      {{ paciente.nombres + " " + paciente.apellidos }}
                    </th>
                  </tr>
                  <tr>
                    <th class="text-left">IDENTIFICACION</th>
                    <th class="text-left">
                      {{ paciente.tipo_doc + " " + paciente.identificacion }}
                    </th>
                  </tr>
                   <tr>
                    <th class="text-left">SEXO</th>
                    <th class="text-left">
                      {{ paciente.sexo }}
                    </th>
                  </tr>
                  <tr>
                    <th class="text-left">FECHA NACIMIENTO</th>
                    <th class="text-left">
                      {{ paciente.fecha_nac }}
                    </th>
                  </tr>
                  <tr>
                    <th class="text-left">TELEFONO</th>
                    <th class="text-left">
                      {{ paciente.telefono }}
                    </th>
                  </tr>
                  <tr>
                    <th class="text-left">DIRECCION</th>
                    <th class="text-left">
                      {{ paciente.direccion }}
                    </th>
                  </tr>
                  <tr>
                    <th class="text-left">EPS</th>
                    <th class="text-left">
                      {{ paciente.eps_nombre }}
                    </th>
                  </tr>
                  <tr>
                    <th class="text-left">SERVICIO</th>
                    <th class="text-left">
                      {{ paciente.servicio }}
                    </th>
                  </tr>
                   <tr>
                    <th class="text-left">DX</th>
                    <th class="text-left">
                      <th class="text-left">
                      {{ paciente.dx+'  '+paciente.dx_nombre }}
                    </th>
                  </tr>
                  <tr>
                    <th class="text-left">CORREO</th>
                    <th class="text-left">
                      <v-text-field
                        v-model="paciente.correo"
                        type="email"
                        required
                        outlined
                      ></v-text-field>
                    </th>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" sm="6" md="6">
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>DATOS DE ESTUDIO </v-toolbar-title>
          </v-toolbar>
          <v-form ref="form2" v-model="valid2" lazy-validation>
          <v-card-text>
            <v-text-field
              v-model="paciente.estudio_fecha"
              label="Fecha Realización"
              type="date"
              :rules="regla"
              required
              outlined
            ></v-text-field>
              <v-select
                v-model="paciente.estudio_nombre"
              :items="items"
              :item-text="'servicio'"
              :item-value="'servicio'"
              value=""
              label="Nombre"
              outlined
            ></v-select>
            <v-text-field
              v-model="paciente.estudio_url"
              label="CODIGO TDX"
              type="text"
              outlined
            ></v-text-field>
            <v-text-field
              v-model="paciente.estudio_observaciones"
              label="Observaciones"
              outlined
              type="text"
            ></v-text-field>
            <v-file-input
              v-model="archivo"
              accept="image/png, image/jpeg, image/bmp"
              color="deep-purple accent-4"
              counter
              label="Subida de Imagenes"
              placeholder="Seleccione las imagenes"
              prepend-icon="mdi-paperclip"
              outlined
              :show-size="1000"
            >
              <template v-slot:selection="{ index, text }">
                <v-chip
                  v-if="index < 2"
                  color="deep-purple accent-4"
                  dark
                  label
                  small
                >
                  {{ text }}
                </v-chip>

                <span
                  v-else-if="index === 2"
                  class="text-overline grey--text text--darken-3 mx-2"
                >
                  +{{ files.length - 2 }} Archivos(s)
                </span>
              </template>
            </v-file-input>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :disabled="!valid2"
              block
              color="success"
              class="mr-4"
              @click="store"
            >
              CARGAR INFORMACIÓN
            </v-btn>
          </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  layout: "default",
  data: () => ({
    valid: true,
    valid2: true,
    mostrar: false,
    id_usuario:'',
    files: [],
    items: [],
    archivo:null,
    paciente: {
      user_id: "",
      rips: "",
      identificacion: "",
      sexo: "",
      tipo_doc: "",
      nombres: "",
      apellidos: "",
      eps_codigo: "",
      eps_nombre: "",
      telefono: "",
      direccion: "",
      correoe: "",
      fecha_nac: "",
      servicio: "",
      estudio_nombre: null,
      estudio_url: "",
      estudio_fecha: null,
      estudio_observaciones: "",
      dx_nombre:"",
      dx:""
    },
    regla: [(v) => !!v || "Campo es obligatorio"],
    email: "",
    emailRules: [
      (v) => !!v || "Correo es obligatorio",
      (v) => /.+@.+\..+/.test(v) || "Correo no es valido",
    ],
  }),

  mounted() {
    this.id_usuario = localStorage.getItem("user_id");
    if (this.id_usuario == null) {
      window.$nuxt.$router.push("/");
    }
  },

  methods: {
    async consultar() {
      try {
        let respuesta = await this.$http.$post(
          "pacientes/buscar",
          this.paciente
        );
        if (respuesta.status == "success") {
          this.paciente = await respuesta.data;
          this.paciente.user_id=this.id_usuario
          this.mostrar = true;
          let response= await this.$http.$get(
          "estudios/formulacion/"+
          this.paciente.rips
        );
        this.items=response.data
         let response2= await this.$http.$get(
          "estudios/diagnostico/"+
          this.paciente.rips
        );
        this.paciente.dx=response2.data.dx
        this.paciente.dx_nombre=response2.data.descripcion
        } else {
          window.$nuxt.$swal.fire({
            title: "Mensaje!",
            text: "No se encontro ningún registro",
            icon: "warning",
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
    },

    async store() {
      if (!this.$refs.form2.validate()) {
        return;
      }
      console.log(this.files)
      let InstFormData = new FormData();
      InstFormData.append('user_id' , this.paciente.user_id);
      InstFormData.append('rips' , this.paciente.rips);
      InstFormData.append('identificacion' , this.paciente.identificacion);
      InstFormData.append('sexo' , this.paciente.sexo);
      InstFormData.append('num_doc' , this.paciente.identificacion);
      InstFormData.append('tipo_doc' , this.paciente.tipo_doc);
      InstFormData.append('nombres' , this.paciente.nombres);
      InstFormData.append('apellidos' , this.paciente.apellidos);
      InstFormData.append('eps_codigo' , this.paciente.eps_codigo);
      InstFormData.append('eps_nombre' , this.paciente.eps_nombre);
      InstFormData.append('telefono' , this.paciente.telefono);
      InstFormData.append('correo' , this.paciente.correoe);
      InstFormData.append('fecha_nac' , this.paciente.fecha_nac);
      InstFormData.append('servicio' , this.paciente.servicio);
      InstFormData.append('estudio_nombre' , this.paciente.estudio_nombre);
      InstFormData.append('estudio_url' , this.paciente.estudio_url);
      InstFormData.append('estudio_fecha' , this.paciente.estudio_fecha);
      InstFormData.append('estudio_observaciones' , this.paciente.estudio_observaciones);
      InstFormData.append('archivo' , this.archivo);


      try {
       let respuesta= await  this.$axios.$post('/estudios/cargar', InstFormData , {headers : {'content-type': 'multipart/form-data'}});
        if (respuesta.status == "success") {
          window.$nuxt.$swal.fire({
            text: respuesta.data,
            icon: respuesta.status,
            confirmButtonText: "Aceptar",
          });
          this.resetForm()
        }else{
          window.$nuxt.$swal.fire({
          text: "Error al subir la información al servidor",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
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

    resetForm(){
      this.mostrar=false
      this.paciente= {
        rips: "",
        identificacion: "",
        sexo: "",
        tipo_doc: "",
        nombres: "",
        apellidos: "",
        eps_codigo: "",
        eps_nombre: "",
        telefono: "",
        direccion: "",
        correoe: "",
        fecha_nac: "",
        servicio: "",
        estudio_nombre: "",
        estudio_url: "",
        estudio_fecha: "",
        estudio_observaciones: "",
    }
    }
  },
};
</script>
