<template>
  <div class="page">
    <div class="title"></div>
    <div @click="back" class="back"></div>
    <div class="box">
      <div ref="wrap" class="wrap">
        <template v-for="item in state.messages">
          <div v-if="item.pos == 'left'" class="item left">
            <div class="avatar"></div>
            <div class="message" v-html="item.text"></div>
          </div>
          <div v-else class="item right">
            <div class="message" v-html="item.text"></div>
          </div>
        </template>
      </div>
    </div>
    <div v-if="state.isAsr" class="asr"></div>
    <div class="input-box">
      <input type="text" v-model="state.query" class="input" />
      <div
        @mousedown="asrstart"
        @mouseup="asrstop"
        @touchstart="asrstart"
        @touchend="asrstop"
        class="mic"></div>
      <div @click="submit" class="btn"></div>
    </div>
    <div class="line"></div>
  </div>
</template>

<script setup>
  import { useInput } from '../hooks/useInput'
  import { useRouter } from 'vue-router'
  import { useLinkStore } from '../stores/useLinkStore'
  import { useRecorder } from '../hooks/useRecorder'
  import { reactive, onMounted, useTemplateRef, watch } from 'vue'
  import { fetchEventSource } from '@microsoft/fetch-event-source'
  import markdownit from 'markdown-it'

  const state = reactive({
    query: '',
    messages: [],
    isAsr: false,
    isRecording: false,
    wrapRef: useTemplateRef('wrap'),
  })

  useInput()

  const router = useRouter()
  const store = useLinkStore()
  const recorder = useRecorder()
  const md = markdownit()

  onMounted(() => {
    state.messages.push({
      pos: 'right',
      text: store.query,
    })
    const message = reactive({
      pos: 'left',
      text: '',
    })
    state.messages.push(message)
    const ctrl = new AbortController()
    const base = import.meta.env.VITE_API_BASE || ''
    let result = ''
    fetchEventSource(`${base}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: store.type, query: store.query }),
      signal: ctrl.signal,
      openWhenHidden: true,
      onmessage(event) {
        if (event.data) {
          try {
            const data = JSON.parse(event.data)
            if (data.answer) {
              result += data.answer
              message.text = md.render(result)
              state.wrapRef.scrollTo({
                top: state.wrapRef.scrollHeight,
                behavior: 'smooth',
              })
            }
          } catch {}
        }
      },
      onerror(err) {
        console.error('流式连接出错:', err)
        ctrl.abort()
      },
      onclose() {
        console.log('流式连接关闭')
      },
    })
  })

  watch(
    () => state.isRecording,
    async isRecording => {
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

  const back = () => {
    router.push('/')
  }

  const submit = () => {
    state.messages.push({
      pos: 'right',
      text: state.query,
    })
    const message = reactive({
      pos: 'left',
      text: '',
    })
    state.messages.push(message)
    const ctrl = new AbortController()
    const base = import.meta.env.VITE_API_BASE || ''
    let result = ''
    const query = state.query
    state.query = ''
    fetchEventSource(`${base}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: store.type, query }),
      signal: ctrl.signal,
      openWhenHidden: true,
      onmessage(event) {
        if (event.data) {
          try {
            const data = JSON.parse(event.data)
            if (data.answer) {
              result += data.answer
              message.text = md.render(result)
              state.wrapRef.scrollTo({
                top: state.wrapRef.scrollHeight,
                behavior: 'smooth',
              })
            }
          } catch {}
        }
      },
      onerror(err) {
        console.error('流式连接出错:', err)
        ctrl.abort()
      },
      onclose() {
        console.log('流式连接关闭')
      },
    })
  }
</script>

<style scoped>
  .page {
    background: #e0f1fc;
  }

  .title {
    width: 41.86666666666667vw;
    height: 4.4vw;
    background: url('../assets/chat-title.png') no-repeat center / 100% 100%;
    position: absolute;
    top: 5.066666666666667vw;
    left: 50%;
    transform: translateX(-50%);
  }

  .back {
    width: 21.2vw;
    height: 5.866666666666667vw;
    background: url('../assets/chat-back.png') no-repeat center / 100% 100%;
    position: absolute;
    top: 11.73333333333333vw;
    left: 3.733333333333333vw;
  }

  .box {
    position: absolute;
    top: 19.73333333333333vw;
    left: 3.733333333333333vw;
    right: 3.733333333333333vw;
    bottom: 5.333333333333333vw;
    background: #ffffff;
    padding: 3.466666666666667vw;
  }

  .wrap {
    position: absolute;
    top: 0;
    left: 3.466666666666667vw;
    right: 3.466666666666667vw;
    bottom: 16.66666666666667vw;
    overflow: auto;
  }

  .item {
    display: flex;
    margin-top: 5.333333333333333vw;
  }

  .avatar {
    width: 10.66666666666667vw;
    height: 10.66666666666667vw;
    background: url('../assets/chat-avatar.png') no-repeat center / 100% 100%;
  }

  .message {
    width: fit-content;
    max-width: 45.33333333333333vw;
    padding: 4vw;
    position: relative;
    font-size: 2.666666666666667vw;
    color: #858585;
    border-radius: 5px;
  }

  .item.left {
    justify-content: start;
  }

  .item.left .message {
    margin-left: 2.4vw;
    background: linear-gradient(to bottom, #ceebfb, #dcf1fc);
  }

  .item.left .message::before {
    content: '';
    width: 0.8vw;
    height: 1.333333333333333vw;
    background: url('../assets/chat-msg-left.png') no-repeat center / 100% 100%;
    position: absolute;
    top: 0.6666666666666667vw;
    left: -0.8vw;
  }

  .item.right {
    justify-content: end;
  }

  .item.right .message {
    margin-right: 2.4vw;
    background: linear-gradient(to bottom, #caffec, #dafff1);
  }

  .item.right .message::before {
    content: '';
    width: 0.8vw;
    height: 1.333333333333333vw;
    background: url('../assets/chat-msg-right.png') no-repeat center / 100% 100%;
    position: absolute;
    top: 0.6666666666666667vw;
    right: -0.8vw;
  }

  .input-box {
    width: 82.53333333333333vw;
    height: 11.2vw;
    background: url('../assets/chat-input.png') no-repeat center / 100% 100%;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 9.733333333333333vw;
  }

  .input {
    width: 46.66666666666667vw;
    height: 5.333333333333333vw;
    line-height: 5.3333333333333334vw;
    position: absolute;
    top: 2.933333333333333vw;
    left: 9.866666666666667vw;
    font-size: 2.933333333333333vw;
    color: #858585;
    border: none;
    outline: none;
  }

  .mic {
    width: 4vw;
    height: 5.333333333333333vw;
    position: absolute;
    top: 3.066666666666667vw;
    right: 19.86666666666667vw;
  }

  .btn {
    width: 13.86666666666667vw;
    height: 6.666666666666667vw;
    position: absolute;
    top: 2.666666666666667vw;
    right: 3.066666666666667vw;
  }

  .line {
    width: 100%;
    height: 1.6vw;
    background: url('../assets/chat-line.png') no-repeat center / 100% 100%;
    position: absolute;
    bottom: 3.733333333333333vw;
  }

  .asr {
    width: 20vw;
    height: 20vw;
    background: url('../assets/asr.gif') no-repeat center / 100% 100%;
    z-index: 999;
    position: absolute;
    right: 20.5vw;
    bottom: 16vw;
  }
</style>
