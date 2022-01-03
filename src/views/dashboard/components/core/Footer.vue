<template>
  <v-footer
    id="dashboard-core-footer"
    class="text-left"
  >
    <v-container>
      <v-row
        class="alingn-left"
        style="float: left"
        no-gutters
      >

        <!-- <v-spacer class="hidden-sm-and-down" /> -->

        <v-col

          md="auto"

        >

        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
  export default {
    name: 'DashboardCoreFooter',

    // data: () => ({
    //   links: [
    //     {
    //       href: '#',
    //       text: 'Wero Systems',
    //     },
    //   ],
    // }),
  }
</script>

<style lang="sass">
  #dashboard-core-footer
    a
      font-size: .825rem
      font-weight: 500
      text-decoration: none
      text-transform: uppercase
</style>
