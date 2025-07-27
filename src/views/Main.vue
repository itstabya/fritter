<template>
  <div>
    <Navbar
      v-bind:userName="userName"/>
    <v-container>
    <div v-if='userName'>
        <v-row>
          <v-col cols="2">
          </v-col>
          <v-col>
            <CreateFreet
              v-bind:userName="userName"/>
            <FreetFeed
              v-bind:userName="userName"/>
          </v-col>
        </v-row>
    </div>
    <div v-else>
      Welcome to Fritter. Get started to see what's going on.
    </div>
    </v-container>
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import CreateFreet from "../components/CreateFreet.vue"
import FreetFeed from "../components/FreetFeed.vue"

export default {
  name: "Main",
  components: {
    Navbar,
    CreateFreet,
    FreetFeed,
  },
  props: {
    userName: String,
  },

};
</script>
