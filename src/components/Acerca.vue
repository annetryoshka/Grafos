<script setup>
import { useRouter } from "vue-router"
import grafo1 from "../imgs/grafo1.png"
import grafo2 from "../imgs/grafo2.png"

const router = useRouter()

const irAGrafos = () => {
  router.push("/grafos")
}

const volverInicio = () => {
  router.push("/")
}
</script>


<template>
  <section class="container acerca-section">
    

    <!-- Título principal -->
    <div class="acerca-header">
      <h1>Grafos</h1>
      <div class="linea-separadora"></div>
    </div>

    <!-- Bloque 1 -->
    <div class="bloque-horizontal">
      <div class="texto">
        <p>
          Un grafo es una estructura compuesta por nodos (vértices) y aristas
          que conectan dichos nodos entre sí. Permite modelar relaciones,
          caminos y conexiones de manera visual y lógica.
        </p>
        <p>
          Los nodos representan entidades, mientras que las aristas representan
          relaciones entre ellas. Por ejemplo, en una red de transporte,
          los nodos serían ciudades y las aristas las rutas.
        </p>
      </div>

      <div class="imagen-lateral">
        <img :src="grafo1" alt="Ejemplo grafo" />
      </div>
    </div>

    <div class="linea-separadora"></div>

    <!-- Bloque 2 -->
    <div class="bloque-horizontal invertido">
      <div class="imagen-lateral">
        <img :src="grafo2" alt="Tipos de grafos" />
      </div>

      <div class="texto">
        <h2>Tipos de Grafos</h2>
        <p>
          Existen grafos dirigidos, donde las aristas tienen dirección,
          y grafos no dirigidos, donde la relación es bidireccional.
        </p>
        <p>
          También existen grafos ponderados, que asignan un peso o costo
          a cada arista, y grafos cíclicos o acíclicos dependiendo de si
          contienen ciclos.
        </p>
      </div>
    </div>

    <div class="linea-separadora"></div>

    <!-- Bloque 3 -->
    <div class="bloque-vertical">
      <h2>Aplicaciones y Algoritmos</h2>
      <p>
        Los grafos tienen aplicaciones fundamentales en ciencias de la
        computación, redes sociales, biología y logística.
      </p>
      <p>
        Sobre ellos se aplican algoritmos como Dijkstra, Kruskal,
        DFS y BFS para resolver problemas de búsqueda y optimización.
      </p>
    </div>

    <div class="linea-separadora"></div>

    <!-- Video -->
    <div class="video-container">
      <iframe
        src="https://www.youtube.com/embed/_A9EpjnmZz4"
        title="Video sobre Grafos"
        allowfullscreen>
      </iframe>
    </div>

    <!-- BOTONES FINALES -->

    <div class="botones-finales">
  <router-link to="/" class="boton-volver">
    Volver a Inicio
  </router-link>

  <router-link to="/grafos" class="boton-crear">
    Crear Grafo
  </router-link>
</div>



  </section>
</template>
