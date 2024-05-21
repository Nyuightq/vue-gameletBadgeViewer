import { defineStore } from "pinia";
import { storageService, storageKey } from "@/service/storage.js"

const PROJECT = storageService.getFirst(storageKey.PROJECT_LIST);

/**
 * @property {String} projectID - 目前選擇的專案 ID。
 * @property {String} projectIconUrl - 目前選擇專案的圖示 URL。
 * @property {Array} projectListHistory - 專案清單的歷史記錄。
 * @property {Object} projectDetail - API調用後的暫存結果。
 */
export const projectStore = defineStore("projectStore", {
    state: () => ({
        projectID: PROJECT?.id || 'TwilightWars',
        projectIconUrl: PROJECT?.iconUrl || 'https://code.gamelet.com/gassets/resource/a9a1c132f89465a1111135a068c65920/thumb_5e6be3ce50d0e.jpg',
        
        projectDetail: null,
        projectListHistory: storageService.get(storageKey.PROJECT_LIST) || []
    }),
    actions: {
        deleteProject(target){
            storageService.remove(storageKey.PROJECT_LIST, target);
            this.projectListHistory = storageService.get(storageKey.PROJECT_LIST); // Update
        },
        addProject(target){
            storageService.add(storageKey.PROJECT_LIST, target);
            this.projectListHistory = storageService.get(storageKey.PROJECT_LIST); // Update
        }
    },
});