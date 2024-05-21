import { defineStore } from "pinia";
import { storageService, storageKey } from "@/service/storage.js"

const SCORE_MODE = storageService.get(storageKey.SCORE_MODE);

/**
 * @property {String} username - 使用者名稱。
 * @property {String} projectID - 專案 ID。
 * @property {String} key - 分數模式鍵值。
 * @property {String} name - 分數模式名稱。
 * @property {String} duration - 分數模式持續時間。
 * @property {String} unit - 分數模式單位。
 */
export const scoreStore = defineStore("scoreStore", {
    state: () => ({
        username: SCORE_MODE?.username,
        projectID: SCORE_MODE?.projectID,
        key: SCORE_MODE?.key,
        name: SCORE_MODE?.name,
        unit: SCORE_MODE?.unit,
        profileDuration: 'History',
        scoreDuration: 'History',
        scoreModesList: [],
        leaderboardList: [],
        profileScoreList: [],
        profileScoreListLoadState: false
    }),
    getters: {
        scoreDurationToString() {
            const zhHant = {
                'History': '歷史記錄',
                'Monthly': '本月',
                'Weekly': '本週',
                'Daily': '本日'
            }
            return zhHant[this.scoreDuration];
        }
    },
    actions: {
        changeScoreDuration(scoreDuration){
            this.scoreDuration = scoreDuration;
        },
        changeProfileDuration(profileDuration){
            this.profileDuration = profileDuration;
        },
        scoreDurationLabelToString(input) {
            const zhHant = {
                'History': '歷史記錄',
                'Monthly': '本月',
                'Weekly': '本週',
                'Daily': '本日'
            }
            return zhHant[input];
        }
    },
});