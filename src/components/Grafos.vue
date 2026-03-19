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
        <button @click="abrirModalMatriz">Ingresar matriz</button>
        <button @click="borrarTodo">Borrar todo</button>
        <button @click="ejecutarJohnson" style="background-color: #6a1b9a; color: white;">Algoritmo Johnson</button>
        <button @click="exportarJSON">Exportar JSON</button>
        <button @click="$refs.fileInput.click()">Importar JSON</button>
          <input 
            ref="fileInput"
            type="file"
            accept=".json"
            @change="importarJSON"
            style="display:none"
          />

        <div class="opcion-grafo">
          <span class="label-texto">{{ dirigido ? "Dirigido" : "No dirigido" }}</span>
          <label class="switch">
            <input type="checkbox" v-model="dirigido">
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <div class="header-right">
        <a href="/">Volver</a>
      </div>

    </div> 

    <div class="contador-convergencia">

  Convergencia:

  <div v-for="(v,i) in vectorConvergencia" :key="i">
    {{ vertices[i]?.nombre }} → {{ v.toFixed(3) }}
  </div>

</div>

    <div
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
  <div class="modal-pequeno" @click.stop>
    <h3>Nombre del vértice</h3>
    <input v-model="nombreTemporal" placeholder="Ej: A" />
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
    <g v-for="(arista, index) in aristas" :key="index"
   @dblclick.stop="editarArista(index)">
  <path
    :d="calcularCurva(arista)"
    stroke="white"
    fill="transparent"
    stroke-width="2"
    :marker-end="arista.dirigido ? 'url(#arrow)' : ''"
    @click.stop="clickArista(index)"
    @dblclick.stop="editarArista(index)"
    style="pointer-events: stroke;"
  />

  <g>

  <!-- área clickeable -->
  <rect
  :x="calcularPuntoPeso(arista).x - 25"
  :y="calcularPuntoPeso(arista).y - 20"
  width="50"
  height="40"
  fill="transparent"
  style="cursor:pointer;"
  />

  <!-- número del peso -->
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
  @dblclick.stop="abrirRenombrar(index)"
>
  {{ vertice.nombre }}
</div>

    </div

<!-- PANEL INFERIOR -->
<div class="panel-inferior">

  <!-- MATRIZ -->
  <div class="matriz">
    <h3>Matriz de Adyacencia</h3>

    <table>
      <thead>
        <tr>
          <th></th>

          <th v-for="(v,i) in vertices" :key="i">
            {{ v.nombre }}
          </th>

          <th>Σ</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(fila,i) in generarMatriz()" :key="i">

          <th :class="{ suma: i === vertices.length }">
            {{ i < vertices.length ? vertices[i].nombre : 'Σ' }}
          </th>

          <td
            v-for="(valor,j) in fila"
            :key="j"
            :class="[
              { suma: i === vertices.length || j === vertices.length },
              { conexion: valor > 0 }
            ]"
          >
            {{ valor }}
          </td>

        </tr>
      </tbody>
    </table>
  </div>

  <!-- GRADOS -->
  <div class="grados">
    <h3>Grados</h3>

    <div class="grado-item" v-for="g in calcularGrados()" :key="g.nombre">
      <strong>{{ g.nombre }}</strong>
      <span>Entrada: {{ g.entrada }}</span>
      <span>Salida: {{ g.salida }}</span>
    </div>

  </div>

</div>

<div class="panel-johnson" v-if="resultadosJohnson" style="margin-top: 20px; padding: 20px; background: #2a1226; color: white;">
  <h3>Resultados Algoritmo Johnson (Caminos Mínimos)</h3>
  <table border="1" style="width: 100%; text-align: center; border-collapse: collapse;">
    <thead>
      <tr>
        <th>Desde \ Hacia</th>
        <th v-for="v in vertices" :key="v.nombre">{{ v.nombre }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(fila, i) in resultadosJohnson" :key="i">
        <th style="background: #381932;">{{ vertices[i].nombre }}</th>
        <td v-for="(dist, j) in fila" :key="j" :style="{ color: dist === '∞' ? '#ff6b6b' : '#63e6be' }">
          {{ dist }}
          
        </td>
      </tr>
    </tbody>
  </table>
  <button @click="resultadosJohnson = null" style="margin-top: 10px;">Cerrar resultados</button>
</div>


<!-- MODAL MATRIZ -->
<div v-if="mostrarModalMatriz" class="modal-overlay">
  <div class="modal-matriz" @click.stop>

    <h3>Ingrese la matriz</h3>

    <table class="tabla-modal">
      <tr v-for="(fila,i) in matrizEditable" :key="i">
        <td v-for="(valor,j) in fila" :key="j">
          <input
            type="number"
            v-model.number="matrizEditable[i][j]"
          />
        </td>
      </tr>
    </table>

    <div class="modal-botones">
      <button @click="generarGrafoDesdeMatriz">Generar</button>
      <button @click="mostrarModalMatriz = false">Cancelar</button>
    </div>

  </div>
</div>

    <!-- MODAL peso -->
    <div v-if="mostrarModal" class="modal-overlay">
  <div class="modal-pequeno" @click.stop>
    <h3>Ingrese el peso</h3>
    <input v-model="pesoTemporal" type="number" />
    <div class="modal-botones">
      <button @click.stop="confirmarPeso">Confirmar</button>
      <button @click.stop="cancelarPeso">Cancelar</button>
    </div>
  </div>
</div>

  <!-- BOTON ayudE -->
<div class="help-button" @click="toggleGuia">
  ?
</div>

<!-- tooltip -->
<div v-if="mostrarTooltip" class="help-tooltip">
  ¿Necesitas ayuda? <br>
  entra a la guía
</div>

<!-- GUIA -->
<div v-if="mostrarGuia" class="help-overlay">
  <div class="help-modal">
  <h2>Guía</h2>

  <h3>🗒 Crear vértices</h3>
  <ul>
    <li>Haz <b>click en el lienzo</b> para crear un vértice.</li>
    <li>Los vértices representan nodos del grafo.</li>
  </ul>

  <h3>༘⋆ Crear aristas</h3>
  <ul>
    <li>Haz <b>click en un vértice origen</b>.</li>
    <li>Luego haz <b>click en un vértice destino</b>.</li>
    <li>Se abrirá una ventana para ingresar el <b>peso de la arista</b>.</li>
  </ul>

  <h3>✎𓂃 Editar peso</h3>
  <ul>
    <li>Haz <b>doble click sobre una arista</b>.</li>
    <li>Podrás modificar el peso de la conexión.</li>
  </ul>

  <h3>🗑 Eliminar elementos</h3>
  <ul>
    <li>En modo eliminar puedes borrar <b>vértices o aristas</b>.</li>
    <li>Al eliminar un vértice se eliminan también sus conexiones.</li>
  </ul>

  <h3>🖩 Matriz de adyacencia</h3>
  <ul>
    <li>Muestra las conexiones del grafo en forma de tabla.</li>
    <li>Las filas representan <b>origen</b>.</li>
    <li>Las columnas representan <b>destino</b>.</li>
    <li>Los valores indican el <b>peso de la arista</b>.</li>
  </ul>

  <h3>〽 Grados del grafo</h3>
  <ul>
    <li>Grado de entrada: cuántas aristas llegan a un nodo.</li>
    <li>Grado de salida: cuántas aristas salen de un nodo.</li>
  </ul>

  <h3>🖨 Exportar grafo</h3>
  <ul>
    <li>Puedes guardar el grafo como archivo <b>JSON</b>.</li>
    <li>Se guardan vértices, aristas y pesos.</li>
  </ul>

  <h3>🗁 Importar grafo</h3>
  <ul>
    <li>Puedes cargar un archivo JSON previamente guardado.</li>
    <li>El sistema reconstruirá automáticamente el grafo.</li>
  </ul>

  <h3>⋆˙⟡ Consejos</h3>
  <ul>
    <li>Separa los nodos para que las aristas se vean mejor.</li>
    <li>Usa pesos para representar costos o distancias.</li>
    <li>Verifica la matriz para validar conexiones.</li>
  </ul>

  <button @click="mostrarGuia=false">Cerrar</button>
  </div>

</div>

<button @click="ejecutarJohnson" style="background-color: #6a1b9a; color: white;">Calcular Johnson</button>

<input v-model="pesoTemporal" type="number" step="any" placeholder="Ej: -5" />
</div>

</template>

<script>
export default {
  data() {
    return {
      modo: "crear", // crear, unir, eliminar
      vertices: [],
      aristas: [],
      verticeSeleccionado: null,
      mostrarModalNombre: false,
      nombreTemporal: "",
      xTemp: null,
      yTemp: null,
      mostrarGuia:false,
      mostrarTooltip:true,
      contadorConvergencia: 0,
      vectorConvergencia: [],
      indiceRenombrar: null,
      modoRenombrar:false,

      verticeArrastrando: null,
      mostrarModal: false,
      pesoTemporal: "",
      origenTemporal: null,
      destinoTemporal: null, 

      // Opciones del grafo
      dirigido: false,
      permitirBucles: false,
      aristaEditando: null,
      nombreGrafo: "",

      //matriz
      mostrarModalMatriz: false,
      matrizEditable: [],
      tamanoMatriz: 0,

      resultadosJohnson: null
    }
  },

  mounted(){

  // el mensaje desaparece despues de 5 segundos
  setTimeout(()=>{
    this.mostrarTooltip=false
  },5000)

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

abrirRenombrar(index){

  this.indiceRenombrar = index
  this.nombreTemporal = this.vertices[index].nombre
  this.mostrarModalNombre = true
  this.modoRenombrar = true

},

    irInicio() {
  this.$router.push("/")
},

toggleGuia(){
  this.mostrarGuia=!this.mostrarGuia
  this.mostrarTooltip=false
},

    clickLienzo(event) {
      console.log("click lienzo");
      if (this.modo === "crear" && !this.mostrarModalNombre) {
        const rect = this.$el.querySelector(".lienzo").getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top

        this.xTemp = x
        this.yTemp = y
        this.mostrarModalNombre = true
      }
    },

    confirmarNombre(){

  if(this.nombreTemporal.trim()===""){
    alert("Ingrese un nombre válido")
    return
  }

  if(this.modoRenombrar){

    this.vertices[this.indiceRenombrar].nombre = this.nombreTemporal

  }else{

    this.vertices.push({
      x:this.xTemp,
      y:this.yTemp,
      nombre:this.nombreTemporal
    })

  }

  this.incrementarConvergencia()

  this.nombreTemporal=""
  this.mostrarModalNombre=false
  this.modoRenombrar=false
  this.indiceRenombrar=null
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

    if (this.aristaEditando !== null) {

    this.aristas[this.aristaEditando].peso = peso
    this.aristaEditando = null

    } else {

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
    this.incrementarConvergencia()
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
      this.incrementarConvergencia()
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
      this.incrementarConvergencia()
    },

    borrarTodo() {
      this.vertices = []
      this.aristas = []
      this.verticeSeleccionado = null
      this.incrementarConvergencia()
    },

    existeInversa(arista) {
  return this.aristas.some(a =>
    a.origen === arista.destino &&
    a.destino === arista.origen
  )
},

editarArista(index) {
  this.aristaEditando = index
  this.pesoTemporal = this.aristas[index].peso
  this.mostrarModal = true
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

generarMatriz() {

  const n = this.vertices.length

  const matriz = Array(n + 1)
    .fill(0)
    .map(() => Array(n + 1).fill(0))

  // llenar matriz normal
  this.aristas.forEach(arista => {

    matriz[arista.origen][arista.destino] = arista.peso

    if (!this.dirigido) {
      matriz[arista.destino][arista.origen] = arista.peso
    }

  })
  // sumatoria filas
  for (let i = 0; i < n; i++) {
    matriz[i][n] = matriz[i].slice(0,n).reduce((a,b)=>a+b,0)
  }

  // sumatoria columnas
  for (let j = 0; j < n; j++) {
    matriz[n][j] = matriz.reduce((acc,f)=>acc+f[j],0)
  }

  // suma total
  matriz[n][n] = matriz[n].slice(0,n).reduce((a,b)=>a+b,0)

  return matriz
},
  

calcularGrados() {

  return this.vertices.map((v,i)=>{

    let entrada = 0
    let salida = 0

    this.aristas.forEach(a=>{

      if(a.origen === i) salida++
      if(a.destino === i) entrada++

      if(!this.dirigido && a.origen === i && a.destino !== i) entrada++
      if(!this.dirigido && a.destino === i && a.origen !== i) salida++

    })

    return {
      nombre: v.nombre,
      entrada,
      salida
    }

  })

},

abrirModalMatriz() {
  this.tamanoMatriz = this.vertices.length || 3

  this.matrizEditable = Array(this.tamanoMatriz)
    .fill(0)
    .map(() => Array(this.tamanoMatriz).fill(0))

  this.mostrarModalMatriz = true
},

generarGrafoDesdeMatriz() {

  const n = this.matrizEditable.length

  // Crear vértices automáticos centrados
  this.vertices = []
  this.aristas = []

  const centroX = 400
  const centroY = 250
  const radio = 150

  for (let i = 0; i < n; i++) {
    const angulo = (2 * Math.PI * i) / n

    this.vertices.push({
      x: centroX + radio * Math.cos(angulo),
      y: centroY + radio * Math.sin(angulo),
      nombre: String.fromCharCode(65 + i) // A,B,C...
    })
  }

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {

      const valor = parseFloat(this.matrizEditable[i][j])

      if (!isNaN(valor) && valor !== 0) {

        if (!this.dirigido && j < i) continue

        this.aristas.push({
          origen: i,
          destino: j,
          peso: valor,
          dirigido: this.dirigido
        })
      }
    }
  }

  this.mostrarModalMatriz = false
  this.incrementarConvergencia()
},

async exportarJSON() {

  const grafo = {
    dirigido: this.dirigido,
    vertices: this.vertices,
    aristas: this.aristas
  }

  const json = JSON.stringify(grafo, null, 2)

  try {

    const handle = await window.showSaveFilePicker({
      suggestedName: "grafo.json",
      types: [
        {
          description: "Archivo JSON",
          accept: { "application/json": [".json"] }
        }
      ]
    })

    const writable = await handle.createWritable()
    await writable.write(json)
    await writable.close()

  } catch (err) {
    console.log("Guardado cancelado")
  }

},

importarJSON(event) {

  const archivo = event.target.files[0]
  if (!archivo) return

  const lector = new FileReader()

  lector.onload = (e) => {

    try {

      const grafo = JSON.parse(e.target.result)

      this.dirigido = grafo.dirigido || false
      this.vertices = grafo.vertices || []
      this.aristas = grafo.aristas || []

    } catch {
      alert("Archivo JSON inválido")
    }

  }

  lector.readAsText(archivo)
},

calcularConvergencia() {

  const matriz = this.generarMatriz()
  const n = matriz.length

  if (n === 0) return []

  let v = Array(n).fill(1/n)

  for (let iter = 0; iter < 20; iter++) {

    const nuevo = Array(n).fill(0)

    for (let i = 0; i < n; i++) {

      const sumaFila = matriz[i].reduce((a,b)=>a+b,0)

      if (sumaFila === 0) continue

      for (let j = 0; j < n; j++) {
        nuevo[j] += v[i] * (matriz[i][j] / sumaFila)
      }

    }

    v = nuevo
  }

  return v
},

incrementarConvergencia(){
  this.vectorConvergencia = this.calcularConvergencia()
}

  },

  ejecutarJohnson() {
    const n = this.vertices.length;
    if (n === 0) return alert("Crea algunos vértices primero");

    // 1. Paso Bellman-Ford: Creamos un nodo ficticio conectado a todos con peso 0
    // Esto sirve para calcular los "potenciales" h[i]
    const h = Array(n + 1).fill(0); 
    const aristasConFicticio = [...this.aristas];
    
    // Añadimos aristas desde un nodo imaginario (índice n) a todos los demás
    for (let i = 0; i < n; i++) {
      aristasConFicticio.push({ origen: n, destino: i, peso: 0 });
    }

    // Corremos Bellman-Ford para detectar ciclos negativos y obtener h
    const distanciasH = Array(n + 1).fill(Infinity);
    distanciasH[n] = 0;

    for (let i = 0; i < n; i++) { // Relajación V veces
      aristasConFicticio.forEach(a => {
        if (distanciasH[a.origen] !== Infinity && distanciasH[a.origen] + a.peso < distanciasH[a.destino]) {
          distanciasH[a.destino] = distanciasH[a.origen] + a.peso;
        }
      });
    }

    // Detectar si hay ciclo negativo
    let tieneCicloNegativo = false;
    aristasConFicticio.forEach(a => {
      if (distanciasH[a.origen] !== Infinity && distanciasH[a.origen] + a.peso < distanciasH[a.destino]) {
        tieneCicloNegativo = true;
      }
    });

    if (tieneCicloNegativo) {
      alert("⚠️ Error: Se detectó un ciclo negativo. Johnson no puede procesar esto.");
      return;
    }

    // 2. Paso Dijkstra: Ahora que tenemos los potenciales h, corremos Dijkstra desde cada nodo
    const potenciales = distanciasH.slice(0, n);
    const matrizFinal = [];

    for (let i = 0; i < n; i++) {
      matrizFinal.push(this.dijkstraJohnson(i, potenciales));
    }

    // Guardamos el resultado para mostrarlo en una tabla
    this.resultadosJohnson = matrizFinal;
  },

  dijkstraJohnson(inicio, h) {
    const n = this.vertices.length;
    const dist = Array(n).fill(Infinity);
    const visitado = Array(n).fill(false);
    dist[inicio] = 0;

    for (let i = 0; i < n; i++) {
      let u = -1;
      for (let j = 0; j < n; j++) {
        if (!visitado[j] && (u === -1 || dist[j] < dist[u])) u = j;
      }

      if (u === -1 || dist[u] === Infinity) break;
      visitado[u] = true;

      this.aristas.forEach(a => {
        let v = -1;
        let pesoReal = a.peso;

        if (a.origen === u) v = a.destino;
        else if (!this.dirigido && a.destino === u) v = a.origen;

        if (v !== -1) {
          // LA MAGIA: Re-pesado de Johnson para que el peso siempre sea positivo
          // w'(u,v) = w(u,v) + h(u) - h(v)
          const pesoModificado = pesoReal + h[u] - h[v];
          if (dist[u] + pesoModificado < dist[v]) {
            dist[v] = dist[u] + pesoModificado;
          }
        }
      });
    }

    // Devolvemos las distancias reales corrigiendo el re-pesado al final
    return dist.map((d, idx) => d === Infinity ? "∞" : (d - h[inicio] + h[idx]).toFixed(2));
  }
//end methods
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

.help-button{
 position: fixed;
 bottom: 25px;
 right: 25px;
 width: 58px;
 height: 58px;
 border-radius: 50%;
 background: #c9c49c;
 color: #381932;
 font-size: 28px;

 display: flex;
 align-items: center;
 justify-content: center;
 cursor: pointer;
 box-shadow: 0 8px 20px rgba(0,0,0,0.35);
 z-index: 1000;
 transition: all 0.25s ease;
}

.help-button:hover{
 transform: scale(1.1);
 background: #7f1740;
 color: rgb(248, 248, 248);
}


/* TOOLTIP */

.help-tooltip{
 position: fixed;
 bottom: 95px;
 right: 30px;
 background: #c9c49c;
 color: #381932;
 padding: 12px 16px;
 border-radius: 10px;
 font-size: 14px;
 font-family: fuente1, serif;
 box-shadow: 0 6px 18px rgba(0,0,0,0.35);
 animation: fadeIn 0.4s ease;
}


/* OVERLAY OSCURO */

.help-overlay{
 position: fixed;
 top:0;
 left:0;
 width:100%;
 height:100%;
 background: rgba(0,0,0,0.6);
 backdrop-filter: blur(3px);
 z-index:1500;

 display:flex;
 align-items:center;
 justify-content:center;

}


/* MODAL GUIA */

.help-modal{
 background:#2a1124;
 color:#c9c49c;
 padding:30px 35px;
 border-radius:16px;
 width:520px;
 max-height:80vh;
 overflow-y:auto;
 pointer-events:auto;
 box-shadow:0 15px 40px rgba(0,0,0,0.6);
 font-family:'Times New Roman', Times, serif;
 animation: popIn 0.25s ease;
}


/* TITULO GUIA */

.help-modal h2{
 text-align:center;
 margin-bottom:20px;
 font-family: fuente1, serif;
 letter-spacing:2px;
 color:#ffffffc5;
}


/* SUBTITULOS */

.help-modal h3{
 margin-top:18px;
 margin-bottom:8px;
 font-size:18px;
 color:#ebebebd6;
 border-bottom:1px solid rgba(201,196,156,0.3);
 padding-bottom:4px;
}


/* LISTAS */

.help-modal ul{
 margin:0;
 padding-left:18px;
}

.help-modal li{
 margin:6px 0;
 font-size:15px;
 color: #c9c49cd0;
 line-height:1.4;
}


/* BOTON CERRAR */

.help-modal button{
 margin-top:20px;
 background:#b9a8ac;
 border:none;
 margin: 25px auto 0 auto; 
 display: block;
 color:rgb(77, 45, 45);
 padding:8px 18px;
 border-radius:20px;
 cursor:pointer;
 font-family: fuente1, serif;
 transition:0.25s;
}

.help-modal button:hover{
 background:#c9c49c;
 color:#381932;
}

/* SCROLL PERSONALIZADO */

.help-modal::-webkit-scrollbar {
  width: 10px;
}

.help-modal::-webkit-scrollbar-track {
  background: #381932; /* fondo vino oscuro */
  border-radius: 10px;
}

.help-modal::-webkit-scrollbar-thumb {
  background: #c9c49c; /* dorado de tu UI */
  border-radius: 10px;
  border: 2px solid #381932;
}

.help-modal::-webkit-scrollbar-thumb:hover {
  background: #ab7f89; /* rosa de tus vértices */
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
  animation: aparecerNodo 0.25s ease;

}

@keyframes aparecerNodo{
  from{
    transform: translate(-50%, -50%) scale(0);
    opacity:0;
  }
  to{
    transform: translate(-50%, -50%) scale(1);
    opacity:1;
  }
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
  z-index: 1000; 
}

.modal-pequeno{
  background:#c9c49c;
  color:#351125;
  width:280px;
  padding:25px;
  border-radius:16px;
  display:flex;
  flex-direction:column;
  gap:15px;
  text-align:center;
  box-shadow:0 15px 40px rgba(0,0,0,0.35);
  font-family:'Times New Roman', Times, serif;
}

.modal-pequeno input{
  width:100%;
  padding:8px;
  border-radius:8px;
  border:1px solid #351125;
  text-align:center;
  font-size:14px;
}

.modal-pequeno button{
  padding:8px 12px;

  border:none;
  border-radius:10px;

  background:#351125;
  color:white;

  cursor:pointer;

  transition:0.2s;
}

.modal-pequeno button:hover{
  background:#4b1734;
  transform:scale(1.05);
}

.modal-matriz{
  background:#2a1025;
  padding:30px;
  border-radius:16px;
  color:white;
  box-shadow:0 10px 30px rgba(0,0,0,0.6);
  width:600px;
  max-width:90vw;
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
  justify-content: center;
  gap:10px;
  margin-top:5px;
}

.modal-botones button {
  padding: 5px 15px;
  border: none;
  background: #40152d;
  color: rgba(255, 255, 255, 0.712);
  border-radius: 10px;
  cursor: pointer;
  transition:0.2s;
  min-width: 90px;
}

.modal-botones button:hover{
  transform:scale(1.05);
  background:#4b1734;
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

.panel-inferior{
  display: flex;
  gap: 40px;
  align-items: flex-start;
  margin-top: 25px;
  flex-wrap: wrap;
}

/* CONTENEDORES */

.matriz, .grados{
  width: 90%;
  margin: 30px auto;
  color: white;
  padding: 25px;
  flex: 2;
  border-radius: 18px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.45);
}

.grado-item{
  transition: all 0.25s ease;
}

.grado-item:hover{
  transform: translateX(6px);
}

/* TITULOS */

.matriz h3,
.grados h3{
  margin-bottom: 15px;
  letter-spacing: 2px;
  color: #c9c49c;
}

/* TABLA MATRIZ */

table{
  width:100%;
  border-collapse:separate;
  border-spacing:6px;
}

td, th{
  padding:10px;
  text-align:center;
  border-radius:10px;
  transition: all 0.25s ease;
}

th{
  background:#4a203f;
  color:#c9c49c;
  font-weight:bold;
}

td{
  background:#381932;
}

tr:hover td{
  background:#522046;
}

td:hover{
  background:#7f1740;
  transform:scale(1.1);
  cursor:pointer;
  box-shadow:0 5px 15px rgba(0,0,0,0.4);
}

/* CELDAS CON CONEXION */

.conexion{
  color:white;
  font-weight:bold;
  transform:scale(1.05);
  animation: aparecer 0.3s ease;
}

@keyframes aparecer{
  from{
    transform: scale(0.6);
    opacity:0;
  }
  to{
    transform: scale(1);
    opacity:1;
  }
}

/* FILAS / COLUMNAS DE SUMA */

.suma{
  background:#6a2b55;
  font-weight:bold;
  color:#fff2c6;
}

/* GRADOS */

.grados{
  flex:1;
}

.grado-item{
  background:#654e61;
  padding:12px;
  border-radius:10px;
  margin-bottom:10px;
  display:flex;
  flex-direction:column;
  gap:4px;
  transition:0.2s;
}

.grado-item:hover{
  background:#7f1740;
  transform:translateY(-2px);
}

/* MODAL */

.modal-overlay{
  position:fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background:rgba(0,0,0,0.55);
  display:flex;
  justify-content:center;
  align-items:center;
  z-index:1000;
}

.modal{
  background:#2a1025;
  padding:30px;
  border-radius:16px;
  color:white;
  box-shadow:0 10px 30px rgba(0,0,0,0.6);
  width:600px;        /* ancho del contenedor */
  max-width:90vw; 
}

.tabla-modal td{
  background:none;
  max-height:400px; 
}

.tabla-modal input{
  width:50px;
  padding:6px;
  border-radius:6px;
  border:none;
  text-align:center;
  font-size:15px;
}



.suma{
  background-color: #5a2a4a;
  font-weight: bold;
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

.contador-convergencia{
  color: #c9c49c;
  font-size: 20px;
  margin-left: 80px;
  margin-top: 10px;
  font-family: fuente1, serif;
}

path{
  stroke-dasharray: 300;
  stroke-dashoffset: 300;
  animation: dibujarLinea 0.4s ease forwards;
}

@keyframes dibujarLinea{
  to{
    stroke-dashoffset: 0;
  }
}

</style>
