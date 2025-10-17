<template>
  <div class="page">
    <div class="img"></div>
    <div class="logo"></div>
    <div v-if="state.isAsr" class="asr"></div>
    <div class="input-box">
      <input type="text" v-model="state.query" class="input" />
      <div
        @mousedown="asrstart"
        @mouseup="asrstop"
        @touchstart="asrstart"
        @touchend="asrstop"
        class="mic"></div>
      <div @click="state.showList = !state.showList" class="btn"></div>
    </div>
    <div v-if="state.showList" class="list">
      <div @click="submit('如何办')" class="item">
        <div class="icon icon-1"></div>
        <div class="value">如何办</div>
      </div>
      <div @click="submit('问政策')" class="item">
        <div class="icon icon-2"></div>
        <div class="value">问政策</div>
      </div>
    </div>
    <div class="line"></div>
    <div class="text"></div>
  </div>
</template>

<script setup>
  import { reactive, watch } from 'vue'
  import { useInput } from '../hooks/useInput'
  import { useRouter } from 'vue-router'
  import { useLinkStore } from '../stores/useLinkStore'
  import { useRecorder } from '../hooks/useRecorder'
  import { usePermissionStore } from '../stores/usePermissionStore'

  const state = reactive({
    showList: false,
    query: '',
    isAsr: false,
    isRecording: false,
  })

  useInput()

  const router = useRouter()
  const store = useLinkStore()
  const recorder = useRecorder()
  const permissionStore = usePermissionStore()

  watch(
    () => state.isRecording,
    async isRecording => {
      if (!permissionStore.hasAudioPermission) {
        alert('未能获取录音权限')
        return
      }
      if (isRecording) {
        recorder.start()
        state.isAsr = true
      } else {
        state.isAsr = false
        const text = await recorder.getResult()
        state.query = text
      }
    }
  )

  const asrstart = () => {
    state.isRecording = true
  }

  const asrstop = () => {
    state.isRecording = false
  }

  const submit = type => {
    store.type = type
    store.query = state.query
    router.push('/chat')
  }
</script>

<style scoped>
  .page {
    background: linear-gradient(to bottom, #ffffff 50%, #abdef0 100%);
  }

  .img {
    width: 100%;
    height: 102vw;
    background: url('../assets/index-img.png') no-repeat center / 100% 100%;
  }

  .logo {
    width: 49.73333333333333vw;
    height: 7.333333333333333vw;
    background: url('../assets/index-logo.png') no-repeat center / 100% 100%;
    position: absolute;
    top: 113.3333333333333vw;
    left: 50%;
    transform: translateX(-50%);
  }

  .input-box {
    width: 81.2vw;
    height: 7.466666666666667vw;
    background: url('../assets/index-input.png') no-repeat center / 100% 100%;
    position: absolute;
    top: 124.9333333333333vw;
    left: 50%;
    transform: translateX(-50%);
  }

  .input {
    width: 57.33333333333333vw;
    height: 4vw;
    line-height: 4vw;
    position: absolute;
    top: 1.733333333333333vw;
    left: 7.066666666666667vw;
    font-size: 2.933333333333333vw;
    color: #969696;
    border: none;
    outline: none;
  }

  .mic {
    width: 2.666666666666667vw;
    height: 3.333333333333333vw;
    position: absolute;
    top: 2.133333333333333vw;
    right: 13.06666666666667vw;
  }

  .btn {
    width: 10.66666666666667vw;
    height: 5.066666666666667vw;
    position: absolute;
    top: 1.2vw;
    right: 0.9333333333333333vw;
  }

  .list {
    padding: 2vw;
    border: 1px solid #ebebeb;
    border-radius: 10px;
    position: absolute;
    top: 132.6666666666667vw;
    right: 9.333333333333333vw;
    background: #ffffff;
  }

  .item {
    height: 5.333333333333333vw;
    display: flex;
    align-items: center;
    line-height: 1;
  }

  .icon {
    width: 2.533333333333333vw;
    height: 2.133333333333333vw;
  }

  .icon-1 {
    background: url('../assets/index-icon-1.png') no-repeat center / 100% 100%;
  }

  .icon-2 {
    background: url('../assets/index-icon-2.png') no-repeat center / 100% 100%;
  }

  .value {
    font-size: 2.133333333333333vw;
    margin-left: 2vw;
  }

  .line {
    width: 100%;
    height: 2.666666666666667vw;
    background: url('../assets/index-line.png') no-repeat center / 100% 100%;
    position: absolute;
    bottom: 18vw;
  }

  .text {
    width: 47.33333333333333vw;
    height: 2.666666666666667vw;
    background: url('../assets/index-text.png') no-repeat center / 100% 100%;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 8.666666666666667vw;
  }

  .asr {
    width: 20vw;
    height: 20vw;
    background: url('../assets/asr.gif') no-repeat center / 100% 100%;
    z-index: 999;
    position: absolute;
    top: 110vw;
    right: 15vw;
  }
</style>
