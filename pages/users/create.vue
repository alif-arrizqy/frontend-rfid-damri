<template>
  <v-row>
    <v-col cols="10" offset="1">
      <v-card class="mb-2">
        <v-toolbar color="primary" dark>Register</v-toolbar>
        <v-card-text>
          <v-breadcrumbs :items="breadcrumbs" class="pa-0" />
          <v-form ref="form">
            <v-text-field
              name="fullname"
              label="Fullname"
              type="text"
              :rules="rules.fullname"
              v-model="form.fullname"
            />
            <v-text-field
              name="email"
              label="Email"
              type="email"
              :rules="rules.email"
              v-model="form.email"
            />
            <v-text-field
              name="password"
              label="Password"
              type="password"
              :rules="rules.password"
              v-model="form.password"
            />
            <v-text-field
              name="retype_password"
              label="Re-Password"
              type="password"
              :rules="rules.retype_password"
              v-model="form.retype_password"
            />
            <v-select
              name="role"
              label="Role"
              type="text"
              :items="roles"
              :rules="rules.role"
              v-model="form.role"
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
            Save</v-btn
          >
        </v-card-actions>
      </v-card>
      <p>
        Kamu sudah punya akun ? <v-btn to="/register" plain>register</v-btn>
      </p>
    </v-col>
  </v-row>
</template>

<script>
export default {
  middleware: ['authenticated'],
  data() {
    return {
      breadcrumbs: [
        { text: 'Users', to: '/users', disabled: false, exact: true },
        { text: 'Create', disabled: true },
      ],
      emailExist: false,
      isDisable: false,
      roles: ['employee', 'admin', 'cashier'],
      form: {
        fullname: '',
        email: '',
        password: '',
        retype_password: '',
        role: '',
      },
      rules: {
        fullname: [
          (v) => !!v || this.$t('FIELD_REQUIRED', { field: 'Nama Lengkap' }),
        ],
        role: [(v) => !!v || this.$t('FIELD_REQUIRED', { field: 'Role' })],
        email: [
          (v) => !!v || this.$t('FIELD_REQUIRED', { field: 'Email' }),
          (v) => /.+@.+/.test(v) || this.$t('EMAIL_INVALID'),
          (v) => !this.emailExist || this.$t('EMAIL_ALREADY_EXIST'),
        ],
        password: [
          (v) => !!v || this.$t('FIELD_REQUIRED', { field: 'Password' }),
          (v) =>
            v.length >= 6 ||
            this.$t('FIELD_MIN_LENGTH', { field: 'Password', length: 6 }),
        ],
        retype_password: [
          (v) =>
            v === this.form.password ||
            this.$t('FIELD_CONFIRM', {
              field: 'Password',
              confirm: 'Re-Password',
            }),
        ],
      },
    }
  },
  methods: {
    checkEmail() {
      this.$axios
        .$post('/auth/check-email', this.form)
        .then((response) => {
          console.log(response)
          this.emailExist = true
        })
        .catch((error) => {
          this.emailExist = false
          console.log(error)
        })
    },
    onSubmit() {
      if (this.$refs.form.validate()) {
        this.isDisable = true
        this.$axios
          .$post('/users', this.form)
          .then((response) => {
            this.isDisable = false
            // redirect to users
            this.$router.push({
              name: 'users___' + this.$i18n.locale,
              params: {
                message: 'CREATE_SUCCESS',
                fullname: this.form.fullname,
              },
            })
          })
          .catch((error) => {
            console.log(error)
            if (error.response.data.message == 'EMAIL_ALREADY_EXIST') {
              this.emailExist = true
              this.$refs.form.validate()
            }
            this.isDisable = false
          })
      }
    },
  },
}
</script>
