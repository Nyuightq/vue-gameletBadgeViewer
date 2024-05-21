<template>
    <div class="card bg-base-100 shadow-md mb-4">
        <div v-if="user.lastPlayDetail === null" class="text-center p-4">
            *該用戶查無遊玩記錄*
        </div>
        <div v-else>
            <figure class="p-1">
                <img v-bind:src="user.lastPlayDetail.iconUrl" class="rounded-md" alt="Project image" />
            </figure>
            <div class="card-body p-4 py-2">
                <h4> {{ user.lastPlayDetail.lastGame.name }}</h4>
                <p class="flex items-center align-top gap-2">
                    <a target="_blank" class="btn btn-circle btn-xs end-0" v-bind:href="'https://' + user.lastPlayDetail.lastGame.code + '.gamelet.online'">
                        <svg
                            xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            class="bi bi-link-45deg" viewBox="0 0 16 16">
                            <path
                                d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z" />
                            <path
                                d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z" />
                        </svg></a>
                    <span class="badge border-cyan-800 font-bold">ID</span>
                    <a @click="copyHandler(user.lastPlayDetail.lastGame.code)" class="text-sm break-all cursor-pointer">{{ user.lastPlayDetail.lastGame.code }}</a>
                </p>
                <p>
                    <span class="badge border-cyan-800 font-bold">上次遊玩</span>
                    <span class="text-sm break-all">{{ ' ' + formatTime(user.lastPlayDetail.lastGame.time*1000) }}</span>
                </p>
            </div>
        </div>
    </div>
</template>
<script setup>
import { formatTime, copyText } from '@/utilities';
import { userStore } from '@/store/user';
import { getCurrentInstance } from 'vue';
const { appContext } = getCurrentInstance();
const emitter = appContext.config.globalProperties.emitter;
function copyHandler (target) {
    emitter.emit("copyText", { message: copyText(target) });
}
const user = userStore();
</script>