<script setup>
import ProjectItem from '@/components/patchNoteReader/ProjectItem.vue'
import { ref, computed, onMounted } from 'vue';
import { fetchApi, API_TARGET } from '@/service/api';
import Showdown from 'showdown';

const projectDesc = ref('[Description]');
const projectDocType = ref('CHANGELOG.md');
const renderProjectDoc = computed(() => {
    return new Showdown.Converter().makeHtml(projectDesc.value);
});

const myRecommendProjectList = [
    {code:'TwilightWarsLib', title:"TwilightWarsLib", iconUrl:"https://a.gamelet.online/gassets/resource/b143f1361a17e6272e4f69699f07e1ee/thumb_5e6bb26f07e00.jpg"},
    {code:'TwilightWarsEvents', title:"TwilightWarsEvents", iconUrl:"https://a.gamelet.online/gassets/resource/bd37d390c3e5eac9a84cba13accc9899/cg_events_cover.jpg"},
    {code:'TwilightWarsEventsExp', title:"TwilightWarsEventsExp", iconUrl:"https://a.gamelet.online/gassets/resource/6d7fd76dfa57de3f8981e5fafc822812/thumb_60aaa1d067bfd.jpg"},
    {code:'tweventsalt', title:"慢工出版", iconUrl:"https://a.gamelet.online/gassets/resource/e810f1d714f31aeb771ec4bda0fc31bf/thumb_619936510c84e.jpg"},
]

const currentSelect = ref(myRecommendProjectList[0].code);

onMounted(()=> {
    fetchDocument(currentSelect);
})
async function fetchDocument(code){
    const result = await fetchApi(API_TARGET.PROJECT_DOC(code.value, projectDocType.value), null, 'GET');
    projectDesc.value = result.content;
    return;
}
</script>
<template>
    <aside id="profile-sidebar" class="fixed top-0 left-0 z-10 w-80 max-w-full h-screen transition-transform md:translate-x-0 drop-shadow-md scroll-smooth">
        <ul class="flex flex-col p-3 h-screen gap-4 bg-gray-100 dark:bg-gray-800">
            <li class="menu-title">模組專案推薦列</li>
            <li v-for="project in myRecommendProjectList">
                <ProjectItem @click="fetchDocument(project.code)" :title="project.title" :iconUrl="project.iconUrl"/>
            </li>
        </ul>
    </aside>
    <main class="p-3 sm:p-4 md:ml-80 min-h-screen transition-all dark:bg-gray-800/95">
        <h2 class="text-sky-700 dark:text-sky-600 font-bold mb-4">模組專案文檔檢視</h2>
        <div class="p-0 sm:p-4 sm:border-2 sm:border-gray-200 dark:border-gray-500 sm:border-dashed sm:rounded-lg">
            <div class="card bg-base-100 shadow-md">
                <div class="card-body p-3">
                    <div class="card-title text-sky-700 dark:text-sky-600 font-bold p-2">Test</div>
                    <div class="prose prose-slate" v-html="renderProjectDoc"></div>
                </div>
                
            </div>
        </div>
    </main>
</template>