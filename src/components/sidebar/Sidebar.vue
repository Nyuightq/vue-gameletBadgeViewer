<template>
    <div class="h-dvh px-2 py-4 overflow-y-auto bg-gray-100 dark:bg-gray-800">
        <div class="flex flex-wrap space-y-2 font-medium">
            <div class="flex flex-col gap-4 w-full">
                <!-- 用戶資料 -->
                <UserProfile/>
                <!-- 盟會資訊 -->
                <TeamInfo/>
                <!-- 上次遊玩 -->
                <LastPlayInfo/>
            </div>
        </div>

        <!-- Username Accept -->
        <SearchUsername :inputValue="usernameInput" title="尋找：嘎姆擂台賬號ID" placeholder="嘎姆擂台賬號ID" customKey="Z" class="mb-3" />
        <!-- Project ID Accept -->
        <SearchProject :inputValue="projectInput" title="尋找：比對目標專案" placeholder="專案代碼" customKey="X" class="mb-3" />
    </div>
</template>

<script setup>
import SearchUsername from './SearchUsername.vue';
import SearchProject from './SearchProject.vue';
import UserProfile from './UserProfile.vue';
import LastPlayInfo from './LastPlayInfo.vue';
import TeamInfo from './TeamInfo.vue';
defineProps(['usernameInput', 'projectInput'])
</script>