<!--
 * @Description:登录注册页面的通用布局
 * @Author: youme
 * @LastEditors: youme
 * @Date: 2020-05-06 09:30:27
 * @LastEditTime: 2020-05-06 09:48:04
 -->
<template>
  <div class="login-wrap">
    <div class="login-title" :class="{easeOut: accessToken}">SWEET-MIND</div>
    <div class="login-form" :class="{zoomOut: accessToken}">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    accessToken() {
      return this.$store.state.login.access_token
    }
  }
}
</script>

<style lang="scss">
.login-wrap {
  height: 100vh;
  background: url('../assets/login_images/cover.jpeg') 0 / cover fixed;
  .login-title {
    position: absolute;
    top: 50%;
    width: 100%;
    margin-top: -230px;
    text-align: center;
    font-size: 30px;
    color: #fff;
    text-shadow: 2px 2px 3px #000;
    transition-duration: 2s;
    &.easeOut {
      -webkit-transform: translateY(190px);
      -ms-transform: translateY(190px);
      transform: translateY(190px);
    }
  }
  .login-form {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 420px;
    min-height: 270px;
    margin: -165px 0 0 -210px;
    padding: 40px;
    border-radius: 5px;
    box-shadow: inset 0 0 0 1px hsla(0, 0%, 100%, 0.3), 0 0.5em 1em rgba(0, 0, 0, 0.6);
    background: hsla(0, 0%, 100%, 0.25);
    overflow: hidden;
    box-sizing: border-box;
    &::before {
      background: url('../assets/login_images/cover.jpeg') 0 / cover fixed;
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      margin: -30px;
      z-index: 0;
      filter: blur(1px);
    }
  }
  .zoomOut {
    animation-duration: 1.5s;
    animation-fill-mode: both;
    animation-name: zoomOut;
  }
  @keyframes zoomOut {
    0% {
      opacity: 1;
    }

    50% {
      opacity: 0;
      transform: scale3d(0.3, 0.3, 0.3);
    }

    to {
      opacity: 0;
    }
  }
}
</style>
