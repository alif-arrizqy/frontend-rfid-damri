<template>
    <v-row class="frame-content">
        <v-col cols="10" offset="1">
            <v-card class="my-3">
                <v-toolbar color="primary" dark>
                    User
                </v-toolbar>
                <v-card-text>
                    <v-alert v-if="alert.show" :type="alert.type">
                        {{ alert.message }}
                    </v-alert>
                    <div class="d-flex mb-4">
                        <v-breadcrumbs :items="breadcrumbs" class="pa-0" />
                    </div>
                    <v-data-table :headers="headers" :items="users" :options.sync="options" :loading="loading">
                        <template v-slot:item.actions="{ item }">
                            <v-btn icon>
                            <!-- <v-btn :to="`/users/edit/${item._id}`" icon> -->
                                <v-icon small>mdi-pencil</v-icon>
                            </v-btn>
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            alert: {
                show: false,
                type: '',
                message: '',
            },
            loading: false,
            options: {},
            users: [],
            headers: [
                { text: 'Card Id', value: 'cardId', sortable: false },
                { text: 'Fullname', value: 'fullname', sortable: false },
                { text: 'Email', value: 'email', sortable: false },
                { text: 'Role', value: 'role', sortable: false },
                { text: 'Action', value: 'actions', sortable: false },
            ],
            breadcrumbs: [
                {
                    text: 'Home',
                    disabled: false,
                    href: '/',
                },
                {
                    text: 'Profile',
                    disabled: true,
                    href: '/users/profile',
                },
            ],
        }
    },
    computed: {
        ...mapGetters('auth', {
            authenticated: 'authenticated',
            user: 'user'
        }),
    },
    methods: {
        getUsers() {
            this.loading = true
			const { page, itemsPerPage } = this.options

            this.$axios
                .$get(`/users/${this.user.id}`)
                .then((response) => {
                    this.loading = false
                    let resp = response.user
                    let data = []
                    data.push(resp)
                    this.users = data
                })
                .catch((err) => {
                    this.loading = false
                    console.log(`failed to get users: ${err}`)
                })
        },
        showAlert(params) {
            if (params.message == 'UPDATE_SUCCESS') {
                this.alert.show = true
                this.alert.type = 'success'
                this.alert.message = this.$t(params.message, {
                    title: params.fullname,
                })
            } else if (params.message == 'ID_NOT_FOUND') {
                this.alert.show = true
                this.alert.type = 'error'
                this.alert.message = this.$t(params.message)
            } else if (params.message == 'CREATE_SUCCESS') {
                this.alert.show = true
                this.alert.type = 'success'
                this.alert.message = this.$t(params.message, {
                    title: params.fullname,
                })
            }
        },
    },
    watch: {
        options: {
            handler() {
                this.getUsers()
            },
            deep: true,
        },
    },
    mounted() {
        this.showAlert(this.$route.params)
    },
}
</script>
