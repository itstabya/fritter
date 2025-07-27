<template>
  <div id="sign-out" class="component">
    <v-btn v-on:click="signOut"
    class="mr-4"
    >Sign Out</v-btn>
  </div>
</template>

<script>
import axios from "axios";
import { eventBus } from "../../main";

export default {
  name: "SignOut",
  
  methods: {
    signOut: function() {
      axios.post('api/users/sign-out')
        .then(() => {
          // handle success
          this.$cookie.set('fritter-auth', '');
          eventBus.$emit('signout-success', true);
        })
        .catch(() => {
          // Still sign User out so they have to sign in again.
          this.$cookie.set('fritter-auth', '');
          eventBus.$emit('signout-success', true);
        })
    }
  }
}
</script>
