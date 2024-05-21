import { defineStore } from 'pinia';

export const useModalStore = defineStore('modal', {
  state: () => ({
    searchUsernameModal: {
      isOpen: false
    },
    searchProjectModal: {
      isOpen: false
    },
    messageModal: {
      isOpen: false,
      modalContent: null
    }

  }),
  getters: {
    checkOpen() {
      return ( this.searchUsernameModal.isOpen || this.searchProjectModal.isOpen || this.messageModal.isOpen )
    }
  },
  actions: {
    openSearchUsernameModal() {this.searchUsernameModal.isOpen=true;},
    closeSearchUsernameModal() {
      const modalElement = document.querySelector('.modal-open');
      if (modalElement) {
        modalElement.classList.remove('modal-open');
      }
      this.searchUsernameModal.isOpen=false;
    },
    openSearchProjectModal() {this.searchProjectModal.isOpen=true;},
    closeSearchProjectModal() {
      const modalElement = document.querySelector('.modal-open');
      if (modalElement) {
        modalElement.classList.remove('modal-open');
      }
      this.searchProjectModal.isOpen=false;
    },

    openMessageModal(content) {
      this.messageModal.isOpen = true;
      this.messageModal.modalContent = content;
    },
    closeMessageModal() {
      this.messageModal.isOpen = false;
      this.messageModal.modalContent = null;
    }
  }
});