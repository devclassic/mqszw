<template>
  <RouterView />
</template>

<script setup>
  import { onMounted } from 'vue'

  onMounted(() => {
    if (!/android/i.test(navigator.userAgent)) return
    const html = document.documentElement
    const initH = window.innerHeight
    html.style.setProperty('--initH', `${initH}px`)
    html.classList.add('android-lock')
  })
</script>

<style>
  body {
    margin: 0;
  }

  * {
    box-sizing: border-box;
  }

  .page {
    width: 100vw;
    height: 100vh;
    position: fixed;
  }

  html.android-lock,
  html.android-lock body {
    margin: 0;
    padding: 0;
    overflow: hidden !important;
    width: 100vw;
    height: var(--initH, 100vh);
    position: relative;
  }

  html.android-lock .page {
    width: 100vw;
    height: var(--initH, 100vh);
    position: fixed;
    top: 0;
    left: 0;
    will-change: transform;
    transition: transform 0.25s;
  }
</style>
