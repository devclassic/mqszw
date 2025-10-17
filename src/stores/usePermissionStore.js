import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const usePermissionStore = defineStore('link', () => {
  const state = reactive({
    hasAudioPermission: false,
  })
  return state
})
