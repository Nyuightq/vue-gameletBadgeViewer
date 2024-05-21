<template>
  <div class="card shadow-md">
    
    <div class="card-body p-3">
      <h2 class="card-title text-sky-700 dark:text-sky-600 font-bold p-2">
        {{ title }}
        x{{ badges.length }}
      </h2>

      <div v-if="badges.length !== 0" class="min-h-12 skeleton p-4 flex flex-wrap gap-y-2">
          
          <Badge v-for="badge in badges" :badgeData="badge" :totalPpl="totalPpl"/>

      </div>

      <div v-else class="min-h-12 py-8 rounded-3xl text-center bg-neutral-950/20">
        <span v-if="totalBadges !== 0">*{{noBadgeResponse}}*</span>
        <span v-else>*該專案不含勳章*</span>
      </div>

    </div>
    
  </div>
</template>

<script setup>
import Badge from './Badge.vue'
defineProps(['title', 'badges', 'totalBadges', 'totalPpl', 'noBadgeResponse'])
</script>