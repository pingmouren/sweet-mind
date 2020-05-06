<!--
 * @Description: 登录页面
 * @Author: youme
 * @LastEditors: youme
 * @Date: 2020-04-24 09:50:09
 * @LastEditTime: 2020-05-06 09:36:28
 -->
<template>
  <el-form ref="form" :model="form" :rules="rules">
    <el-form-item prop="username">
      <el-input
        placeholder="请输入"
        v-model="form.username"
        prefix-icon="el-icon-user" />
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        show-password
        placeholder="请输入"
        v-model="form.password"
        prefix-icon="el-icon-unlock"/>
    </el-form-item>
    <el-form-item v-if="env==='dev'" prop="tenantId">
      <el-select v-model="form.tenantId" placeholder="租户列表">
        <el-option
          v-for="item in tenants"
          :key="item.id"
          :label="item.name"
          :value="item.id"/>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button @click="this.handleSubmit" class="login-button" type="primary" round>登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
const bcrypt = require('bcryptjs')

export default {
  data() {
    const env = process.env.NODE_ENV === 'development' ? 'dev' : 'production' // eslint-disable-line
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码至少6位'))
      } else {
        callback()
      }
    }
    return {
      form: {
        username: '',
        password: '',
        tenantId: ''
      },
      rules: {
        username: [
          { required: true, trigger: 'blur', message: '请输入用户名' }
        ],
        password: [
          { required: true, trigger: 'blur', message: '请输入密码' },
          { validator: validatePassword, trigger: 'blur' }
        ],
        tenantId: [
          { required: true, trigger: 'blur', message: '请输入租户' }
        ]
      },
      env
    }
  },
  computed: {
    tenants() {
      return this.$store.state.login.tenants
    }
  },
  created() {
    this.$store.dispatch('login/getTenants')
  },
  methods: {
    /**
     * @description: 加密处理
     */
    onEncrypt(pwd, pubkey, timestamp, salt, nonce) {
      // 慢加密
      const hash = bcrypt.hashSync(pwd, salt)

      // rsa加密
      const rsa = new window.JSEncrypt()
      rsa.setPublicKey(pubkey)

      // hash_pass,timestamp,nonce
      const hsn = `${hash},${timestamp},${nonce}`
      return rsa.encrypt(hsn)
    },
    handleSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const { username, tenantId } = this.form
          this.$store.dispatch('login/getStn', {
            userType: 'TENANT',
            userName: username,
            tenantId
          }).then(_ => {
            const values = { ...this.form }
            const { pubKey, timestamp, salt, nonce } = this.$store.state.login
            const password = this.onEncrypt(values.password, pubKey, timestamp, salt, nonce)
            values.password = password

            // 登录
            this.$store.dispatch({
              type: 'login/login',
              payload: {
                userType: 'TENANT',
                ...values
              }
            })
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.login-button {
  width: 100%;
}
.el-form-item:not(:last-child) {
  margin-bottom: 30px;
}
.el-form-item:last-child {
  margin-bottom: 0;
}
</style>
