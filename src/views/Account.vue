<template>
  <div>
    
    <Navbar v-bind:userName="userName"/>
    <v-container>
      <v-row>
          <v-col cols="2">
          </v-col>
          <v-col>
            <UserSettings 
              v-bind:userName="userName"/>
            <UserFeed
              v-bind:userName="userName"/>
          </v-col>
        </v-row>

    </v-container>

  </div>
</template>

<script>
import UserSettings from "../components/UserSettings.vue";
import Navbar from "../components/Navbar.vue";
import UserFeed from "../components/UserFeed.vue";

export default {
  name: "account",
  props: {
    userName: String,
  },
  components: {
    UserSettings,
    Navbar,
    UserFeed
  }
};
</script>
