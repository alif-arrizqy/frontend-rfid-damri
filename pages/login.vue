<template>
  <v-row>
    <v-col cols="10" offset="1" md="4" offset-md="4">
      <v-card class="mb-2">
        <v-toolbar color="primary" dark>Login</v-toolbar>
        <v-card-text>
          <v-alert color="red lighthen-2" dark v-if="isError">
            {{ $t(message) }}
          </v-alert>
          <v-form>
            <v-text-field
              name="email"
              label="email"
              type="text"
              v-model="form.email"
            />
            <v-text-field
              name="password"
              label="Password"
              type="password"
              v-model="form.password"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="onSubmit" :disabled="isDisable">
            <span v-if="!isDisable"></span>
            <v-progress-circular
              v-else
              indeterminate
              color="white"
              size="20"
              width="2"
            >
            </v-progress-circular>
            Login</v-btn
          >
        </v-card-actions>
      </v-card>
      <!-- <p>
        Kamu belum punya akun ? <v-btn to="/register" plain>register</v-btn>
      </p> -->
    </v-col>
  </v-row>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  middleware: ['unauthenticated'],
  data() {
    return {
      isDisable: false,
      message: '',
      isError: false,
      form: {
        email: '',
        password: '',
      },
    }
  },
  methods: {
    ...mapMutations('auth', {
      setAccessToken: 'setAccessToken',
      setRefreshToken: 'setRefreshToken',
      setFullname: 'setFullname',
    }),
    storeWelcomeScreen() {
      localStorage.setItem('welcomeScreen', true)
    },
    onSubmit() {
      this.isDisable = true
      this.$axios
        .$post('/auth/login', this.form)
        .then((response) => {
          // login success

          // button login
          this.isDisable = false

          // set localstorage welcome screen
          if (!localStorage.welcomeScreen) {
            this.storeWelcomeScreen()
          }

          // store auth data to cookies
          this.setAccessToken(response.accessToken)
          this.setRefreshToken(response.refreshToken)
          this.setFullname(response.fullname)

          // redirect to dashboard page
          this.$router.push('/dashboard')
        })
        .catch((error) => {
          this.isDisable = false
          this.message = error.response.data.message
          this.isError = true
        })
    },
  },
  mounted() {
    console.log(this.$route.params.message)
    if (this.$route.params.message == 'AUTH_REQUIRED') {
      this.message = this.$route.params.message
      this.isError = true
    }
  },
}
</script>
