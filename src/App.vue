<template>
  <div id="app">
    <Nav></Nav>
    <router-view />
  </div>
</template>

<script>
import Nav from '@/components/nav'
export default {
  name: 'App',
  components: {
    Nav
  }
}
</script>

<style>
#app {
  margin: 0;
  padding: 0;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  border: hidden;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* background-size:500% 500%;
  background-attachment: fixed;
  background-image: linear-gradient(-225deg, #E3FDF5 0%, #FFE6FA 100%); */
}
</style>
