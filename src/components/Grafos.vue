<template>
  <div class="contenedor">

    <div class="header">
      
      <div class="header-left">
        <h1>Grafos</h1>
      </div>

      <div class="header-center">
        <button @click="modo = 'crear'">Crear vértice</button>
        <button @click="modo = 'unir'">Unir vértices</button>
        <button @click="modo = 'eliminar'">Eliminar</button>
        <button @click="borrarTodo">Borrar todo</button>

        <div class="opcion-grafo">
          <span class="label-texto">{{ dirigido ? "Dirigido" : "No dirigido" }}</span>
          <label class="switch">
            <input type="checkbox" v-model="dirigido">
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <div class="header-right">
        <a href="/">Volver al inicio</a>
      </div>

    </div> <div
      class="lienzo"
      :class="{
        cursorCrear: modo === 'crear',
        cursorUnir: modo === 'unir',
        cursorEliminar: modo === 'eliminar'
      }"
      @click="clickLienzo"
      @mouseup="mouseupLienzo"
      @mousemove="mousemoveLienzo"
    >


  <div v-if="mostrarModalNombre" class="modal-overlay">
  <div class="modal" @click.stop>
    <h3>Nombre del vértice</h3>
    <input v-model="nombreTemporal" type="text" />
    <div class="modal-botones">
      <button @click.stop="confirmarNombre">Crear</button>
      <button @click.stop="cancelarNombre">Cancelar</button>
    </div>
  </div>
</div>

      <!-- SVG -->
      <svg class="svg-lineas">
    <defs>
      <marker
  id="arrow"
  viewBox="0 0 10 10"
  refX="10" 
  refY="5"
  markerWidth="6"
  markerHeight="6"
  orient="auto-start-reverse"
>
  <path d="M 0 0 L 10 5 L 0 10 z" fill="white"/>
</marker>

    </defs>
    <g v-for="(arista, index) in aristas" :key="index">
  <path
    :d="calcularCurva(arista)"
    stroke="white"
    fill="transparent"
    stroke-width="2"
    :marker-end="arista.dirigido ? 'url(#arrow)' : ''"
    @click.stop="clickArista(index)"
    style="pointer-events: stroke;"
  />

  <text
    :x="calcularPuntoPeso(arista).x"
    :y="calcularPuntoPeso(arista).y"
    fill="white"
    font-size="14"
    text-anchor="middle"
    style="paint-order: stroke; stroke: #381932; stroke-width: 4px;"
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
        @mousedown.stop="mousedownVertice(index, $event)"
      >
        {{ vertice.nombre }}
      </div>

    </div>

    <!-- MODAL -->
    <div v-if="mostrarModal" class="modal-overlay">
  <div class="modal" @click.stop>
    <h3>Ingrese el peso</h3>
    <input v-model="pesoTemporal" type="number" />
    <div class="modal-botones">
      <button @click.stop="confirmarPeso">Confirmar</button>
      <button @click.stop="cancelarPeso">Cancelar</button>
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
      mostrarModalNombre: false,
      nombreTemporal: "",
      xTemp: null,
      yTemp: null,

      verticeArrastrando: null,
      mostrarModal: false,
      pesoTemporal: "",
      origenTemporal: null,
      destinoTemporal: null, 

      // Opciones del grafo
      dirigido: false,
      permitirBucles: false,
      nombreGrafo: ""
    }
  },

  methods: {

    calcularPuntoBorde(origen, destino) {
  const v1 = this.vertices[origen]
  const v2 = this.vertices[destino]

  const dx = v2.x - v1.x
  const dy = v2.y - v1.y
  const distancia = Math.sqrt(dx * dx + dy * dy)

  const radio = 20 // mitad altura del vértice

  const offsetX = (dx / distancia) * radio
  const offsetY = (dy / distancia) * radio

  return {
    x: v1.x + offsetX,
    y: v1.y + offsetY
  }
},

    irInicio() {
  this.$router.push("/")
},

    clickLienzo(event) {
      if (this.modo === "crear" && !this.mostrarModalNombre) {
        const rect = this.$el.querySelector(".lienzo").getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top

        this.xTemp = x
        this.yTemp = y
        this.mostrarModalNombre = true
      }
    },

    confirmarNombre() {
      if (this.nombreTemporal.trim() === "") {
        alert("Ingrese un nombre válido")
        return
      }

      this.vertices.push({
        x: this.xTemp,
        y: this.yTemp,
        nombre: this.nombreTemporal
      })

      this.nombreTemporal = ""
      this.mostrarModalNombre = false
      this.xTemp = null
      this.yTemp = null
    },

     mousedownVertice(index, event) {
      this.verticeArrastrando = index
      event.stopPropagation()
    },
//mover vertice
     mousemoveLienzo(event) {
      if (this.verticeArrastrando !== null) {
        const rect = event.currentTarget.getBoundingClientRect()
        this.vertices[this.verticeArrastrando].x = event.clientX - rect.left
        this.vertices[this.verticeArrastrando].y = event.clientY - rect.top
      }
    },


    mouseupLienzo() {
      this.verticeArrastrando = null
    },


    clickVertice(index) {
  if (this.modo === "unir") {
    if (this.verticeSeleccionado === null) {
      this.verticeSeleccionado = index;
    } else {
      // Ahora permitimos que origenTemporal y destinoTemporal sean iguales
      this.origenTemporal = this.verticeSeleccionado;
      this.destinoTemporal = index;

      this.mostrarModal = true;
      this.verticeSeleccionado = null;
    }
  }

  if (this.modo === "eliminar") {
    this.eliminarVertice(index);
  }
},

    confirmarPeso() {
     const peso = parseFloat(this.pesoTemporal)

    if (isNaN(peso)) {
    alert("Ingrese un número válido")
    return
    }

    if (this.dirigido) {
      this.aristas.push({
      origen: this.origenTemporal,
      destino: this.destinoTemporal,
      peso,
      dirigido: true
    })

    } else {
      this.aristas.push({
      origen: this.origenTemporal,
      destino: this.destinoTemporal,
      peso,
      dirigido: false
      })
    }
      this.cerrarModal()

      this.modo="unir"
    },

    cancelarPeso() {
      this.cerrarModal()
    },

    cancelarNombre() {
    this.mostrarModalNombre = false
    this.nombreTemporal = ""
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
    },

    existeInversa(arista) {
  return this.aristas.some(a =>
    a.origen === arista.destino &&
    a.destino === arista.origen
  )
},

calcularOffset(arista) {
  if (arista.origen === arista.destino) return 0

  const existeInversa = this.aristas.some(a =>
    a.origen === arista.destino &&
    a.destino === arista.origen
  )

  if (!existeInversa) return 0

  // Si existe inversa, separarlas en lados opuestos
  return arista.origen < arista.destino ? 15 : -15
},

calcularX1(arista) {
  return this.calcularPuntoBorde(arista.origen, arista.destino).x
},

calcularY1(arista) {
  return this.calcularPuntoBorde(arista.origen, arista.destino).y
},

calcularX2(arista) {
  return this.calcularPuntoBorde(arista.destino, arista.origen).x
},

calcularY2(arista) {
  return this.calcularPuntoBorde(arista.destino, arista.origen).y
}, 

calcularCurva(arista) {
  const v1 = this.vertices[arista.origen];
  const v2 = this.vertices[arista.destino];
  if (!v1 || !v2) return "";

  const radio = 20; // Ajusta según el tamaño real de tus vértices en px

  // --- CASO BUCLE (Estilo Oreja) ---
  if (arista.origen === arista.destino) {
    // Puntos de salida y entrada en el borde superior
    const xSalida = v1.x + 8;
    const ySalida = v1.y - 18;
    const xEntrada = v1.x - 8;
    const yEntrada = v1.y - 18;

    // Puntos de control para hacer la curva redonda arriba
    return `M ${xSalida} ${ySalida} 
            C ${xSalida + 25} ${ySalida - 45}, 
              ${xEntrada - 25} ${yEntrada - 45}, 
              ${xEntrada} ${yEntrada}`;
  }

  // --- CASO ARISTA NORMAL (Borde a Borde) ---
  const dx = v2.x - v1.x;
  const dy = v2.y - v1.y;
  const distancia = Math.sqrt(dx * dx + dy * dy);
  const angulo = Math.atan2(dy, dx);

  // Calculamos el punto exacto en el borde del círculo de destino
  // Restamos un pequeño margen extra (radio + 5) para que la punta de la flecha no toque el borde
  const destinoX = v2.x - Math.cos(angulo) * radio;
  const destinoY = v2.y - Math.sin(angulo) * radio;
  
  const origenX = v1.x + Math.cos(angulo) * radio;
  const origenY = v1.y + Math.sin(angulo) * radio;

  // Punto de control para la curva (Q)
  const mx = (origenX + destinoX) / 2;
  const my = (origenY + destinoY) / 2;
  const offset = 20; 
  
  const controlX = mx + (-(destinoY - origenY) / distancia) * offset;
  const controlY = my + ((destinoX - origenX) / distancia) * offset;

  return `M ${origenX} ${origenY} Q ${controlX} ${controlY} ${destinoX} ${destinoY}`;
},

calcularPuntoPeso(arista) {
  const p1 = this.vertices[arista.origen];
  const p2 = this.vertices[arista.destino];

  // Si es un bucle, el peso va arriba del círculo
  if (arista.origen === arista.destino) {
    return { x: p1.x, y: p1.y - 60 };
  }

  // Si es una arista normal, buscamos el centro de la curva
  const mx = (p1.x + p2.x) / 2;
  const my = (p1.y + p2.y) / 2;

  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;

  const offset = 40; // Qué tan lejos de la línea se verá el peso
  const length = Math.sqrt(dx * dx + dy * dy);

  // Usamos la normal para que el texto no quede encima de la línea
  return {
    x: mx + (-dy / length) * offset,
    y: my + (dx / length) * offset
  };
},
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
  overflow: hidden;
}

.vertice {
  min-width: 40px;
  height: 40px;
  z-index: 2;
  padding: 0 12px;
  background: #e6708cd2;
  border-radius: 999px; /* píldora perfecta */
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-family: 'Times New Roman', Times, serif;
  font-weight: bold;
  white-space: nowrap;
}

.seleccionado {
  background: rgba(126, 77, 199, 0.775);
}

.svg-lineas {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;  

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
  z-index: 9999; 
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

/* Nuevo estilo para el interruptor de Grafo Dirigido */
.opcion-grafo {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.08); /* Fondo sutil */
  padding: 5px 18px;
  border-radius: 30px;
  border: 1px solid rgba(201, 196, 156, 0.4);
  margin-left: 10px;
}

.label-texto {
  font-family: fuente1, serif;
  font-size: 18px;
  color: #c9c49c;
  min-width: 100px;
  text-align: center;
}

.switch {
  position: relative;
  display: inline-block;
  width: 46px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #351125;
  transition: .4s;
  border-radius: 34px;
  border: 1px solid #c9c49c;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 3px;
  bottom: 3px;
  background-color: #c9c49c;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #e6708c; /* Color rosa de tus vértices */
  border-color: white;
}

input:checked + .slider:before {
  transform: translateX(22px);
  background-color: white;
}

/* ANIMACIONES */
@keyframes fadeIn {
  to { opacity: 1; }
}

@keyframes popIn {
  to { transform: scale(1); }
}


</style>
