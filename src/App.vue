<script setup>
import Toast from './components/Toast.vue'
import { useModalStore } from './store/modal'
import { nextTick, onMounted, ref } from 'vue'
import { userStore } from './store/user'
import { storageKey, storageService } from './service/storage'
import { RouterView, RouterLink } from 'vue-router'
import { getCurrentInstance } from 'vue';
const { appContext } = getCurrentInstance();
const emitter = appContext.config.globalProperties.emitter;

const showToastVisible = ref(false);
const copiedText = ref('');
const user = userStore();
const modal = useModalStore();
const vFocus = { mounted: (el) => el.focus() }


const closeMessageModal = async () => {
  modal.closeMessageModal();
  await nextTick(); // Wait for the DOM to update after closing the modal
  focusNextModal();
};

const focusNextModal = () => {
  const openModals = document.querySelectorAll('.modal.modal-open');
  if (openModals.length > 0) {
    openModals[0].focus();
  }
};

const handleToggleDarkmode = () => {
   const isChecked = document.getElementById('toggleTheme').checked;
   user.themeInput(isChecked);
}

let toastTimeout;
function showToast() {
  showToastVisible.value = true;

  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  toastTimeout = setTimeout(() => {
    showToastVisible.value = false;
    toastTimeout = null;
  }, 2000);
}

onMounted(()=>{
  document.getElementById('profile-btn').addEventListener('click', function() {
      var drawerId = this.getAttribute('data-drawer-toggle');
      var drawerElement = document.getElementById(drawerId);
      var mainElement = document.querySelector('main');
      var checkboxElement = document.getElementById('profile-checkbox');

      // Toggle classes on the drawer
      if (drawerElement.classList.contains('-translate-x-full')) {
         drawerElement.classList.remove('-translate-x-full');
         drawerElement.classList.add('md:translate-x-0');
      } else {
         drawerElement.classList.add('-translate-x-full');
         drawerElement.classList.remove('md:translate-x-0');
      }

      // Toggle class on the main element
      mainElement.classList.toggle('md:ml-80');

      // Toggle the checked state of the checkbox
      checkboxElement.checked = !checkboxElement.checked;
   });

  const settings = storageService.getFirst(storageKey.USER_SETTINGS);
  const toggleDarkmode = document.querySelector('#toggleTheme');
  toggleDarkmode.checked = settings?.isDarkmode ? true : false ;
  user.themeInput(settings.isDarkmode);

  emitter.on("copyText", (data) => {
    copiedText.value = data.message;
    showToast();
  })
});
</script>

<template>
  <RouterView />
  
  <dialog class="modal" :class="{ 'modal-open': modal.messageModal.isOpen }" v-if="modal.messageModal.isOpen" v-focus @keydown.esc="closeMessageModal">
      <div class="modal-box">
         <h3 class="font-bold text-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6 inline"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span class="inline ms-2">訊息</span>
         </h3>
         <p class="py-4 text-center">{{ modal.messageModal.modalContent }}</p>
      </div>
      <div class="modal-backdrop" @click="modal.closeMessageModal">
        <button>close</button>
      </div>
  </dialog>

  <div class="z-20 m-2 fixed top-0 end-0">
    <label class="swap swap-rotate btn btn-circle">
         <input type="checkbox" id="toggleTheme" @change="handleToggleDarkmode"/>
         <svg class="swap-on fill-current w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/></svg>
         <svg class="swap-off fill-current w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/></svg>
      </label>
      <button title="menu" class="btn btn-circle swap swap-rotate" id="profile-btn" data-drawer-toggle="profile-sidebar">
         <input type="checkbox" id="profile-checkbox" checked/>
         <svg class="swap-off fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z"/></svg>
         <svg class="swap-on fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49"/></svg>
      </button>
      <!-- <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/patchnote">Patchnotes</RouterLink>
      </nav> -->
  </div>

  <transition name="fade">
    <Toast v-if="showToastVisible" ref="toast" :message="copiedText" class="toast toast-start z-50"/>
  </transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>