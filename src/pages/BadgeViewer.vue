<script setup>
import BadgeList from '@/components/bagdeList/BadgeList.vue'
import ProjectCard from '@/components/bagdeList/Project.vue'
import Sidebar from '@/components/sidebar/Sidebar.vue'
import Leaderboard from '@/components/scoreList/Leaderboard.vue'

import { ref, onMounted } from 'vue'; // Import ref and onMounted
import { useModalStore } from '@/store/modal';
import { projectStore } from '@/store/project';
import { userStore } from '@/store/user';
import { scoreStore } from '@/store/score';
import { fetchApi, API_TARGET } from '@/service/api';
import { convertScore } from '@/utilities';
import { storageService, storageKey } from '@/service/storage';

const modal = useModalStore();
const user = userStore();
const project = projectStore();
const score = scoreStore();
// Define reference items
const usernameInput = ref('');
const projectInput = ref('');
const collectedBadges = ref([]);
const uncollectedBadges = ref([]);
const badgeQuantity = ref(0);
const badgeTotalPpl = ref(0);

async function checkProject(projectID) {
   const projectDetail = await fetchApi(API_TARGET.PROJECT(user.lang), { codes: [projectID] }); 
   if ( projectDetail.clients.length === 0 ) {
      modal.openMessageModal("查無專案ID為 '" + projectID + "' 的專案");
      return false;
   }
   if ( projectDetail.clients[0].cover == "" ) {
      modal.openMessageModal("專案 '" + projectID + "' 推測為模組專案，請轉到『模組更新日誌』頁面");
      return false;
   }
   return projectDetail;
}

const submitProfileLeaderbaord = async () => {
   if (user.getUsername === null) return;
   score.profileScoreListLoadState = true;
   const profileDuration = score.profileDuration;
   const username = user.username;
   const projectID = project.projectID;
   const lang = user.lang;

   const profileScoreList = [];
   let index = 0;
   for (let item of score.scoreModesList) {
      index++;
      if ( index > 16 ) break;
      let result = await subFetchApi(item);
      if ( result === false ) continue;
      if ( projectID !== project.projectID ) break; // Cancel the fetching
      profileScoreList.push(result);
   }

   score.profileScoreList = profileScoreList;
   score.profileScoreListLoadState = false;

   async function subFetchApi (data) {
      let result = await fetchApi(API_TARGET.USER_SCORES_BOARD(lang, projectID, data.key, profileDuration, username));
      let record = result.scores.find(item => item.user.username == username);
        let index = result.rankStart + Math.max(result.scores.findIndex(item => item.user.username == username), 0);
        if (record === undefined && result.rankStart === 1) return false;
        let props = {
            'index': index,
            'name': data.name,
            'score': record === undefined ? null : record.score,
            'time': record === undefined ? null : record.time,
            'unit': data.unit
        };
      return props;
   }
}

const submitLeaderboard = async (key = score.key, name = score.name, unit = score.unit || undefined) => {
   const leaderboardResult = await fetchApi(API_TARGET.USER_SCORES_BOARD(user.lang, project.projectID, key, score.scoreDuration, user.getUsername));
   score.leaderboardList = calculateRankIndex(leaderboardResult);
   score.name = name;
   score.key = key;
   score.unit = unit;

   function calculateRankIndex (leaderboardResult) {
      let rankIndex = leaderboardResult.rankStart;
      let tempScore = null;
      return leaderboardResult.scores.map((ele) => {
         if (tempScore !== ele.score && tempScore !== null) {
            rankIndex++;
         }
         tempScore = ele.score;
         ele.index = rankIndex;
         ele.score = convertScore(ele.score, unit);
         return ele;
      });
   };
}

const checkScoremodes = async () => {
   if (score.projectID === project.projectID) return;
   const modesListResult = await fetchApi(API_TARGET.SCORE_MODES(user.lang, project.projectID));
   score.scoreModesList = modesListResult.list;
   score.projectID = project.projectID;

   const firstMode = score.scoreModesList[0];
   submitLeaderboard(firstMode.key, firstMode.name, firstMode.unit);
   submitProfileLeaderbaord();
}

const submitProject = async (init = null) => { 
   let projectID = init || projectInput.value;
   if ( projectID == '' || projectID === null) return;
   if (projectID.includes('-')) {
        projectID = projectID.replace(/-/g, '_');
    }
    if (projectID.startsWith('https://')) {
        projectID = projectID.split('.')[0].split('//')[1];
    }

   const projectDetail = await checkProject(projectID);
   if (!projectDetail) return;

   // Start to implement all the fetch function
   project.projectID = projectID;
   project.projectDetail = projectDetail.clients[0];
   let tempProjectDetail = projectDetail.clients[0];
   tempProjectDetail.id = projectDetail.clients[0].code;
   projectInput.value = projectDetail.clients[0].code;
   project.addProject(tempProjectDetail);

   collectedBadges.value = [];
   uncollectedBadges.value = [];

   doBadgeList();
   checkScoremodes();

   async function doBadgeList() {
      const badgeResult = await fetchApi(API_TARGET.USER_BADGES(user.lang, projectID, user.getUsername));
      badgeQuantity.value = badgeResult.list.length;
      if (user.getUsername === null){
         uncollectedBadges.value = badgeResult.list;
         return;
      }

      for (const badge of badgeResult.list) { // Use 'badge' instead of 'data'
         badge.lastTime !== undefined
         ? collectedBadges.value.push(badge)
         : uncollectedBadges.value.push(badge);
      }

      const badgeDetail = await fetchApi(API_TARGET.BADGE_DETAIL(user.lang, projectID, badgeResult.list[0].code));
      badgeTotalPpl.value = parseInt(badgeDetail.totalPpl);
   }
}

const submitUsername = async (init = null, firstInit = false) => { 
   let username = init || usernameInput.value;
   if (username.startsWith("https://gamelet.online/user/")) {
        username = username.split('/')[4];
   }

   if ( username == '' || username === null) return;
   if ( (username.toUpperCase() === user.usernameTemp.toUpperCase() || username.toUpperCase() === user.username.toUpperCase()) && !firstInit ) {
      modal.openMessageModal("重覆填入相同賬號ID");
      return;
   }
   user.usernameTemp = username;
   
   const userDetail = await fetchApi(API_TARGET.PROFILE(user.lang, username)); 
   if ( userDetail.user === null ) {
      modal.openMessageModal("查無嘎姆賬號ID為 '" + username + "' 的用戶");
      return;
   } 

   // Start to implement all the fetch function
   user.userDetail = userDetail;
   let tempUserDetail = userDetail;
   tempUserDetail.id = userDetail.user.username;
   usernameInput.value = userDetail.user.username;
   user.addUser(tempUserDetail);

   user.username = userDetail.user.username;
   user.name = userDetail.user.nickname;
   user.iconUrl = userDetail.user.iconUrl;
   doTeamDetail();
   doLastPlayDetail();
   // SubmitProject
   submitProject(project.projectID);


   // Membership
   async function doTeamDetail() {
      user.teamDetail = await fetchApi(API_TARGET.USER_TEAMSHIP(user.lang, username));
   }
   // Last play initialize
   async function doLastPlayDetail() {
      if ( userDetail.user.meta === undefined ){
         user.lastPlayDetail = null;
      }
      else {
         const lastPlayCode = userDetail.user.meta.lastGame.code;
         const lastPlayResult = await fetchApi(API_TARGET.PROJECT(user.lang), { codes: [lastPlayCode] });
         user.lastPlayDetail = {
            iconUrl: lastPlayResult.clients[0].cover,
            lastGame: userDetail.user.meta.lastGame
         }
      }
   }
}

const vFocus = {
  mounted: (el) => el.focus()
}
function deleteOption(id, type){
   if ( type === 'PROJECT' ) project.deleteProject(id);
   if ( type === 'USER' ) user.deleteUser(id);
}
function selectOption(id, type){
   if ( type === 'PROJECT' ) {
      submitProject(id);
      modal.closeSearchProjectModal();
   }
   if ( type === 'USER' ) { 
      submitUsername(id);
      modal.closeSearchUsernameModal();
   }
}

onMounted(() => {
  submitUsername(user.username, true);
});

</script>

<template>
    <Sidebar id="profile-sidebar"
      :usernameInput="usernameInput"
      :projectInput="projectInput"
        class="fixed top-0 left-0 z-10 w-80 max-w-full h-screen text-neutral-900 dark:text-neutral-300 transition-transform md:translate-x-0 drop-shadow-md scroll-smooth"/>

    <main class="p-3 sm:p-4 md:ml-80 min-h-screen transition-all bg-white text-neutral-900 dark:text-neutral-300 dark:bg-gray-800/95">
      <h2 class="text-sky-700 dark:text-sky-600 font-bold mb-4">專案勳章檢視</h2>
      <div class="p-0 sm:p-4 sm:border-2 sm:border-gray-200 dark:border-gray-500 sm:border-dashed sm:rounded-lg">
        <ProjectCard />

        <div role="alert" class="alert mb-2 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="text-amber-400 stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <span class="text-amber-700"><strong>專案勳章檢視</strong> 頁面會有隱藏勳章、或是尚未公開獲得條件的內容，請依據自身需求使用</span>
         </div>
         
        <BadgeList title="已獲得勳章" 
        noBadgeResponse="尚未蒐集該專案任一勳章"
        :badges="collectedBadges" 
        :totalBadges="badgeQuantity"
        :totalPpl="badgeTotalPpl" class="mb-4"/>

        <BadgeList title="尚未獲得的勳章" 
        noBadgeResponse="勳章已蒐集完畢"
        :badges="uncollectedBadges" 
        :totalBadges="badgeQuantity"
        :totalPpl="badgeTotalPpl" class="mb-4"/>

        <Leaderboard 
        @call-leaderboard="(key, name, unit) => submitLeaderboard(key, name, unit)" 
        @update-leaderboard="()=>submitLeaderboard()"
        @update-profile-board="()=>submitProfileLeaderbaord()"
        v-if="score.scoreModesList.length !== 0" />
      </div>
    </main>

    <!-- Search Functionality modals -->
    <dialog class="modal" :class="{ 'modal-open': modal.searchUsernameModal.isOpen }" v-if="modal.searchUsernameModal.isOpen" @keydown.esc="modal.closeSearchUsernameModal">
      <div class="modal-box opacity-95">
         <div class="flex flex-row relative gap-x-4 items-center">
            <label role="button" @click="submitUsername()">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"></path></svg>
            </label>
            <form @submit.prevent="submitUsername()" class="flex-grow">
               <input v-focus class="input input-bordered input-sm w-full" placeholder="嘎姆擂台賬號ID" type="text" @input="usernameInput = $event.target.value" :value="usernameInput">
            </form>
            
            <form class="flex-shrink-0 sm:inline hidden">
               <button @click="modal.closeSearchUsernameModal" class="kbd kbd-md  top-0 end-0 focus:outline-none btn btn-sm">Esc</button>
            </form>
         </div>
        <p class="py-4 font-bold ">快速搜索（歷史記錄）</p>
        <div class="flex flex-col">
            <button type="button" v-for="ele in user.userListHistory" @click="selectOption(ele.id, 'USER')" class="flex flex-row flex-1 items-center gap-x-4 rounded-xl md:rounded-3xl p-3  bg-base-100 shadow-sm bg-slate-500/5 hover:bg-slate-500/25 transition-colors duration-150 cursor-pointer w-100">
               <figure class="block"><img class="rounded-xl min-w-8 h-8 md:rounded-2xl md:h-12 md:w-12"
                  :src="ele?.user?.iconUrl || ele?.iconUrl" alt="avatar"/></figure>
               <div class="truncate me-auto text-start">
                  <p class="block truncate text-sky-700 dark:text-sky-600">{{ ele?.user?.nickname || ele?.name }}</p>
                  <p class="text-xs block truncate">{{ ele.id }}</p>
               </div>

               <button @click.stop="deleteOption(ele.id, 'USER')" class="flex btn btn-xs btn-error text-white end-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16"><path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/></svg>
               </button>
            </button>
        </div>
      </div>
      <div class="modal-backdrop">
        <button @click="modal.closeSearchUsernameModal">close</button>
      </div>
    </dialog>


    <dialog class="modal" :class="{ 'modal-open': modal.searchProjectModal.isOpen }" v-if="modal.searchProjectModal.isOpen" @keydown.esc="modal.closeSearchProjectModal">
      <div class="modal-box opacity-95">
         <div class="flex flex-row relative gap-x-4 items-center">
            <label role="button" @click="submitProject()">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"></path></svg>
            </label>
            <form @submit.prevent="submitProject()" class="flex-grow">
               <input v-focus class="input input-bordered input-sm w-full" placeholder="專案代碼" type="text" @input="projectInput = $event.target.value" :value="projectInput">
            </form>
            
            <form class="flex-shrink-0 sm:inline hidden">
               <button @click="modal.closeSearchProjectModal" class="kbd kbd-md  top-0 end-0 focus:outline-none btn btn-sm">Esc</button>
            </form>
         </div>
        <p class="py-4 font-bold ">快速搜索（歷史記錄）</p>
        <div class="flex flex-col">
            <button v-for="ele in project.projectListHistory" @click="selectOption(ele.id, 'PROJECT')" class="flex flex-col sm:flex-row sm:justify-start flex-1 items-center gap-x-4 rounded-xl md:rounded-3xl p-3  bg-base-100 shadow-sm bg-slate-500/5 hover:bg-slate-500/25 transition-colors duration-150 cursor-pointer w-100">
               <figure><img class="rounded-xl w-40 object-cover sm:w-20 h-20 sm:h-12 md:rounded-2xl" :src="ele?.cover || ele?.iconUrl" alt="avatar"/></figure>
               <div class="flex flex-grow flex-1 w-full text-start">
                  <div class="truncate me-auto">
                     <p class="block truncate text-sky-700 dark:text-sky-600">{{ ele.name }}</p>
                     <p class="text-xs block truncate">{{ele.id}}</p>
                  </div>

                  <div>
                     <button @click.stop="deleteOption(ele.id, 'PROJECT')" class="flex btn btn-xs btn-error text-white end-0 float-end">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16"><path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/></svg>
                     </button>
                  </div>
               </div>
            </button>
        </div>
      </div>
      <div class="modal-backdrop">
        <button @click="modal.closeSearchProjectModal">close</button>
      </div>
    </dialog>

</template>
