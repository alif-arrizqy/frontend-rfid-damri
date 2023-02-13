import jwt_decode from 'jwt-decode'

export const state = () => ({
    accessToken: null,
    refreshToken: null,
    fullname: null
})

export const getters = {
    authenticated: (state) => {
        if(state.accessToken) {
            return true
        }
        return false
    },
    user: (state) => {
        if(state.accessToken) {
            return jwt_decode(state.accessToken)
        }
        return false
    }
}

export const mutations = {
    setAccessToken(state, accessToken) {
        state.accessToken = accessToken
    },
    setRefreshToken(state, refreshToken) {
        state.refreshToken = refreshToken
    },
    setFullname(state, fullname) {
        state.fullname = fullname
    },
    logout(state) {
        state.accessToken = null
        state.refreshToken = null
        state.fullname - null
    }
}