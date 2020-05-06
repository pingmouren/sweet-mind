<!--
 * @Description:基础布局权限
 * @Author: youme
 * @LastEditors: youme
 * @Date: 2020-05-06 08:26:02
 * @LastEditTime: 2020-05-06 10:20:03
 -->
<template>
  <div>
    <div v-if="typeof this.userName === 'undefined'" class="placeholder" v-loading="true"/>
    <user-layout/>
  </div>
</template>

<script>
import UserLayout from './UserLayout'

export default {
  components: { UserLayout },
  created() {
    this.$store.dispatch('user/saveCurrentUser')
  },
  mounted() {
    console.log(this.userName)
    if (!this.userName && typeof this.userName !== 'undefined' && this.userName !== 0) {
      this.$router.push('/user')
    }
  },
  computed: {
    userName() {
      return this.$store.state.user.currentUser.name
    }
  }
}
</script>

<style scope>
.placeholder {
  height: 100%;
}
</style>
