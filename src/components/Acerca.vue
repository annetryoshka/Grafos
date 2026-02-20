<script setup>
import { useRouter } from "vue-router"
import { ref } from "vue"
import grafo1 from "../imgs/grafo1.png"
import algoritmo_base from "../imgs/algoritmo_base.png"

const router = useRouter()
</script>

<template>
  <section class="container acerca-section">
    
    <router-link to="/" class="btn-top-volver">Volver al inicio</router-link>

    <div class="acerca-header">
      <h1 class="main-title">Enciclopedia de Algoritmos y Grafos</h1>
    </div>

    <div class="bloque-horizontal">
      <div class="texto-destacado">
        <div class="header-pregunta">
          <h2>¿Qué es un Algoritmo?</h2>
        </div>
        <p>
          Un algoritmo es un conjunto de instrucciones definidas, ordenadas y acotadas para resolver un problema o realizar un cálculo. Es el paso previo a escribir código: primero definimos la lógica, luego la traducimos al lenguaje de la máquina.
        </p>
        
        <div class="timeline-container">
          <div class="timeline-labels">
            <span><strong>Input:</strong> informacion real</span>
            <span><strong>Proceso:</strong> pasos de transformación</span>
            <span><strong>Output:</strong> resultado final</span>
          </div>
          <div class="timeline-line">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
          </div>
        </div>
      </div>

      <div class="imagen-lateral">
        <img :src="algoritmo_base" alt="Esquema Algoritmo" class="img-3d" />
      </div>
    </div>

    <div class="grid-caracteristicas">
      <div class="item-carac"><strong>Precisos:</strong> Objetivos, sin ambigüedad.</div>
      <div class="item-carac"><strong>Finitos:</strong> Número determinado de pasos.</div>
      <div class="item-carac"><strong>Definidos:</strong> Misma entrada = mismo resultado.</div>
    </div>

    <div class="linea-separadora"></div>

    <div class="acerca-header">
      <h3 class="algoritmos-title">Algoritmos de Búsqueda</h3>
    </div>

    <div class="grid-algoritmos">
      <div class="card-algoritmo">
        <h3>Búsqueda Secuencial</h3>
        <p>Recorre los elementos uno a uno. No requiere que los datos estén ordenados.</p>
        <pre><code>// O(n)
if (arr[i] == clave) return i;</code></pre>
      </div>
      
      <div class="card-algoritmo">
        <h3>Búsqueda Binaria</h3>
        <p>Divide el conjunto en dos repetidamente. <strong>Requiere datos ordenados.</strong></p>
        <pre><code>// O(log n)
medio = (inicio + fin) / 2;</code></pre>
      </div>
    </div>



    <div class="linea-separadora"></div>

    <div class="acerca-header">
      <h3 class="algoritmos-title">Algoritmos de Ordenación</h3>
    </div>

    <div class="grid-algoritmos">
      <div class="card-algoritmo">
        <h3>Selección Directa</h3>
        <p>Busca el elemento más pequeño y lo coloca al inicio, repitiendo el proceso para los restantes.</p>
        <pre><code>// Busca el menor y lo intercambia
if (A[j] &lt; menor) { menor = A[j]; pos = j; }</code></pre>
      </div>
      <div class="card-algoritmo">
        <h3>Inserción Directa</h3>
        <p>Compara cada elemento con los anteriores y lo inserta en su posición correcta desplazando el resto.</p>
        <pre><code>// Desplaza mayores a la derecha
while (j >= 0 && arr[j] > actual) { ... }</code></pre>
      </div>
    </div>

    <div class="linea-separadora"></div>

    <div class="acerca-header">
      <h3 class="algoritmos-title">Teoría de Grafos</h3>
    </div>

    <div class="bloque-horizontal invertido">
      <div class="imagen-lateral">
        <img :src="grafo1" alt="Tipos de Grafos" class="img-3d" />
      </div>
      <div class="texto-destacado">
        <ul class="lista-tipos">
          <li><strong>Grafo Dirigido:</strong> Las aristas tienen una dirección específica.</li>
          <li><strong>Grafo No Dirigido:</strong> Las relaciones son bidireccionales.</li>
          <li><strong>Grafo Ponderado:</strong> Las aristas incluyen pesos (costo, distancia).</li>
          <li><strong>Cíclicos y Acíclicos:</strong> Dependiendo de si permiten volver al origen.</li>
        </ul>
      </div>
    </div>

    <div class="linea-separadora"></div>

    <div class="acerca-header">
      <h3 class="algoritmos-title">Algoritmos Aleatorios</h3>
    </div>

    <div class="grid-algoritmos-ejemplos">
      
      <div class="card-ejemplo">
        <div class="info-texto">
          <h3>Algoritmo Las Vegas</h3>
          <p>
            Siempre produce una solución correcta con un tiempo de ejecución aleatorio. 
            Un ejemplo típico es el <strong>QuickSort Aleatorio</strong>.
          </p>
        </div>
        <div class="codigo-visual">
          <div class="terminal-header">Ejemplo: QuickSortAleatorio.java</div>
          <pre><code>public static void quickSort(int[] arr, int inicio, int fin) {
    if (inicio < fin) {
        int p = particion(arr, inicio, fin);
        quickSort(arr, inicio, p - 1);
        quickSort(arr, p + 1, fin);
    }
}

private static int particion(int[] arr, int inicio, int fin) {
    int pivoteIndex = inicio + rand.nextInt(fin - inicio + 1);
    swap(arr, pivoteIndex, fin);
    // ... lógica de partición
}</code></pre>
        </div>
      </div>

      <div class="card-ejemplo">
        <div class="info-texto">
          <h3>Algoritmo de Monte Carlo</h3>
          <p>
            El resultado puede ser incorrecto con cierta probabilidad, pero el error 
            se controla aumentando las repeticiones. Ejemplo: <strong>Estimación de PI</strong>.
          </p>
        </div>
        <div class="codigo-visual">
          <div class="terminal-header">Ejemplo: MonteCarloPi.java</div>
          
          <pre><code>for (int i = 0; i < puntos; i++) {
    double x = rand.nextDouble(); 
    double y = rand.nextDouble();

    if (x * x + y * y <= 1) { 
        dentro++;
    }
}
double pi = 4.0 * dentro / puntos;</code></pre>
        </div>
      </div>

    </div>

    <div class="botones-finales">
      <router-link to="/" class="boton-volver">Volver a Inicio</router-link>
      <router-link to="/grafos" class="boton-crear">Ir al Editor de Grafos</router-link>
    </div>

  </section>
</template>

<style scoped>
/* Estilos Base */
.acerca-section {
  color: #f0f0f0;
  padding: 60px 10%;
  background-color: #381932;
  min-height: 100vh;
  position: relative;
  font-family: 'Times New Roman', Times, serif;
}

/* Botón Superior Estilo Foto */
.btn-top-volver {
  position: absolute;
  top: 25px;
  left: 30px;
  border: 1px solid #f0f0f0;
  color: #f0f0f0;
  padding: 6px 18px;
  border-radius: 20px;
  text-decoration: none;
  font-size: 0.85rem;
  transition: 0.3s;
}

.btn-top-volver:hover {
  background-color: transparent; /* El color crema de tus títulos */
  color: #c9c49c;            /* El morado oscuro del fondo para que contraste */
  border-color: #c9c49c;
  font-family: 'Times New Roman', Times, serif;
}

/* Títulos */
.main-title {
  font-family: 'fuente1', serif;
  font-size: 3.5rem;
  color: #c9c49c;
  margin-bottom: 50px;
  text-align: center;
}

.section-subtitle {
  color: white;
  font-size: 46px;
  text-align: left;
  margin-top: 40px;
}

.algoritmos-title {
  font-size: 2.8rem;
  color: #c9c49ca7;
  text-align: left;
  font-family: fuente1, serif;
  font-size: 34px;
  margin: 5px 0;
}

.descripcion-seccion {
  text-align: left;
  margin-bottom: 30px;
  color:#ffffffce;
  font-size: 18px;
  opacity: 0.8;
}

/* Bloques Horizontales */
.bloque-horizontal {
  display: flex;
  align-items: center;
  gap: 50px;
  font-size: 20px;
  color:#ffffffce;
  margin-bottom: 40px;
}
.imagen-lateral .img-3d {
  width: 100%;           /* Hace que use el espacio disponible */
  max-width: 400px;      /* <--- Cambia este número (ej: 250px para pequeña, 500px para grande) */
  height: auto;          /* Mantiene la proporción para que no se deforme */
  filter: drop-shadow(0 10px 20px rgba(0,0,0,0.4));
  transition: transform 0.3s ease;
}

.invertido { flex-direction: row-reverse; }

.texto-destacado {
  flex: 1.5;
  border-left: 3px solid #6b3e64;
  padding-left: 25px;
}

/* Timeline */
.timeline-container {
  margin-top: 40px;
  max-width: 600px;
}

.timeline-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  color: #ffffff67;
  font-size: 24px;
}

.timeline-line {
  height: 2px;
  background: #c9c49c;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dot {
  width: 10px;
  height: 10px;
  background: #c9c49c;
  border-radius: 50%;
  border: 2px solid #381932;
}

/* Imágenes */
.imagen-lateral { flex: 1; display: flex; justify-content: center; }
.img-3d {
  max-width: 600px;
  filter: drop-shadow(0 10px 20px rgba(0,0,0,0.4));
}

/* Grid de Tarjetas */
.grid-algoritmos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
}

.grid-algoritmos-ejemplos {
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin-top: 20px;
}

.card-algoritmo {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(201, 196, 156, 0.15);
  padding: 20px;
  align-items: center;
  border-radius: 12px;
}

.card-ejemplo {
  display: flex;
  gap: 30px;
  background: rgba(255, 255, 255, 0.03);
  padding: 25px;
  border-radius: 15px;
  border: 1px solid rgba(201, 196, 156, 0.1);
  align-items: flex-start;
}

.info-texto {
  flex: 1;
}

.info-texto h3 {
  color: #c9c49c;
  font-size: 1.6rem;
  margin-bottom: 15px;
}

/* Estilo de "Ventana de Código" */
.codigo-visual {
  flex: 1.5;
  background: #1a0b18;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0,0,0,0.4);
}

.terminal-header {
  background: #2d1629;
  padding: 8px 15px;
  font-family: monospace;
  font-size: 0.8rem;
  color: #e6708c;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

pre {
  background: #1e0d1b;
  padding: 20px;
  margin: 0;
  border-radius: 8px;
  color: #c9c49c;
  font-family: monospace;
  font-size: 0.85rem;
  line-height: 1.5;
  margin-top: 15px;
  overflow-x: auto;
}

/* Características Grid */
.grid-caracteristicas {
  display: flex;
  justify-content: space-between;
  background: rgba(49, 7, 7, 0.398);
  padding: 15px;
  align-items: center;
  border-radius: 10px;
  margin-top: 20px;
}

.lista-tipos { 
  list-style: none; 
  padding: 0; 
}

.lista-tipos li { 
  margin-bottom: 10px; 
  font-size: 1.1rem;
  font-size: 20px; 
}

.linea-separadora {
  border-bottom: 1px solid rgba(201, 196, 156, 0.2);
  margin: 60px 0;
}

.botones-finales {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 60px;
  padding-bottom: 40px;
}

.boton-volver, .boton-crear {
  padding: 12px 30px;
  border-radius: 30px;
  text-decoration: none;
  font-family: 'fuente1', serif;
}

.boton-volver { border: 1px solid #c9c49c; color: #c9c49c; }
.boton-crear { background: transparent; color: #c9c49c; border-color: #c9c49c; }

@media (max-width: 900px) {
  .card-ejemplo {
    flex-direction: column;
  }
  .main-title {
    font-size: 2.5rem;
  }
}

</style>