<template>
  <div id="user-settings">
    <div v-if="userName" class="form-container">
      <v-row> 
        <v-col>
          <EditUsername/>
          <EditPassword/>
        </v-col>
        <v-spacer/>
        <v-col class="text-right">
          <DeleteUser/>
        </v-col>
      </v-row>
    </div>
    <div v-else class="form-container">
      <v-row 
        align="center"
        justify="space-around"> 
        <SignIn/>
        <SignUp/>
      </v-row> 
    </div>
    <div v-if='messages.length' class="success-message" style="text-align:center;">
      <div v-for='message in messages' v-bind:key='message.id'>{{ message }}</div>
    </div>
  </div>
</template>

<script>
import SignIn from "./SignIn.vue";
import SignUp from "./SignUp.vue";

import EditUsername from "./user/EditUsername.vue";
import EditPassword from "./user/EditPassword.vue";
import DeleteUser from "./user/DeleteUser.vue";

import { eventBus } from "../main";

export default {
  name: "UserSettings",

  components: {
    SignIn,
    SignUp,
    EditUsername,
    EditPassword,
    DeleteUser
  },

  props: {
    userName: String,
  },

  data() {
    return {
      messages: []
    };
  },

  created: function() {

    eventBus.$on("signup-success", () => {
      this.messages.push("You have been signed up! Sign in to continue.");
      this.clearMessages();
    });
  },
  methods: {
    clearMessages: function() {
      setInterval(() => {
        this.messages = [];
      }, 5000);
    }
  }
};
</script>