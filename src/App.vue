<template>
  <div v-if="state.showPermission" class="permission">
    <div @click="getPermission" class="requestbtn">点击获取语音权限</div>
  </div>
  <RouterView />
</template>

<script setup>
  import { onMounted, reactive } from 'vue'
  import { usePermissionStore } from './stores/usePermissionStore'

  const state = reactive({
    showPermission: true,
  })

  const permissionStore = usePermissionStore()

  async function requestPermission() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('您的浏览器不支持录音功能')
      return false
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(track => track.stop()) // 立即释放
      return true
    } catch (err) {
      console.error('麦克风权限获取失败:', err)
      return false
    }
  }

  const getPermission = async () => {
    const has = await requestPermission()
    permissionStore.hasAudioPermission = has
    if (!has) {
      alert('未获取麦克风权限')
    }
    state.showPermission = false
  }

  onMounted(() => {
    // 锁定 Android 浏览器的竖屏模式
    // 仅在 Android 设备上生效
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

  .permission {
    width: 80vw;
    background: #ffffff;
    border: 2px solid #999999;
    z-index: 9999;
    position: fixed;
    top: 58%;
    left: 50%;
    transform: translate(-50%, 0);
    padding: 10vw;
  }

  .requestbtn {
    width: 100%;
    height: 8vw;
    font-size: 3vw;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    background: #000000;
  }
</style>
