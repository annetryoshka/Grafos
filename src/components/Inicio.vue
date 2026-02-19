<script setup>
import { useRouter } from 'vue-router'
import logo from "../imgs/logoUCB.png"
import grafo from "../imgs/grafoej.png"
import homeicon from "../imgs/homeicon.png"

const router = useRouter()
const irAGrafos = () => router.push('/grafos')
const irAAcerca = () => router.push('/acerca')
</script>

<template>
  <div class="container">

    <header class="header">
      <img :src="homeicon" alt="Inicio" class="logo-home" />
      <div class="nav-buttons">
        <button @click="router.push('/')">Inicio</button>
        <button @click="irAAcerca">Acerca</button>
        <button @click="irAGrafos">Grafos</button>
      </div>
    </header>

    <main class="main">
      <div class="left">
        <div class="top-block">
          <img :src="logo" class="logo" />
          <div class="uni-block">
            <div class="linea-vertical"></div>
            <div class="text-block">
              <h1 class="universidad">Universidad</h1>
              <h1 class="catolica">Católica</h1>
              <h2 class="boliviana">Boliviana</h2>
            </div>
            <div class="linea-vertical"></div>
          </div>
        </div>

        <div class="course">
          <h2>Análisis de Algoritmos</h2>
          <h3>MAT-361</h3>
        </div>
      </div>

      <div class="right">
        <img :src="grafo" class="grafo" />
      </div>
    </main>

    <footer class="footer">
      <span>Adriana Pando</span>
      <span>Ingeniería de Sistemas</span>
      <span>La Paz, 1-2026</span>
    </footer>
  </div>
</template>
