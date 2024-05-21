<template>
  <div>
    <div class="border-cyan-500 alert transition-all duration-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none"
            class="stroke-cyan-500 shrink-0 w-6 h-6" viewBox="0 0 16 16">
            <path fill-rule="evenodd"
                d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z" />
        </svg>
        <div>
            <h3 class="font-bold">Copied</h3>
            <div class="text-xs">{{ message }}</div>
        </div>
    </div>    
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  message: {
    type: String,
    required: true
  }
});
</script>