<template>
  <div class="subcontainer">
    <v-container>
      <div v-if='success' class="success-message">
        {{ success }}
      </div>
      <div v-if='error' class="error-message">
        {{ error }}
      </div>

      <div class="freets-container" v-if="userName">  
        <div v-if="freets.length">
          <Freet
            v-for="freet in freets"
            v-bind:key="freet.freetID"
            v-bind:freet="freet"
            v-bind:userName = userName
          />
        </div>
        <div v-else>
          <p style="text-align: center;">This user has no freets.</p>
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
  },

  data() {
    return {
      error: "",
      success: "",
      freets: [],
    };
  },

  created: function() {

    eventBus.$on("upvoted-freet-success", () => {
      this.clearMessages();
      this.loadFreets();
    });

    eventBus.$on("upvoted-freet-error", () => {
      this.clearMessages();
      this.loadFreets();
    });

    eventBus.$on("remove-upvote-success", () => {
      this.clearMessages();
      this.loadFreets();
    });

    eventBus.$on("remove-upvote-error", () => {
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
  },

  mounted: function() {
    this.loadFreets();
  },

  methods: {
    loadFreets: function() {
      axios.get(`/api/freets/?author=${this.userName}`).then(response => {
        this.freets = response.data;
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

