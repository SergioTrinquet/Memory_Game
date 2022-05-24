import { createRouter, createWebHistory } from 'vue-router'
import Intro from '@/views/Intro'

const Settings = () => import(/* webpackChunkName: "Settings" */ '@/views/Settings')
const Game = () => import(/* webpackChunkName: "Game" */ '@/views/Game')
const NotFound = () => import(/* webpackChunkName: "404" */ '@/views/404')

// Définition routes
const routes = [
    { 
        path: '/',
        name: 'introduction',
        component: Intro 
    },
    { 
        path: '/settings', 
        name: 'parametres', 
        component: Settings 
    },
    { 
        path: '/game', 
        name: 'jeu',
        component: Game
    },
    {
        path: '/404',
        name: 'notFound',
        component: NotFound
    },
    {
        path:'/:pathMatch(.*)*',
        redirect: { name: 'notFound' }
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})
  
export default router