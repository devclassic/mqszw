<template>
  <RouterView />
</template>

<script setup>
  import { onMounted } from 'vue'
  import { usePermissionStore } from './stores/usePermissionStore'

  const permissionStore = usePermissionStore()

  onMounted(() => {
    // 锁定 Android 浏览器的竖屏模式
    // 仅在 Android 设备上生效
    if (!/android/i.test(navigator.userAgent)) return
    const html = document.documentElement
    const initH = window.innerHeight
    html.style.setProperty('--initH', `${initH}px`)
    html.classList.add('android-lock')
    //请求浏览器录音权限
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(stream => {
        permissionStore.hasAudioPermission = true
        console.log('录音权限已获取')
      })
      .catch(err => {
        permissionStore.hasAudioPermission = true
        console.error('获取录音权限失败:', err)
      })
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
