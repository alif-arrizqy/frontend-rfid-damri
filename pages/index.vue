<template>
  <v-row>
    <v-col cols="8" class="frame-content px-6">
      <!-- <product></product> -->
    </v-col>
    
    <v-col cols="4" class="frame-content white">
      <!-- <order></order> -->
    </v-col>
  </v-row>
</template>

<!-- <style scoped>
.frame-content {
  height: 80vh;
  overflow-y: auto;
}
</style> -->
<script>
  export default ({
      middleware: ['authenticated']
  });
</script>
