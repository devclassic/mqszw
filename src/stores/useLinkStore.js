import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useLinkStore = defineStore('link', () => {
  const state = reactive({
    type: '',
    query: '',
  })
  return state
})
