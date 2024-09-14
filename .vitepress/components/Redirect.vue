<script setup>
import { onMounted } from 'vue'

const props = defineProps({
  to: String
})

let to = props.to

if (to.endsWith('.md')) {
  to = to.slice(0, -3) + '.html'
}

onMounted(async () => {
  setTimeout(() => {
    location.href = to
  }, 1_500)
})

</script>

<template>
  <div>
    <h1>页面已调整，准备重定向到 {{ to }}</h1>
  </div>
</template>

<style scoped>

</style>