<template>
  <div id="edit-password" class="component">
    <v-row>
      <v-text-field label='New Password' v-model.trim='newPassword'/>
      <v-btn v-on:click="editPassword" class="ml-10">Edit Password</v-btn>
    </v-row>
  </div>
</template>

<script>
import axios from "axios";
import { eventBus } from "../../main";

export default {
  name: "EditPassword",

  data() {
    return {
      newPassword: "",
      errors: [],
    }
  },
  
  methods: {
    editPassword: function() {
      const newPassword = {password: this.newPassword};
      axios.put('api/users/change-password', newPassword)
        .then(() => {
          // handle success
          eventBus.$emit('changed-password');
        })
        .catch(err => {
          // Still sign User out so they have to sign in again.
          this.errors.push(err.response.data.message);
        });
    }
  }
}
</script>
