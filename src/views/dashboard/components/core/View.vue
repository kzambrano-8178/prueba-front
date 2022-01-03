<template>
  <v-main class="card">

    <router-view />
    
    <!-- <dashboard-core-footer /> -->
  </v-main>
</template>

<script>
  export default {
    name: 'DashboardCoreView',

    components: {
      DashboardCoreFooter: () => import('./Footer'),
    },
  }
</script>
