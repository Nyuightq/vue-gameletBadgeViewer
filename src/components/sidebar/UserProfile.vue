<template>
    <div class="flex gap-4 items-center">
        <div class="avatar shrink-0">
            <div class="w-16 rounded-full border-2 border-cyan-500">
                <img alt="頭像" id="profile-info-avatar" :src="user.iconUrl">
            </div>
        </div>
        <div class="flex flex-col">
            <a class="break-all text-xs cursor-pointer" id="profile-info-id" @click="copyHandler(user.username)"> {{ user.username}} </a>
            <div class="break-all" id="profile-info-name"> {{user.name}} </div>
            <a target="_blank" class="btn btn-circle btn-xs end-0" :href="'https://gamelet.online/user/' + user.username">
                <svg
                    xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    class="bi bi-link-45deg" viewBox="0 0 16 16">
                    <path
                        d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z" />
                    <path
                        d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z" />
                </svg>
            </a>
        </div>
    </div>
</template>
<script setup>
import { userStore } from '@/store/user';
import { copyText } from '@/utilities';
import { getCurrentInstance } from 'vue';
const { appContext } = getCurrentInstance();
const emitter = appContext.config.globalProperties.emitter;
function copyHandler (target) {
    emitter.emit("copyText", { message: copyText(target) });
}
const user = userStore();
</script>