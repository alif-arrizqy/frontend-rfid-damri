<template>
	<v-row class="frame-content">
		<v-col cols="10" offset="1">
			<v-card class="my-3">
				<v-toolbar color="primary" dark>
					Travel History
					<v-spacer></v-spacer>
					<v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line
						hide-details></v-text-field>
				</v-toolbar>
				<v-card-text>
					<v-alert v-if="alert.show" :type="alert.type">
						{{ alert.message }}
					</v-alert>
					<div class="d-flex mb-4">
						<v-breadcrumbs :items="breadcrumbs" class="pa-0" />
						<v-spacer></v-spacer>
					</div>
					<v-data-table :headers="headers" :items="travel" :items-per-page="10" :server-items-length="total"
						:options.sync="options" :search.sync="search" :loading="loading" :footer-props="{
							'items-per-page-options': [10, 20, 30],
						}">
						<template v-slot:top>
							<v-dialog v-model="dialogDelete" max-width="500px">
								<v-card>
									<v-card-title>Kamu yakin mau hapus data
										{{ itemDelete.cardId }} ?</v-card-title>
									<v-card-actions>
										<v-spacer></v-spacer>
										<v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
										<v-btn color="blue darken-1" text
											@click="deleteConfirm(itemDelete._id)">Delete</v-btn>
									</v-card-actions>
								</v-card>
							</v-dialog>
						</template>
					</v-data-table>
				</v-card-text>
			</v-card>
		</v-col>
	</v-row>
</template>
<script>
export default {
	data() {
		return {
			alert: {
				show: false,
				type: '',
				message: '',
			},
			dialogDelete: false,
			itemDelete: false,
			search: '',
			loading: false,
			options: {},
			total: 0,
			travel: [],
            headers: [
                { text: 'Card Id', value: 'cardId', sortable: false },
                { text: 'Departure', value: 'departure', sortable: false },
                { text: 'Time In', value: 'timeIn', sortable: false },
                { text: 'Destination', value: 'destination', sortable: false },
                { text: 'Time Out', value: 'timeOut', sortable: false },
            ],
			breadcrumbs: [
				{
					text: 'Home',
					disabled: false,
					href: '/',
				},
				{
					text: 'Travel History',
					disabled: true,
					href: '/travel-history',
				},
			],
		}
	},
	methods: {
		getUsers() {
			this.loading = true
			const { page, itemsPerPage } = this.options

			this.$axios
				.$get(`/travel/travel-history?page=${page}&limit=${itemsPerPage}&search=${this.search}`)
				.then((response) => {
					this.loading = false
					this.travel = response.travelHistory.docs
					this.total = response.travelHistory.totalDocs
					let startItem = response.travelHistory.pagingCounter
					// let startItem = (page - 1) * itemsPerPage + 1;
					this.travel.map((user) => (user.row = startItem++))
				})
				.catch((err) => {
					this.loading = false
					console.log(err)
				})
		},
		deleteConfirm(id) {
			this.$axios
				.$delete(`/users/${id}`)
				.then((response) => {
					// process hapus data di datatable
					this.users = this.users.filter((user) => user._id != id)

					let params = {
						message: 'DELETE_SUCCESS',
						title: this.itemDelete.fullname,
					}
					this.showAlert(params)
					this.closeDelete()
				})
				.catch((err) => {
					this.closeDelete()
				})
		},
		deleteItem(item) {
			this.itemDelete = item
			this.dialogDelete = true
		},
		closeDelete() {
			this.dialogDelete = false
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
			} else if (params.message == 'DELETE_SUCCESS') {
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
		search: {
			handler() {
				this.getUsers()
			},
		},
	},
	mounted() {
		this.showAlert(this.$route.params)
	},
}
</script>
