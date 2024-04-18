<template>
  
  <NavComponent/>
</template>

<script>
import { defineComponent } from 'vue';

// Components

import NavComponent from '@/components/NavComponent.vue';

export default defineComponent({
  name: 'HomeView',

  components: {
    NavComponent
  },
});
</script>
