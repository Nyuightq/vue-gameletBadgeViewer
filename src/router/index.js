import { createMemoryHistory, createRouter } from 'vue-router'
import BadgeViewer from "@/pages/BadgeViewer.vue"
import PatchnoteReader from "@/pages/PatchnoteReader.vue"

const routes =[
    {
        path: '/',
        name: 'Home',
        component: BadgeViewer
    },
    {
        path: '/patchnote',
        name: 'PatchnoteReader',
        component: PatchnoteReader
    }
]

const router = createRouter({
    history: createMemoryHistory(),
    routes
})
export default router