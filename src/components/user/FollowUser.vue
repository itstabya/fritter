<template>
  <div id="follow-user" class="component">
    <div v-if='following'>
      <v-btn v-on:click='unfollowUser'>Unfollow</v-btn>
    </div>
    <div v-else>
      <v-btn v-on:click="followUser">Follow</v-btn>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { eventBus } from "../../main";


export default {
  name: "FollowUser",
  props: {
    toFollow: String,
    following: Boolean,
  },

  data() {
    return {
      userToFollow: this.toFollow
    }
  },

  methods: {
    followUser: function() {
      const userInfo = {username: this.userToFollow};
      axios.post('api/users/follow', userInfo)
        .then(() => {
          eventBus.$emit('follow-success');
        })
        .catch(() => {
          eventBus.$emit('follow-error');
        })
    },

    unfollowUser: function() {
      axios.delete(`/api/users/follow/?user=${this.userToFollow}`)
      .then( () => {
        eventBus.$emit('unfollow-success');
      })
      .catch(() => {
        eventBus.$emit('unfollow-error');
      });
    }
  }
}
</script>
