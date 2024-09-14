<script setup>
import { onMounted, ref, reactive, watch } from 'vue'
import markdownit from 'markdown-it'
import { ElForm, ElFormItem, ElInput } from 'element-plus'
import 'element-plus/dist/index.css'

const ruleFormRef = ref()
const show = ref(true)
const form = reactive({
  host: 'gitlab.example.com',
  port: 443
})

const rules = reactive({
  host: [
    { required: true, message: 'GitLab 实例的 host 必填', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        try {
          if (value.endsWith('.')) {
            return callback(new Error('host 不合法'))
          }
          const url = new URL('https://' + value)
          if (url.host !== value) {
            return callback(new Error('host 不合法'))
          }
        } catch (error) {
          return callback(new Error('host 不合法'))
        }
        return callback()
      }, trigger: 'blur'
    }
  ],
  port: [
    { required: true, message: 'GitLab 实例的 端口 必填', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value < 1 || value > 65535) {
          return callback(new Error('端口范围在 1 到 65535 之间'))
        }
        return callback()
      }, trigger: 'blur'
    }
  ]
})

const md = markdownit()

const command = function () {
  const result = md.render(`
    sudo mkdir -p /etc/gitlab-runner/certs
    sudo openssl s_client -showcerts -connect ${form.host}:${form.port} -servername ${form.host} < /dev/null 2>/dev/null | openssl x509 -outform PEM > /etc/gitlab-runner/certs/${form.host}.crt
    sudo echo | openssl s_client -CAfile /etc/gitlab-runner/certs/${form.host}.crt -connect ${form.host}:${form.port} -servername ${form.host}
  `, { lang: 'shell' })

  // console.log(result)
  document.getElementById('gitlab-runner-trust-certificate').innerHTML = result
}

onMounted(async () => {
  command()
})

watch(() => [ form.host, form.port ], () => {
    ruleFormRef.value.validate((valid, fields) => {
      // console.log(valid)
      if (valid === true) {
        show.value = valid
        command()
      } else {
        show.value = false
      }
    })
  }
)

</script>

<template>
  <div style="margin-top: 30px">
    <el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="auto" style="max-width: 400px">
      <el-form-item label="GitLab 地址 host" prop="host">
        <el-input v-model="form.host" />
      </el-form-item>
      <el-form-item label="GitLab 端口 port" prop="port">
        <el-input type="number" v-model="form.port" />
      </el-form-item>
    </el-form>

    <div class="language-shell vp-adaptive-theme">
      <button title="Copy Code" class="copy"></button><span class="lang">shell</span>
      <div id="gitlab-runner-trust-certificate" :style="{ display: show ? 'block' : 'none' }"></div>
    </div>
  </div>
</template>

<style scoped>

</style>