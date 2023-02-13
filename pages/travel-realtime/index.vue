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
                    <v-data-table :headers="headers" :items="travels" :options.sync="options" :loading="loading">
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
            travels: [],
            headers: [
                { text: 'Card Id', value: 'cardId', sortable: false },
                { text: 'Departure', value: 'departure', sortable: false },
                { text: 'Time', value: 'timeIn', sortable: false },
            ],
            breadcrumbs: [
                {
                    text: 'Home',
                    disabled: false,
                    href: '/',
                },
                {
                    text: 'Travel',
                    disabled: true,
                    href: '/travel/realtime',
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
        getDatas() {
            this.loading = true
			const { page, itemsPerPage } = this.options

            this.$axios
                .$get(`/users/${this.user.id}`)
                .then((response) => {
                    let respCardId = response.user.cardId
                    this.$axios
                        .$get(`/travel/travel-realtime/${respCardId}`)
                        .then((resp) => {
                            this.loading = false
                            let datas = []
                            datas.push(resp.travelRealtime)
                            const times = resp.travelRealtime.timeIn
                            const time = new Date(times * 1000)
                            const tgl = time.toLocaleDateString()
                            const waktu = time.toLocaleTimeString()
                            datas[0].timeIn = `${tgl} ${waktu}`
                            this.travels = datas
                        })
                        .catch((err) => {
                            this.loading = false
                            console.log(`failed to get travels: ${err}`)
                        })
                })
                .catch((err) => {
                    this.loading = false
                    console.log(`failed to get travels: ${err}`)
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
                this.getDatas()
            },
            deep: true,
        },
    },
    mounted() {
        this.showAlert(this.$route.params)
    },
}
</script>
