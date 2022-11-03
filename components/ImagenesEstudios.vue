<template>
  <div>
    <v-row>
      <v-col
        v-for="item in imagenes"
        :key="item.iid"
        class="d-flex child-flex"
        cols="4"
      >
        <v-img :src="item.ruta" aspect-ratio="1" class="grey lighten-2" >
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular
                indeterminate
                color="grey lighten-5"
              ></v-progress-circular>
            </v-row>
          </template>
          <template v-if="loading">
            <div>
              <v-progress-circular
                :size="50"
                color="primary"
                indeterminate
              ></v-progress-circular>
            </div>
          </template>
        </v-img>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  data(){
    return{
      loading:false,
    }
  },
  props:
    ["imagenes"]

}
</script>
