<template>
   <div class="contenedor">

    <!-- HEADER -->
    <div class="header">
      
      <div class="header-left">
        <h1>Grafos</h1>
      </div>

      <div class="header-center">
        <button @click="modo = 'crear'">Crear vértice</button>
        <button @click="modo = 'unir'">Unir vértices</button>
        <button @click="modo = 'eliminar'">Eliminar</button>
        <button @click="borrarTodo">Borrar todo</button>
      </div>

      <div class="header-right">
        <a href="/">Volver al inicio</a>
      </div>


  </div>

    <!-- LIENZO -->
    <div
      class="lienzo"
      :class="{
        cursorCrear: modo === 'crear',
        cursorUnir: modo === 'unir',
        cursorEliminar: modo === 'eliminar'
      }"
      @click="clickLienzo"
    >

      <!-- SVG -->
      <svg class="svg-lineas">
        <g v-for="(arista, index) in aristas" :key="index">

          <line
            :x1="vertices[arista.origen].x"
            :y1="vertices[arista.origen].y"
            :x2="vertices[arista.destino].x"
            :y2="vertices[arista.destino].y"
            stroke="white"
            stroke-width="2"
            @click.stop="clickArista(index)"
            style="pointer-events: all;"
          />

          <text
            :x="(vertices[arista.origen].x + vertices[arista.destino].x)/2"
            :y="(vertices[arista.origen].y + vertices[arista.destino].y)/2"
            fill="white"
            font-size="14"
          >
            {{ arista.peso }}
          </text>

        </g>
      </svg>

      <!-- VERTICES -->
      <div
        v-for="(vertice, index) in vertices"
        :key="index"
        class="vertice"
        :class="{ seleccionado: verticeSeleccionado === index }"
        :style="{ top: vertice.y + 'px', left: vertice.x + 'px' }"
        @click.stop="clickVertice(index)"
      >
        {{ index }}
      </div>

    </div>

    <!-- MODAL -->
    <div v-if="mostrarModal" class="modal-overlay">
      <div class="modal">
        <h3>Ingrese el peso</h3>
        <input v-model="pesoTemporal" type="number" />
        <div class="modal-botones">
          <button @click="confirmarPeso">Confirmar</button>
          <button @click="cancelarPeso">Cancelar</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      modo: null,
      vertices: [],
      aristas: [],
      verticeSeleccionado: null,

      mostrarModal: false,
      pesoTemporal: "",
      origenTemporal: null,
      destinoTemporal: null
    }
  },

  methods: {

    irInicio() {
  this.$router.push("/")
},

    clickLienzo(event) {
      if (this.modo === "crear") {
        const rect = event.currentTarget.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        this.vertices.push({ x, y })
      }
    },

    clickVertice(index) {

      if (this.modo === "unir") {

        if (this.verticeSeleccionado === null) {
          this.verticeSeleccionado = index
        } else {

          if (this.verticeSeleccionado !== index) {

            this.origenTemporal = this.verticeSeleccionado
            this.destinoTemporal = index
            this.mostrarModal = true
          }

          this.verticeSeleccionado = null
        }
      }

      if (this.modo === "eliminar") {
        this.eliminarVertice(index)
      }
    },

    confirmarPeso() {
      if (this.pesoTemporal !== "") {
        this.aristas.push({
          origen: this.origenTemporal,
          destino: this.destinoTemporal,
          peso: this.pesoTemporal
        })
      }

      this.cerrarModal()
    },

    cancelarPeso() {
      this.cerrarModal()
    },

    cerrarModal() {
      this.mostrarModal = false
      this.pesoTemporal = ""
      this.origenTemporal = null
      this.destinoTemporal = null
    },

    clickArista(index) {
      if (this.modo === "eliminar") {
        this.aristas.splice(index, 1)
      }
    },

    eliminarVertice(index) {
      this.aristas = this.aristas.filter(
        a => a.origen !== index && a.destino !== index
      )

      this.aristas.forEach(a => {
        if (a.origen > index) a.origen--
        if (a.destino > index) a.destino--
      })

      this.vertices.splice(index, 1)
    },

    borrarTodo() {
      this.vertices = []
      this.aristas = []
      this.verticeSeleccionado = null
    }

  }
}
</script>

<style scoped>
@font-face {
  font-family: "fuente1";
  src: url("/fonts/NewYork.otf") format("opentype");
}

body {
  background-color: #381932;
  color: white;
  font-family:'Times New Roman', Times, serif
}

.contenedor {
  background-color: #381932; /* vino oscuro */
  min-height: 100vh;
  font-family:'Times New Roman', Times, serif
}


/* HEADER */
.header {
  display: flex;
  align-items: center;
  font-family: fuente1, serif;
  font-size: 45px;
  color: #c9c49c;
  justify-content: space-between; /* título a la izquierda, botón a la derecha */
  padding: 25px 80px;
  position: relative;
  background-color: #381932; /* color de fondo */
}

/* TÍTULO */
.header-left h1 {
  color: #c9c49c;
  font-size: 48px;
  font-weight: 600;
  margin: 0;
  letter-spacing: 4px;
}

/* BOTONES CENTRALES */
.header-center {
  display: flex;
  gap: 20px;
}

.header-center button {
  background: transparent;
  border: 2px solid white;
  color: white;
  padding: 8px 22px;
  border-radius: 30px;
  font-size: 15px;
  cursor: pointer;
  font-family: fuente1, serif;
  font-size: 20px;
  transition: all 0.3s ease;
}

.header-center button:hover {
  background-color: transparent;
  color: #c9c49c;
  border-color: #c9c49c;
}

/* VOLVER A INICIO */
.header-right a,
.header-right router-link {
  color: white;
  background: transparent;
  border: 2px solid white;
  text-decoration: none;
  font-size: 20px;
  border: 2px solid white;
  padding: 8px 22px;
  cursor: pointer;
  text-decoration: none;
  border-radius: 30px;
  font-family: fuente1, serif;
  transition: all 0.3s ease;
}

.header-right a:hover,
.header-right router-link:hover {
  background-color: transparent;
  color: #c9c49c;
  border-color: #c9c49c;
}

/* OPCIONAL: para que los botones centrales no se superpongan al reducir la pantalla */
@media (max-width: 1200px) {
  .header {
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }

  .header-left, .header-right {
    width: 100%;
    display: flex;
    justify-content: center;
  }
}



.lienzo {
  width: 90%;
  height: 500px;
  margin: 40px auto 0 auto;
  border: 2px solid white;
  border-radius: 20px;
  position: relative;
}

.vertice {
  width: 40px;
  height: 40px;
  background: #e6708cd2;
  border-radius: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-family:'Times New Roman', Times, serif;
  font-weight: bold;
}

.seleccionado {
  background: rgba(126, 77, 199, 0.775);
}

.svg-lineas {
  position: absolute;
  width: 100%;
  height: 100%;
}

.cursorCrear { cursor: crosshair; }
.cursorUnir { cursor: pointer; }
.cursorEliminar { cursor: not-allowed; }

/* MODAL */

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: #c9c49c;
  color: #351125;
  padding: 20px;
  border-radius: 15px;
  text-align: center;
  font-family: 'Times New Roman', Times, serif;
  width: 250px;
}

.modal input {
  width: 80%;
  padding: 5px;
  margin: 10px 0;
}

.modal-botones {
  display: flex;
  justify-content: space-around;
}

.modal-botones button {
  padding: 5px 15px;
  border: none;
  background: #40152d;
  color: rgba(255, 255, 255, 0.712);
  border-radius: 10px;
  cursor: pointer;
}

.header-superior {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.titulo-grafos {
  margin: 0;
  font-size: 40px;
}

.boton-inicio {
  padding: 6px 20px;
  border-radius: 30px;
  cursor: pointer;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  padding: 6px 20px;
  border: 2px solid white;
  background: transparent;
  color: #c9c49c;
  border-radius: 20px;
  cursor: pointer;
}

/* ANIMACIONES */
@keyframes fadeIn {
  to { opacity: 1; }
}

@keyframes popIn {
  to { transform: scale(1); }
}


</style>
