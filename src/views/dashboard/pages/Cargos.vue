<template>
  <v-layout justify-center>
    <base-material-card
      title="Registro de Cargos"
      color="blue"
      style="width: 1000px"
    >
      <v-data-table
        :search="search"
        :headers="headers"
        :items="this.mostrarDatosClientes"
        style="width: 1000px"
        :loading="v_loading"
        loading-text="Loading... Please wait"
      >
        <template v-slot:item.estado="{ item }">
          <v-chip v-if="item.estado == true" color="success" dark>
            {{ "Activo" }}
          </v-chip>
        </template>
        <template v-slot:top>
          <v-toolbar flat>
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>

            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-btn color="blue" dark class="mb-2" @click="nuevo()">
              <v-icon small class="mr-2">mdi-human-child</v-icon>
              Nuevo
            </v-btn>
            <v-dialog v-model="dialog" max-width="800px" persistent>
              <v-card class="text-center">
                <v-toolbar flat color="#CEF6F5" tile>
                  <v-card-title class="text-center">
                    <b>{{ formTitle }}</b>
                  </v-card-title>
                </v-toolbar>
                <v-card-text>
                  <v-container>
                    <v-row class="mt-n7 mx-auto">
                      <v-col cols="12" md="6">
                        <v-text-field
                          class="custom-label-color"
                          v-model="tareas.descripcion"
                          label="Descripcion"
                          maxlength="50"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          class="custom-label-color"
                          v-model="tareas.codigo"
                          label="Codigo"
                          maxlength="5"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="secondary" class="mb-2" dark @click="close">
                    Cancel
                  </v-btn>
                  <v-btn
                    color="primary"
                    class="mb-2"
                    dark
                    @click="actualizarCargos()"
                  >
                    Guardar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    class="mx-2"
                    fab
                    dark
                    color="indigo"
                    @click="closeDelete"
                  >
                    <v-icon dark>mdi-plus</v-icon>
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                    >OK</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <div class="text-center">
            <v-menu
              bottom
              right
              offset-y
              origin="top right"
              transition="scale-transition"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-icon small class="mr-2" v-bind="attrs" v-on="on">
                  mdi-dots-vertical
                </v-icon>
              </template>

              <v-btn block color="primary" @click="editarCliente(item)">
                <v-list-item-title>
                  <v-icon small class="mr-2">mdi-pencil</v-icon>
                  editar
                </v-list-item-title>
              </v-btn>
              <v-btn block color="blue" @click="deleteItem(item)">
                <v-list-item-title>
                  <v-icon small class="mr-2">mdi-delete</v-icon>
                  eliminar
                </v-list-item-title>
              </v-btn>
            </v-menu>
          </div>
        </template>
        <template v-slot:no-data>
          <br />
          <v-alert color="error2" icon="mdi-alert">
            No Existen datos de clientes
          </v-alert>
        </template>
        <v-alert
          slot="no-results"
          :value="true"
          color="error2"
          icon="mdi-alert"
        >
          Su Busqueda de "{{ search }}" no encontro resultados.
        </v-alert>
      </v-data-table>
    </base-material-card>
    <v-snackbar
      v-model="snackbar"
      :timeout="3000"
      :value="true"
      absolute
      shaped
      bottom
      right
    >
      {{ m_observacion }}
      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-layout>
</template>

<script>
import Swal from "sweetalert2";

let token = localStorage.getItem("token");
let cliente = localStorage.getItem("empresa2");

export default {
  data: () => ({
    menu2: false,
    formTitle: "Cargos",

    m_observacion: "",
    v_loading: true,

    snackbar: false,
    mostrarDatosClientes: [],
    tareas: {},
    dialog: false,
    dialogDelete: false,
    search: "",

    headers: [
      {
        text: "Descripcion",
        class: "sticky-header blue lighten-4 black--text",
        value: "descripcion",
      },
      {
        text: "Codigo",
        align: "start",
        sortable: false,
        class: "sticky-header blue lighten-4 black--text",
        value: "codigo",
      },

      {
        text: "Actions",
        value: "actions",
        class: "sticky-header blue lighten-4 black--text",
        sortable: false,
      },
    ],
  }),
  computed: {},
  created() {
    this.mostrarCargos();
  },
  methods: {
    mostrarCargos: async function () {
      try {
        await fetch("http://localhost:3000/cargos/mostrar", {
          method: "get",
          headers: {
            Accept: "application/json",
            "Content-type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            if (data.ok === false) {
              this.error = data.observacion;
            } else {
              this.mostrarDatosClientes = [];
              if (data.ress != null) {
                this.mostrarDatosClientes = data.ress;
              }
            }
            this.v_loading = false;
          });
      } catch {
        this.error = "No se pudo hacer la peticion en empresa";
      }
    },
    async actualizarCargos() {
      let datos = this.tareas.hasOwnProperty("descripcion");
      if (datos) {
        await fetch("http://localhost:3000/cargos/actualizar", {
          method: "post",
          body: JSON.stringify(this.tareas),
          headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            //"x-access-token": token,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("kkkk", data);
            //if (data === false) {
            //  this.error = data.observacion;
            //} else {
            this.mostrarCargos();
            this.m_observacion = data.msg;
            this.close();
            this.snackbar = true;

            //}
          });
      } else {
        this.m_observacion = "campos obligatorios";
        this.snackbar = true;
      }
    },
    editarCliente: function (item) {
      this.tareas = JSON.parse(JSON.stringify(item));
      //this.tareas = Object.assign({}, item);
      //this.tareas.accion = "actualizar";
      this.dialog = true;
    },
    nuevo() {
      this.dialog = true;
      this.tareas = {};
    },
    close() {
      this.dialog = false;
    },
    deleteItem(item) {
      this.tareas = Object.assign({}, item);
      this.tareas.accion = "eliminar";
      Swal.fire({
        title: "Confirmar para eliminar el registro?",
        showCancelButton: true,
        cancelButtonColor: "#d33",
        confirmButtonText: `Eliminar`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          //this.actualizarCargos(this.tareas);
          await fetch(
            "http://localhost:3000/cargos/actualizar?_id=" + item._id,
            {
              method: "delete",
              //body: JSON.stringify(this.tareas),
              headers: {
                Accept: "application/json",
                "Content-type": "application/json",
                //"x-access-token": token,
              },
            }
          ).then((data) => {
            console.log("kkkk", data);
            this.mostrarCargos();
            
          });
          //this.mostrarCargos();
          Swal.fire({
            icon: "success",
            title: "Eliminado correctamente",
            timer: 1500,
          });
        }
      });
    },

    deleteItemConfirm() {
      // this.desserts.splice(this.editedIndex, 1);
      this.closeDelete();
    },
    closeDelete() {
      this.dialogDelete = false;
    },
  },
};
</script>
<style>
/* This is for documentation purposes and will not be needed in your application */
#create .v-speed-dial {
  position: absolute;
}
#create .v-btn--floating {
  position: relative;
}
.custom-placeholer-color input::placeholder {
  color: #a4a4a4 !important;
  opacity: 1;
}

.custom-label-color .v-label {
  color: #848484;
  opacity: 1;
}

.custom-placeholer-color input,
.custom-label-color input {
  color: black !important;
}
.midh-text {
  color: white;
  font-family: Arial, Helvetica, sans-serif;
}
.v-data-table > .v-data-table__wrapper > table > thead > tr > th {
  font-size: 17px;
  font-weight: bold;
  /* background-color: red;
   height: 25px;
  padding: 1px; */
}
.v-data-table > .v-data-table__wrapper > table > tbody > tr > td,
.v-data-table > .v-data-table__wrapper > table > tfoot > tr > td,
.v-data-table > .v-data-table__wrapper > table > thead > tr > td {
  font-size: 13px;
  background: rgb(255, 255, 255);
}
</style>
