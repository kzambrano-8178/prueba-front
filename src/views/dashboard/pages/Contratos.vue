<template>
  <v-layout justify-center>
    <base-material-card
      title="Registro de Contratos"
      color="blue"
      style="width: 1000px"
    >
      <v-data-table
        :search="search"
        :headers="headers"
        :items="this.mostrarDatosContrato"
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
                        <v-select
                          v-model="tareas.empleado"
                          :items="arr_empleado"
                          label="Empleado"
                          dense
                          item-text="label"
                          item-value="value"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="tareas.cargos"
                          :items="arr_cargos"
                          label="Cargos"
                          dense
                          item-text="label"
                          item-value="value"
                        ></v-select>
                      </v-col>
                    </v-row>
                    <v-row class="mt-n7 mx-auto">
                      <v-col cols="12" md="6">
                        <v-menu
                          v-model="menu2"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          transition="scale-transition"
                          offset-y
                          min-width="auto"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="tareas.fecha_ingreso"
                              label="Fecha de Ingreso"
                              prepend-icon="mdi-calendar"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="tareas.fecha_ingreso"
                            @input="menu2 = false"
                            min="2021-12-01"
                            max="2021-12-31"
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          type= 'number'
                          min="0.01" 
                          step="0.01"
                          oninput="validity.valid||(value='');"
                          class="custom-label-color"
                          v-model="tareas.sueldo"
                          label="sueldo"
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
                    @click="actualizarContrato()"
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
    arr_cargos: [],
    arr_empleado: [],
    menu2: false,
    formTitle: "Contratos",
    m_observacion: "",
    v_loading: true,

    snackbar: false,
    mostrarDatosContrato: [],
    tareas: {},
    dialog: false,
    dialogDelete: false,
    search: "",

    headers: [
      {
        text: "Empleado",
        class: "sticky-header blue lighten-4 black--text",
        value: "v_empleado",
      },
      {
        text: "Cargo",
        align: "start",
        sortable: false,
        class: "sticky-header blue lighten-4 black--text",
        value: "v_cargo",
      },
      {
        text: "Sueldo",
        class: "sticky-header blue lighten-4 black--text",
        value: "sueldo",
      },
      {
        text: "Fecha de Ingreso",
        class: "sticky-header blue lighten-4 black--text",
        value: "fecha_ingreso",
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
    this.mostrarEmpleados();
    this.mostrarCargos();
    this.mostrarContrato();
  },
  methods: {
    async mostrarEmpleados() {
      await fetch("http://localhost:3000/cliente/mostrar", {
        method: "get",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.ress.length > 0) {
            data.ress.forEach((x) => {
              this.arr_empleado.push({
                label: x.nombres + " " + x.apellidos,
                value: x._id,
              });
            });
          }
        });
    },

    async mostrarCargos() {
      await fetch("http://localhost:3000/cargos/mostrar", {
        method: "get",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.ress.length > 0) {
            data.ress.forEach((x) => {
              this.arr_cargos.push({
                label: x.descripcion,
                value: x._id,
              });
            });
          }
        });
    },

    mostrarContrato: async function () {
      try {
        await fetch("http://localhost:3000/contratos/mostrar", {
          method: "get",
          headers: {
            Accept: "application/json",
            "Content-type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.ok === false) {
              this.error = data.observacion;
            } else {
              this.mostrarDatosContrato = [];
              if (data.ress != null) {
                data.ress.forEach((x) => {
                  let v_empleado = this.arr_empleado.find(
                    (e) => e.value == x.empleado
                  );
                  let v_cargo = this.arr_cargos.find(
                    (e) => e.value == x.cargos
                  );
                  this.mostrarDatosContrato.push({
                    empleado: v_empleado.value,
                    cargos: v_cargo.value,
                    v_empleado: v_empleado.label,
                    v_cargo: v_cargo.label,
                    fecha_ingreso: x.fecha_ingreso,
                    sueldo: x.sueldo,
                    _id: x._id,
                  });
                });
              }
            }
            this.v_loading = false;
          });
      } catch {
        this.error = "No se pudo hacer la peticion en empresa";
      }
    },
    async actualizarContrato() {
      let datos = this.tareas.hasOwnProperty("nombres");
      let buscar_contrato = this.mostrarDatosContrato.find(
        (x) => x.empleado == this.tareas.empleado
      );
      if (buscar_contrato && !this.tareas.editar) {
        this.m_observacion = "Este empleado ya tiene un contrato activo";
        this.close();
        this.snackbar = true;
        this.tareas = {};
      } else {
        if (datos) {
          await fetch("http://localhost:3000/contratos/actualizar", {
            method: "post",
            body: JSON.stringify(this.tareas),
            headers: {
              Accept: "application/json",
              "Content-type": "application/json",
            },
          })
            .then((res) => res.json())
            .then((data) => {
              this.mostrarContrato();
              this.mostrarEmpleados();
              this.mostrarCargos();
              this.m_observacion = data.msg;
              this.close();
              this.snackbar = true;
            });
        }else{
          this.m_observacion = "campos obligatorios";
          this.snackbar = true;
        }
      }
    },
    editarCliente: function (item) {
      this.tareas = JSON.parse(JSON.stringify(item));
      this.tareas.editar = true;
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
          //this.actualizarContrato(this.tareas);
          await fetch(
            "http://localhost:3000/contratos/actualizar?_id=" + item._id,
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
            this.mostrarContrato();
            this.mostrarEmpleados();
            this.mostrarCargos();
            
          });
          //this.mostrarContrato();
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
