<template>
    <div class="form-control w-full max-w-xs">
        <div class="label">
            <span class="label-text">{{ title }}</span>
        </div>
        <button type="button" @click="modal.openSearchUsernameModal()"
            class="btn border-3 shadow flex flex-row justify-between">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
            </svg>
            <input onfocus="this.blur()" type="text" id="projectID-display"
                class="text-start input input-sm input-bordered flex-grow text-gray-500" v-bind:placeholder="placeholder" :value="inputValue">
                
            <kbd class="kbd kbd-sm sm:flex hidden"> {{ customKey }} </kbd>
        </button>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useModalStore } from '@/store/modal';
const props = defineProps(['title', 'placeholder', 'customKey', 'inputValue'])

const eventKey = props.customKey.toLowerCase();
const modal = useModalStore();

onMounted(() => {
    document.addEventListener('keydown', (event) => {
        if (event.key === eventKey && !modal.checkOpen) {
            modal.openSearchUsernameModal();
            event.preventDefault();
        }
    });
});
</script>