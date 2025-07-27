<template>
  <div id="delete-user" class="component">
    <v-btn v-on:click="deleteUser">Delete User</v-btn>
  </div>
</template>

<script>
import axios from "axios";
import { eventBus } from "../../main";

export default {
  name: "DeleteUser",

  data() {
    return {
      errors: [],
    }
  },
  
  methods: {
    deleteUser: function() {
      axios.delete('api/users')
      .then(() => {
        eventBus.$emit('delete-user-success');
      })
      .then (() => {
        eventBus.$emit('signout-success', true);
      })
      .catch(() => {
        // sign out regardless
        eventBus.$emit('signout-success', true);
      })
    }
  }
}
</script>
