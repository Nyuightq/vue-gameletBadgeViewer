<template>
    <button type="button" class="cursor-pointer flex items-center justify-center h-16 w-16" ref="badgeBtn" @click="toggleModal">
        <img v-bind:src="badgeData.iconUrl" v-bind:alt="badgeData.name">
    </button>

    <div class="modal" :class="{ 'modal-open': showModal }" v-if="showModal">
      <div class="modal-box text-center">
        <h3 class="font-bold text-lg"> {{ badgeData.name }} {{ badgeData.repeatable == 1 ?'*可重覆獲得':''}}</h3>
        <p id="badge-modal-count" class="pb-4">{{ badgeData.lastTime !== undefined && badgeData.repeatable == 1 ? 'x' + badgeData.count + ' | ' : '' }} {{ badgeData.lastTime !== undefined ? formatTime(badgeData.lastTime*1000) : '' }}</p>
        <div class="flex justify-center">
         <img id="badge-modal-icon" class="max-h-20" v-bind:src="badgeData.iconUrl">
        </div>
        <p class="py-4 whitespace-pre-line">{{ badgeData.desc }}</p>
        <p class="mx-auto justify-center flex badge bg-base-200">獲得玩家數量 x{{ badgeData.aquired }}</p>
        <p class="mx-auto justify-center flex badge bg-base-200">獲得比例 ({{ (parseFloat( parseInt(badgeData.aquired) / totalPpl )*100).toFixed(2) }} %)</p>
      </div>
      <div class="modal-backdrop">
        <button @click="toggleModal">close</button>
      </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useTippy } from 'vue-tippy'
import { formatTime } from '@/utilities.js'

const badgeBtn = ref()
const showModal = ref(false)
const toggleModal = () => { showModal.value = !showModal.value; }
onMounted(() => {
  document.addEventListener('keydown', (event) => {
    if (showModal.value === true && event.key === 'Escape') {
      showModal.value = false;
    }
  });
})
const props = defineProps({
  badgeData: {
    type: Object,
    required: true
  },
  totalPpl: Number
});

const { badgeData } = props;

useTippy(badgeBtn, {
  content: () => {
    const tippyHTML = badgeData.lastTime !== undefined
    ? `<div>
        ${ badgeData.repeatable == 1 ? '*':''}<strong>${badgeData.name}</strong><span> x${badgeData.count}</span>
        <p>${ formatTime(badgeData.lastTime*1000) }</p>
        <p>${badgeData.desc}</p>
        <p>獲得玩家數量 x${badgeData.aquired}</p>
    </div>`
    
    : `<div>
        ${ badgeData.repeatable == 1 ? '*':''}<strong>${badgeData.name}</strong>
        <p>${badgeData.desc}</p>
        <p>獲得玩家數量 x${badgeData.aquired}</p>
    </div>`;
    return tippyHTML;
  },
  allowHTML: true
})
</script>