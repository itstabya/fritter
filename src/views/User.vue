<template>
  <div>
    
    <Navbar v-bind:userName="userName"/>
    <v-container>
      <div v-if='userName'>
        {{this.pageUser}}
        <FollowUser 
          v-bind:toFollow="this.pageUser"
          v-bind:following='this.alreadyFollowing'/>
        <UserFeed 
          v-bind:userName="this.pageUser"
          />
        </div>
      <div v-else>
        Uh oh! Seems like we've ended up in a place that doesn't exist. Let's head back to <router-link to='/'> the main page. </router-link>
      </div>
  </v-container>

  </div>
</template>

<script>
import axios from "axios";
import Navbar from "../components/Navbar.vue";
import UserFeed from "../components/UserFeed.vue";
import FollowUser from "../components/user/FollowUser.vue";
import { eventBus } from "../main";

export default {
  name: "user",
  props: {
    userName: String,
  },
  components: {
    Navbar,
    UserFeed,
    FollowUser,
  },

  data() {
    return {
      pageUser: this.$route.params.username,
      alreadyFollowing: false,
    }
  },

  created: function() {
    // following checks for component state
    const userInfo = {username: this.pageUser};
    axios.post('api/users/follow', userInfo)
        .then(() => {
          this.alreadyFollowing = false;
          this.unfollowUser();
        })
        .catch(() => {
          this.alreadyFollowing = true; 
        })
    
    eventBus.$on("follow-success", () => {
      this.alreadyFollowing = true;
    });

    eventBus.$on("unfollow-success", () => {
      this.alreadyFollowing = false;
    });

  },
  methods: {
    unfollowUser: function() {
      axios.delete(`/api/users/follow/?user=${this.pageUser}`)
      .then( () => {
        eventBus.$emit('unfollow-success');
      })
      .catch(() => {
        eventBus.$emit('unfollow-error');
      });
    }
  }



};
</script>
