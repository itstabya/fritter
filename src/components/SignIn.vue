<template>
  <div>
      <v-text-field label='Username' v-model='username'/>
      <v-text-field label='Password' v-model='password'/>
      <v-btn v-on:click='signIn'> Sign In </v-btn>
    <div v-if='errors.length' class="error-message" style="width: 250px;">
      <b>Please correct the following error(s):</b>
      <ul>
        <li v-for='error in errors' v-bind:key='error'>{{ error }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { eventBus } from "../main";

export default {
  name: "SignIn",

  data() {
    return {
      errors: [],
      username: "",
      password: "",
    }
  },

  methods: {
    signIn: function() {
      const bodyContent = { username: this.username, password: this.password };
      console.log(bodyContent);
        axios
          .post("/api/users/sign-in", bodyContent)
          .then((res) => {
            // handle success
            console.log(res.data)
            this.$cookie.set('fritter-auth', res.data.username);
            eventBus.$emit('signin-success');
          })
          .catch(err => {
            // handle error
            console.log(err.response)
            this.errors.push(err.response.data.message);
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

