<template>
  <div class="subcontainer">
    <v-container>
      <div v-if='success' class="success-message">
        {{ success }}
      </div>
      <div v-if='error' class="error-message">
        {{ error }}
      </div>

      <div class="freets-container">  
        <div v-if="freets.length && userName">
          <Freet
            v-for="freet in freets"
            v-bind:key="freet.freetID"
            v-bind:freet="freet"
            v-bind:userName = userName
          />
        </div>
        <div v-else>
          <p style="text-align: center;">There are no freets to display. Create one today!</p>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
import Freet from "./Freet.vue"

import { eventBus } from "../main";

export default {
  name: "FreetFeed",

  components: { Freet },

  props: {
    userName: String,
    pageUser: String,
  },

  data() {
    return {
      error: "",
      success: "",
      freets: [],
    };
  },

  created: function() {
    eventBus.$on("create-freet-success", (res) => {
      this.freets.push(res.data.newFreet);
      this.success = "Successfully freeted!"
      this.clearMessages();
      this.loadFreets();
    });

    eventBus.$on('delete-freet-success', (res) => {
      this.success = " Freet has been deleted" + res.freetAuthor;
      this.clearMessages();
      this.loadFreets();
    });

    eventBus.$on("delete-freet-error", (res) => {
      this.error = `Error deleting freet by ${res.freetAuthor}`;
      this.clearMessages();
      this.loadFreets();
    });


    eventBus.$on("upvoted-freet-success", () => {
      // this.success="Successfully upvoted!"
      this.clearMessages();
      this.loadFreets();
    });

    eventBus.$on("upvoted-freet-error", () => {
      // this.error="You've upvoted this already."
      this.clearMessages();
      this.loadFreets();
    });

    eventBus.$on("remove-upvote-success", () => {
      // this.success="Successfully removed upvote!"
      this.clearMessages();
      this.loadFreets();
    });

    eventBus.$on("remove-upvote-error", () => {
      // this.error="You don't have anything to remove."
      this.clearMessages();
      this.loadFreets();
    });

    eventBus.$on('refreet-success', (res) => {
      this.success = " Freet has been refreeted" + res.freetAuthor;
      this.clearMessages();
      this.loadFreets();
    });

    eventBus.$on('refreet-error', () => {
      this.error = "Can't refreet this. You may have refreeted it already.";
      this.clearMessages();
      this.loadFreets();
    })

    eventBus.$on('edit-freet-success', () => {
      this.success = "Freet has been successfully edited";
      this.clearMessages();
      this.loadFreets();
    })

    eventBus.$on('edit-freet-error', () => {
      this.error = "Can't edit this freet";
      this.clearMessages();
      this.loadFreets();
    })

  },

  mounted: function() {
    this.loadFreets();
  },

  methods: {
    loadFreets: function() {
      axios.get("/api/freets/").then(response => {
        this.freets = response.data;
        this.freets = this.freets.reverse();
      });
    },

    clearMessages: function() {
      setInterval(() => {
        this.success = "";
        this.error = "";
      }, 5000);
    }
  }
};
</script>

