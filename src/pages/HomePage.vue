<template>
    <q-page class="flex flex-center column" padding>
        <img src="../assets/blockee-logo.png" alt="blockee-logo" />
        <q-btn
            v-if="!auth.loggedIn"
            rounded
            size="lg"
            color="grey"
            icon="fab fa-google"
            text-color="white"
            label="Get Started"
            @click="login"
        />
    </q-page>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
    computed: {
        ...mapState(['auth']),
    },
    methods: {
        ...mapActions('auth', ['login', 'logout']),
    },
};
</script>

<style></style>
