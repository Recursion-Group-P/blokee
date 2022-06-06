<template>
  <div class="bg-grey-2 rounded-borders q-pa-md row justify-center">
    <p class="font-size-emphasize">Are you sure you want to PASS?</p>
    <p>Once you passed, you cannot place anymore for the rest of the game.</p>
    <div>
      <q-btn push color="blue-5 q-mr-sm" label="Yes" />
      <q-btn push color="grey-7" label="No" @click="cancelPass" />
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    cancelPass() {
      console.log("NO");
      this.$emit("hideConfirmPassArea");
    },
  },
};
</script>
<style>
.font-size-emphasize {
  font-size: 1.1rem;
}
</style>
