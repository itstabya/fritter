<template>
  <v-app id="app">
    <v-main>
      <router-view v-bind:userName="userName"/>
    </v-main>
  </v-app>
</template>

<script>

import { eventBus } from "./main.js";


export default {
  name: 'App',

  data() {
    return { 
      userName: this.$cookie.get('fritter-auth'),
    }
  },

  created: function() {
    eventBus.$on("signin-success", () => {
      this.userName = this.$cookie.get('fritter-auth');
    });
    eventBus.$on("signout-success", () => {
      this.$cookie.set('fritter-auth', '');
      this.userName = this.$cookie.get('fritter-auth');
    });
    eventBus.$on("changed-username", (userName) => {
      this.$cookie.set('fritter-auth', userName.data.newUsername);
    });
  }
};
</script>
