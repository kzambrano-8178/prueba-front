<template>
  <v-app>
    <br />
    <h1>Error: 500 Unexpected Error</h1>
    <br />
    <v-divider></v-divider>
    <p>Oops! Something is wrong.</p>
    <div class="center">
      <img class="center" src="@/assets/500.png" />
    </div>
  </v-app>
</template>

<script>
export default {

};
</script>

<style>
div.center {
  text-align: center;
  top: 50%;
  left: 50%;
}
p {
  font-size: 2em;
  text-align: center;
  font-weight: 100;
}
h1 {
  text-align: center;
}
</style>
