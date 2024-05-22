import { defineStore } from "pinia";
import { storageService, storageKey } from "@/service/storage.js"

const SETTINGS = storageService.get(storageKey.USER_SETTINGS);
const USER = storageService.getFirst(storageKey.USER_LIST);

export const userStore = defineStore("userStore", {
    state: () => ({
        isGuest: SETTINGS?.isGuest || false,
        isDarkmode: SETTINGS?.isDarkmode || false,
        lang: SETTINGS?.lang || 'zh-Hant',
        usernameTemp: '',
        username: USER?.username || USER?.user?.username || "Nyuightq",
        name: USER?.name || USER?.user?.nickname || "Nyuightq",
        iconUrl: USER?.iconUrl || USER?.user?.iconUrl || "https://gamelet.online/gassets/svr/user/icon/1g1/624e575a7cec4.png",
        
        userDetail: null,
        teamDetail: null,
        lastPlayDetail: null,
        userListHistory: storageService.get(storageKey.USER_LIST) || []
    }),
    getters: {
        getUsername() {
            return this.isGuest === true ? null : this.username;
        } 
    },
    actions: {
        themeInput(darkmode){

            const theme = darkmode ? 'dark' : 'light';
            this.isDarkmode = darkmode ? true : false;
            darkmode
            ? document.documentElement.classList.add('dark')
            : document.documentElement.classList.remove('dark');
            document.documentElement.setAttribute('data-theme', theme);
            this.saveSettings();
            
        },
        toggleGuest() {
            this.isGuest = !this.isGuest;
        },
        deleteUser(target){
            storageService.remove(storageKey.USER_LIST, target);
            this.userListHistory = storageService.get(storageKey.USER_LIST); // Update
        },
        addUser(target){
            storageService.add(storageKey.USER_LIST, target);
            this.userListHistory = storageService.get(storageKey.USER_LIST); // Update
        },
        saveSettings(){
            const props = {
                isGuest: this.isGuest,
                isDarkmode: this.isDarkmode,
                lang: this.lang
            }
            storageService.set(storageKey.USER_SETTINGS, props);
        }
    },
});