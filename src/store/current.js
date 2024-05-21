import {reactive} from 'vue'

const currentModal = reactive({
    searchUsernameModel: {
        isOpen: false
    },
    searchProjectModal: {
        isOpen: false
    },
    messageModal: {
        isOpen: false,
        modalContent: null
    },
    checkOpen() {
        return this.searchUsernameModal.isOpen || this.searchProjectModal.isOpen || this.messageModal.isOpen;
    },
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

})

const currentProject = reactive({
    projectDetail: null
})

const currenScore = reactive({
    username: null,
    projectID: null,
    key: null,
    name: null,
    unit: null,
    profileDuration: 'History',
    scoreDuration: 'History',
    scoreModesList: [],
    leaderboardList: [],
    profileScoreList: [],
    profileScoreListLoadState: false
})

const currentUser = reactive({
    usernameTemp: '',
    userDetail: null,
    teamDetail: null,
    lastPlayDetail: null,
})

export { currentModal, currenScore, currentProject, currentUser }