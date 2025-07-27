<template>
  <v-app-bar
    color='blue'
    >
    <v-container>
      <v-row>
        <router-link to="/">
        <h1 class='white--text'>Fritter</h1>
        </router-link>
        <v-spacer></v-spacer>
        <router-link to="/account">
          <h2 class="mr-4 white--text" v-if="userName">
            My Account
          </h2>
          <h2 v-else class="mr-4 white--text">
            Sign in / sign up
          </h2>
        </router-link>
        <div v-if="userName">
          <SignOut/>
        </div>
      </v-row>
    </v-container>
  </v-app-bar>




</template>

<script>
import SignOut from "./user/SignOut.vue"
export default {
  name: "Main",
  props: {
    userName: String
  },

  components: {
    SignOut,
  }
};
</script>