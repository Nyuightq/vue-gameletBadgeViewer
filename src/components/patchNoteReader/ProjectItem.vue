<template>
    <a class="bg-base-100 card flex flex-col transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:bg-opacity-80 cursor-pointer">
        <figure class="p-1 w-full"><img class="rounded-md w-full h-24 object-cover" :src="iconUrl" :alt="title" /></figure>
        <div class="card-body p-4 py-2">
            <h2 class="card-title pb-2">{{ title }}</h2>
        </div>
    </a>
</template>
<script setup>
import { defineProps } from 'vue';
defineProps(['title', 'iconUrl']);
</script>