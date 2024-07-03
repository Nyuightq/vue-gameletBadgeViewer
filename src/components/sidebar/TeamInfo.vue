<template>
    <div class="card card-side bg-base-100 w-full flex flex-col mb-3 shadow-md ">
        <div class="text-center p-4" v-if="user.teamDetail === null || user.teamDetail.teamship === null">
            *該用戶不隸屬於任何盟會*
        </div>
        <div v-else>
            <div class="flex flex-row">
                <figure class="p-4 w-32"><img alt="盟會旗幟"
                        :src="user.teamDetail.teamship.team.iconUrl"></figure>
                <div class="p-4">
                    <h4 class="text-sky-700 dark:text-sky-600 font-bold" >
                        {{ user.teamDetail.teamship.team.nickname }}
                    </h4>
                </div>
            </div>

            <div class="p-3 py-0 mb-2 flex items-center gap-2">
                <a target="_blank" class="btn btn-circle btn-xs end-0" :href="'https://gamelet.online/team/' + user.teamDetail.teamship.team.teamname">
                    <svg
                        xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        class="bi bi-link-45deg" viewBox="0 0 16 16">
                        <path
                            d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z" />
                        <path
                            d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z" />
                    </svg></a>
                <span class="badge border-cyan-800 font-bold">ID</span>
                <a class="text-sm break-all cursor-pointer"
                    @click="copyHandler(user.teamDetail.teamship.team.teamname)">{{user.teamDetail.teamship.team.teamname}}</a>
            </div>
            <div class="p-3 py-0 mb-2">
                <span class="badge border-cyan-800 font-bold">加入時間</span>
                <span class="text-sm break-all"> {{ " " + formatTime(user.teamDetail.teamship.ship.confirmTime*1000) }}</span>
            </div>
            <div class="p-3 py-0 mb-2">
                <span class="badge border-cyan-800 font-bold">頭銜</span>
                <span class="text-sm break-all">{{ " " + user.teamDetail.teamship.ship.meta?.title || "成員" }}</span>
            </div>
        </div>
    </div>
</template>
<script setup>
import { formatTime } from '@/utilities';
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