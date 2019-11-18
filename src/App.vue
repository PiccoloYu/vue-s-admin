<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
// import Layout from './components/Layout';

export default {
  name: 'App',
  components: {
    // Layout
  }
};
</script>

<style lang="scss" scoped>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  //text-align: center;
  color: #2c3e50;
  //margin-top: 60px;
  width: 100%;
  height: 100%;
}
</style>

