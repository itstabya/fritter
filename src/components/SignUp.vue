<template>
  <div>
    <v-text-field label='Username' v-model='username'/>
    <v-text-field label='Password' v-model='password'/>
    <v-btn v-on:click='signUp'> Sign Up </v-btn>

    <!-- <form id="sign-up" class='component' v-on:submit.prevent="signIn" method="post">
      <input id='username' v-model.trim='username' type='text' name='username' placeholder="username">
      <input id='password' v-model.trim='password' type='text' name='password' placeholder="password">
      <input type='submit' value='Sign Up' class="button">
    </form> -->
    <div v-if='errors.length' class="error-message" style="width: 250px;">
      <b>Please correct the following error(s):</b>
      <ul>
        <li v-for='error in errors' v-bind:key='error.id'>{{ error }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { eventBus } from "../main";

export default {
  name: "SignUp",

  data() {
    return {
      errors: [],
      username: "",
      password: "", 
    }
  },

  methods: {
    signUp: function() {
      const bodyContent = { username: this.username, password: this.password };
        axios
          .post("/api/users/", bodyContent)
          .then(() => {
            // handle success
            eventBus.$emit('signup-success', true);
          })
          .catch(err => {
            // handle error
            this.errors.push(err.response.data.error);
          })
          .then(() => {
            // always executed
            this.resetForm();
            this.clearMessages();
          });
    },

    resetForm: function() {
      this.username = ""
      this.password = ""
    },

    clearMessages: function() {
      setInterval(() => {
        this.errors = [];
      }, 5000);
    }
  }
}
</script>

