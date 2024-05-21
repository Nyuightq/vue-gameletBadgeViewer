<template>
    <div class="card lg:card-side bg-base-100 shadow-md mb-4" v-if="project.projectDetail!==null">
        <figure class="p-2 min-w-60"><img id="project-image" class="rounded-md md:h-32" v-bind:src="project.projectDetail.cover" alt="Project image" />
        </figure>
        <div class="card-body p-3">
            <h2 class="card-title text-sky-700 dark:text-sky-600 font-bold">{{ project.projectDetail.name }}</h2>
            <div class="prose prose-slate" v-html="renderProjectDesc"></div>

            <div class="flex flex-row items-center gap-2">
                <div class="avatar shrink-0">
                    <div class="w-8 rounded">
                        <img alt="avatar" v-bind:src="project.projectDetail.owner.icon">
                    </div>
                </div>
                <span class="text-sm break-all"> {{ ' ' + project.projectDetail.owner.name }}</span>
            </div>

            <p>
                <span class="badge border-cyan-800 font-bold">ID</span>
                <span class="text-sm break-all cursor-pointer" @click="copyHandler(project.projectDetail.code)"> {{ ' ' + project.projectDetail.code }}</span>
            </p>
            <p>
                <span class="badge border-cyan-800 font-bold">評分 </span>
                <span class="text-sm break-all"> {{ ' ' + project.projectDetail.rate.avg.toFixed(2) + ' ( ' + project.projectDetail.rate.votes + ' 位玩家評分 )' }}</span>
            </p>
            <div class="card-actions">
                <a target="_blank" class="btn btn-sm pe-4" v-bind:href="'https://' + project.projectDetail.code + '.gamelet.online'">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        class="bi bi-link-45deg" viewBox="0 0 16 16">
                        <path
                            d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z">
                        </path>
                        <path
                            d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z">
                        </path>
                    </svg>
                    Link
                </a>
            </div>
        </div>
    </div>
</template>

<script setup>
import Showdown from 'showdown';
import { projectStore } from '@/store/project';
import { ref, computed, watch } from 'vue';
import { copyText } from '@/utilities';

import { getCurrentInstance } from 'vue';
const { appContext } = getCurrentInstance();
const emitter = appContext.config.globalProperties.emitter;
function copyHandler (target) {
    emitter.emit("copyText", { message: copyText(target) });
}

const project = projectStore();

const projectDesc = ref( project.projectDetail?.desc || '[Description]' );
watch(() => project.projectDetail, (newVal) => {
    if (newVal) {
        projectDesc.value = newVal.desc;
    }
}, { immediate: true });

const renderProjectDesc = computed(() => {
    return new Showdown.Converter().makeHtml(projectDesc.value);
});
</script>