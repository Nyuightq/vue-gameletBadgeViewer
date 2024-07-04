<template>
    <h2 class="card-title text-sky-700 dark:text-sky-600 font-bold p-2">分數排行</h2>
    <div id="leaderboard-list" class="grid lg:grid-cols-4 grid-cols-2 gap-4">
        <div class="card bg-base-100 p-0 shadow-md col-span-2 row-span-3" id="leaderboard-list-container">
            <div class="card-body p-4">
                <div class="card-title justify-between">
                    <div class="dropdown">
                        <div tabindex="0" class="btn btn-sm m-1 text-start min-w-32">{{ score.name }}</div>
                        <ul tabindex="0"
                            class="block overflow-y-auto max-h-72 p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box max-w-max"
                            id="leaderboard-score-mode">
                            <li v-for="mode in score.scoreModesList">
                                <a @click="scoreListing(mode.key, mode.name, mode.unit || '')"  :class="{'bg-gray-200 dark:bg-gray-600': mode.key === score.key}">
                                {{ mode.name }}</a></li>
                        </ul>
                    </div>
                    <div class="dropdown">
                        <div tabindex="0" class="btn btn-sm m-1">{{ score.scoreDurationToString }}</div>
                        <ul tabindex="0"
                            class="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box max-w-max w-52">
                            <li v-for="duration in ['Daily', 'Weekly', 'Monthly', 'History']">
                                <a @click="changeScoreDuration(duration)" :class="{'bg-gray-200 dark:bg-gray-600': duration === score.scoreDuration}">
                                {{ score.scoreDurationLabelToString(duration) }}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="table">
                        <tbody>
                            <tr v-if="score.leaderboardList.length !== 0" v-for="scoreEntity in score.leaderboardList"
                                :class="{ 'bg-base-200': (scoreEntity.user.username === user.username) }">
                                <th>{{ scoreEntity.index }}</th>
                                <td class="flex items-center">
                                    <a :href="'https://gamelet.online/user/' + scoreEntity.user.username"
                                        target="_blank" class="me-2 btn btn-circle btn-xs end-0"><svg
                                            xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                            fill="currentColor" class="bi bi-link-45deg" viewBox="0 0 16 16">
                                            <path
                                                d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z" />
                                            <path
                                                d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z" />
                                        </svg></a>
                                    <a @click="searchProfile(scoreEntity.user.username)"
                                        class="flex items-center cursor-pointer">
                                        <div class="avatar mx-2">
                                            <div class="w-6 h-6 rounded"><img :src="scoreEntity.user.iconUrl" /></div>
                                        </div>
                                        <span>{{ scoreEntity.user.nickname }}</span>
                                    </a>
                                </td>
                                <td class="text-end"><span :title="formatTime(scoreEntity.time * 1000)">
                                    {{ scoreEntity.score }}</span></td>
                            </tr>
                            <tr v-else>
                                <td class="text-center bg-gray-100 dark:bg-gray-800 rounded-lg">
                                    *排行榜暫無任何記錄*
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="col-span-2">
            <div role="alert" class="alert">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    class="stroke-info shrink-0 w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-cyan-900 dark:text-cyan-600">
                    <strong>排行榜時間記錄</strong> 
                    依據記錄方式，可能是最初記錄的時間，或者是最近一次更新的時間。<br>
                    <small class=" text-sm">*僅提取最前面16個排行榜</small>
                </span>
            </div>
            <div class="dropdown mt-3">
                <div tabindex="0" class="btn btn-sm m-1 ">{{ score.scoreDurationLabelToString(score.profileDuration) }}</div>
                <ul tabindex="0"
                    class="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box max-w-max w-52">
                    <li v-for="duration in ['Daily', 'Weekly', 'Monthly', 'History']">
                        <a @click="changeProfileDuration(duration)" :class="{'bg-gray-200 dark:bg-gray-600': duration === score.profileDuration}">
                        {{ score.scoreDurationLabelToString(duration) }}
                        </a>
                    </li>
                </ul>
            </div>
        </div>

        <div class="grid grid-cols-2 col-span-2 gap-4">
            <!-- Loading -->
            <div v-if="score.profileScoreListLoadState === true" class="bg-base-200 col-span-2 card">
                <div class="card-body flex justify-center items-center">
                <span class="loading loading-dots loading-lg text-cyan-600"></span>
                </div>
            </div>
            <div v-if="score.profileScoreList.length !== 0 && score.profileScoreListLoadState === false" v-for="scoreData in score.profileScoreList" class="card shadow-md bg-base-200">
                <div v-if="scoreData.score !== null" class="card-body p-4">
                    <div class="font-bold text-cyan-900 dark:text-cyan-600 m-0 break-words">{{scoreData.name}}</div>
                    <div><span class="badge border border-cyan-800 me-2">{{scoreData.index}}.</span><span>{{convertScore(scoreData.score, scoreData.unit)}}</span></div>
                    <small>{{formatTime(scoreData.time*1000)}}</small>
                </div>
                <div class="card-body p-4 z-1" v-else>
                    <div class="font-bold text-yellow-900 m-0">{{scoreData.name}}</div>
                    <div><span class="badge border border-yellow-800 me-2">{{scoreData.index}}?</span><small>由於相同分數保持者過多，無法正確讀取</small></div>
                </div>
                <div v-if="scoreData.score === null" class="absolute flex justify-center items-center w-full h-full opacity-25 z-0 pointer-events-none"><svg xmlns="http://www.w3.org/2000/svg" class="text-amber-400 stroke-current shrink-0 h-16 w-16" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div>
            </div>

            <div v-if="score.profileScoreList.length === 0 && score.profileScoreListLoadState === false" class="bg-base-200 col-span-2 card">
                <div class="card-body flex justify-center items-center">
                <span>*沒有記錄*</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { scoreStore } from '@/store/score';
import { userStore } from '@/store/user';
import { formatTime, convertScore, copyText } from '@/utilities';
import { getCurrentInstance } from 'vue';
const { appContext } = getCurrentInstance();
const emitter = appContext.config.globalProperties.emitter;
function copyHandler (target) {
    emitter.emit("copyText", { message: copyText(target) });
}

const score = scoreStore();
const user = userStore();

const emit = defineEmits(['callLeaderboard', 'updateLeaderboard', 'updateProfileBoard', 'searchProfile'])

function searchProfile(username){
    emit('searchProfile', username);
}
function changeScoreDuration(value){
    score.changeScoreDuration(value);
    emit('updateLeaderboard');
}

function changeProfileDuration(value){
    score.changeProfileDuration(value);
    emit('updateProfileBoard');
}

function scoreListing(key, name, unit){

    if(key==score.key) return;
    emit('callLeaderboard', key, name, unit);

}
</script>