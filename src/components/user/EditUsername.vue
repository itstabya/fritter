<template>
  <div id="edit-user" class="component">
    <v-row>
      <v-text-field label='New Username' v-model.trim='newUsername'/>
      <v-btn v-on:click="editUsername" class="ml-10">Edit Username</v-btn>
    </v-row>
  </div>
</template>

<script>
import axios from "axios";
import { eventBus } from "../../main";

export default {
  name: "EditUsername",

  data() {
    return {
      newUsername: "",
      errors: [],
    }
  },
  
  methods: {
    editUsername: function() {
      const newUser = {username: this.newUsername};
      axios.put('api/users/change-username', newUser)
        .then((user) => {
          // handle success
          eventBus.$emit('changed-username', user);
        })
        .catch(() => {
          console.log("todo")
        })
    }
  }
}
</script>
