<template>
<v-card 
  class="mt-4 pa-4"
  max-width="1200"
  outlined> 
  <v-container>
    <v-row class="ml-1">
      <v-card-title>

        <router-link :to="{ name: 'user', params: {username: freet.freetAuthor}}" v-if='userName !== freet.freetAuthor'>
        <h4>{{ freet.freetAuthor }}</h4>
        </router-link>

        <router-link :to="{name: 'account'}" v-else>
        <h4>{{ freet.freetAuthor }}</h4>
        </router-link>
      </v-card-title>
      
      <v-spacer/>
      <v-btn
        v-if='userName === freet.freetAuthor'
        v-on:click='deleteFreet'
        small
        color="error"
        >
        Delete Freet
      </v-btn>
    </v-row>
      
    <v-card-text class="headline">
      {{ freet.freetContent }}
    </v-card-text>

      <div class="freet-actions">
      <v-row align="center" class='ma-3'>
        <v-btn v-if='this.upvoted'
               icon
               color="pink"
               v-on:click="removeUpvote" 
            >
              <v-icon>mdi-heart</v-icon>
              {{ freet.upvotes }}
            </v-btn>
        <v-btn v-else 
               icon
               color='grey'
               v-on:click="upvoteFreet" 
               > 
               <v-icon>mdi-heart</v-icon>
               {{ freet.upvotes }}
                </v-btn>
        <v-spacer/>
        <v-btn v-on:click="refreet">Refreet</v-btn>
      </v-row>
    </div>

    <div v-if='userName === freet.freetAuthor'>
    <v-expansion-panels>   
      <v-expansion-panel>
      <v-expansion-panel-header>
        <template v-slot:default="{ open }">
          <v-row no-gutters>
            <v-col
              cols="8"
              class="text--secondary"
            >
              <v-fade-transition leave-absolute>
                <span
                  v-if="open"
                  key="0"
                >
                  Changed your thoughts?
                </span>
                <span
                  v-else
                  key="1"
                >
                  Edit Freet
                </span>
              </v-fade-transition>
            </v-col>
          </v-row>
        </template>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-text-field
          placeholder="Edit Freet"
          id='newContent'
          v-model.trim='newContent'
        ></v-text-field>
        <v-btn v-on:click="editFreet">Edit</v-btn>
      </v-expansion-panel-content>
    </v-expansion-panel>
    </v-expansion-panels>
    </div>
  </v-container>
</v-card>
</template>

<script>

import axios from "axios";
import { eventBus } from "../main";
// import FollowUser from "./user/FollowUser.vue"

export default {
  name: "Freet",

  props: {
    freet: Object,
    userName: String,
  },


  data() {
    return {
      upvoted: false,
      freetID: this.freet.freetID,
      newContent: "",
    };
  },

  created: function() {
    const freetInfo = {id: this.freetID};
    axios
      .post('/api/freets/upvote/', freetInfo)
      .then (() => {
        this.removeUpvote();
      })
      .catch( () => {
        this.upvoted = true;
      })
  },

  methods: {
    upvoteFreet: function() {
      const freetInfo = {id: this.freetID};
      axios
        .post('/api/freets/upvote/', freetInfo)
        .then ((res) => {
          this.upvoted = true;
          eventBus.$emit("upvoted-freet-success", res);
        })
        .catch(err => {
          eventBus.$emit("upvoted-freet-error", err);
        })
    },

    removeUpvote: function() {
      const freetInfo = {id: this.freetID};
      axios
        .delete(`/api/freets/upvote/${this.freetID}`, freetInfo)
        .then((res) => {
          this.upvoted = false;
          eventBus.$emit("remove-upvote-success", res);
        })
        .catch((err) => {
          eventBus.$emit("remove-upvote-error", err);
        })
    },

    deleteFreet: function() {
      axios
        .delete(`/api/freets/${this.freetID}`)
        .then(() => {
          eventBus.$emit("delete-freet-success", this.freet);
        })
        .catch(err => {
          eventBus.$emit("delete-freet-error", err);
        })
    },

    refreet: function() {
      const freetID = {id: this.freetID};
      axios
        .post('/api/freets/refreet', freetID)
        .then(() => {
          eventBus.$emit("refreet-success", this.freet);
        })
        .catch((err) => {
          eventBus.$emit("refreet-error", err);
        })
    },

    editFreet: function() {
      const freetID = {id: this.freetID, content: this.newContent};
      axios
        .put('/api/freets/', freetID)
        .then(() => {
          eventBus.$emit("edit-freet-success", this.freet);
          this.newContent = "";
        })
        .catch((err) => {
          eventBus.$emit("edit-freet-error",err);
          this.newContent = "";
        })
    },
  }
};
</script>

