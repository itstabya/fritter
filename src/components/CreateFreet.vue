<template>

  <v-container>
    <v-card
    max-width='1200'>
      <v-toolbar
        flat
      >
      <v-toolbar-title> <h3> What's on your mind? </h3> </v-toolbar-title>
      </v-toolbar>

      <div class="short-form-container">
      <!-- the submit event will no longer reload the page -->
      <form id='create-freet' v-on:submit.prevent='createFreet' method='post'>
        <v-textarea
          solo
          counter="140"
          label="What's on your mind?"
          id='freetText' 
          v-model='freetText' 
          name='freetText' 
          placeholder="Share something..."
          class="ml-5 mr-5"
          rounded
          background-color="grey lighten-5"
        />
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="mx-2"
            color="blue"
            
            v-on:click='createFreet'
          >
          <span class='white--text'> Freet </span>
          </v-btn>
        </v-card-actions>

        
        <div v-if='success' class="success-message">
          {{ success }}
        </div>

        <div v-if='errors.length' class="error-message">
          <b>Please correct the following error(s):</b>
          <ul>
            <li v-for='error in errors' v-bind:key='error'>{{ error }}</li>
          </ul>
        </div>

      </form>
    </div>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";
import { eventBus } from "../main";

export default {
  name: "CreateFreet",
  props: {
    userName: String,
  },
  data() {
    return {
      errors: [],
      success: "",
      freetText: "", 
    };
  },

  methods: {
    createFreet: function() {
      this.errors = [];

      if (this.freetText === "") {
        this.errors.push("This is an empty Freet.")
        this.clearMessages();
      } else {
        const bodyContent = { content: this.freetText };
        axios
          .post("/api/freets", bodyContent)
          .then(freet => {
            // handle success
            // this.success = "Successfully freeted!";
            eventBus.$emit("create-freet-success", freet);
          })
          .catch(err => {
            // handle error
            this.errors.push(err.response.data.message);
          })
          .then(() => {
            // always executed
            this.resetForm();
            this.clearMessages();
          });
      }
    },

    resetForm: function() {
      this.freetText=""
    },

    clearMessages: function() {
      setInterval(() => {
        this.errors = [];
        this.success = "";
      }, 5000);
    }
  }
};
</script>
