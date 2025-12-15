import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/others/HomeView.vue'
import termsView from '@/views/others/termsView.vue'
import Cookies from 'js-cookie'
import NotFoundView from '@/views/others/NotFoundView.vue'
import AboutView from '@/views/others/AboutView.vue'
import LoginView from '@/views/dashboard/LoginView.vue'
import PropertiesView from '@/views/others/PropertiesView.vue'
import PropertyDetailView from '@/views/others/PropertyDetailView.vue'
import DashboardView from '@/views/dashboard/admin/DashboardView.vue'
import PropertiesDashboardView from '@/views/dashboard/admin/PropertiesView.vue'
import CreatePropertyView from '@/views/dashboard/admin/CreatePropertyView.vue'
import ReportsView from '@/views/dashboard/admin/ReportsView.vue'
import UsersPropertiesView from '@/views/dashboard/admin/UsersPropertiesView.vue'
import HomepageView from '@/views/dashboard/users/HomepageView.vue'
import ProfileUserView from '@/views/dashboard/users/ProfileUserView.vue'
import PropertiesUserView from '@/views/dashboard/users/PropertiesView.vue'
import CreatePropertyUserView from '@/views/dashboard/users/CreatePropertyView.vue'
import ReportsUserView from '@/views/dashboard/users/ReportsView.vue'
import PerfilView from '@/views/dashboard/admin/PerfilView.vue'
import UsersView from '@/views/dashboard/admin/UsersView.vue'
import AdministratorsView from '@/views/dashboard/admin/AdministratorsView.vue'
import PropertiesFavorites from '@/views/dashboard/users/PropertiesFavorites.vue'
import AgentsView from '@/views/others/AgentsView.vue'
import ListAdsView from '@/views/dashboard/users/ListAdsView.vue'
import EditPropertyView from '@/views/dashboard/users/EditPropertyView.vue'
import EditAdmPropertyView from '@/views/dashboard/admin/EditPropertyView.vue'
import ArtistView from '@/views/others/ArtistView.vue'



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'app.home',
      component: HomeView,
      meta: {
        title: 'Cirimóveis - Encontre o imóvel dos seus sonhos',
        description:
          'A Cirimóveis é a sua plataforma confiável para encontrar imóveis em Angola. Explore nossas ofertas de apartamentos, casas e terrenos para compra ou aluguel.',
        keywords: 'imóveis, Angola, apartamentos, casas, terrenos, compra, aluguel',

        requiresAuth: true
      }
    },

    {
      path: '/agents',
      name: 'app.agents',
      component: AboutView,
      meta: {
        title: 'Seja um agente da Cirimóveis',
        description: 'Junte-se a nós e faça parte da nossa rede de agentes imobiliários',
        keywords: 'agentes, imóveis, Angola, apartamentos, casas, terrenos',
        requiresAuth: true
      }
    },


    {
      path: '/artist',
      name: 'app.artist',
      component: ArtistView,
      meta: {
        title: 'Seja um agente da Cirimóveis',
        description: 'Junte-se a nós e faça parte da nossa rede de agentes imobiliários',
        keywords: 'agentes, imóveis, Angola, apartamentos, casas, terrenos',
        requiresAuth: true
      }
    },


    {
      path: '/properties',
      name: 'app.properties',
      component: PropertiesView,
      meta: {
        title: 'Propriedades - Cirimóveis',
        description: 'Encontre as melhores propriedades disponíveis em Angola, incluindo apartamentos, casas e terrenos.',
        keywords: 'propriedades, imóveis, Angola, apartamentos, casas, terrenos',
        requiresAuth: true
      }
    },


    {
      path: '/property/:slug',
      name: 'app.property.detail',
      component: PropertyDetailView,
      meta: {
        title: 'Detalhes da Propriedade - Cirimóveis',
        description: 'Veja os detalhes completos da propriedade selecionada, incluindo fotos, descrição e informações de contato.',
        keywords: 'detalhes da propriedade, imóveis, Angola, apartamentos, casas, terrenos',
        requiresAuth: true
      }
    },



    {
      path: '/we',
      name: 'app.we',
      component: AboutView,
      meta: {
        title: 'Sobre a Cirimóveis',
        description: 'Saiba mais sobre a Cirimóveis, nossa missão, visão e valores no mercado imobiliário angolano.',
        keywords: 'sobre nós, Cirimóveis, imóveis, Angola',
        requiresAuth: true
      }
    },


    {
      path: '/access',
      name: 'app.auth.login',
      component: LoginView,
      meta: {
        title: 'Entrar - Cirimóveis',
        description:
          'Faça login na sua conta Cirimóveis para acessar suas informações e recursos.',
        keywords: 'login, autenticação, conta, acesso, Cirimóveis'
      }
    },










    ////// USERS ROUTES //////

    {
      path: '/user/profile',
      name: 'app.user.profile',
      component: ProfileUserView,
      meta: {
        title: 'Perfil - Cirimóveis',
        description: 'Visão geral do perfil do usuário na Cirimóveis',
        keywords: 'perfil, usuário, Cirimóveis',
        requiresAuthUser: true
      }
    },

    {
      path: '/user/favorites/properties',
      name: 'app.user.favorites.properties',
      component: PropertiesFavorites,
      meta: {
        title: 'Perfil - Cirimóveis',
        description: 'Visão geral do perfil do usuário na Cirimóveis',
        keywords: 'perfil, usuário, Cirimóveis',
        requiresAuthUser: true
      }
    },


    {
      path: '/my-properties',
      name: 'app.user.properties',
      component: ListAdsView,
      meta: {
        title: 'Minhas Propriedades',
        description: 'Visão geral do sistema administrativo da Cirimóveis',
        keywords: 'dashboard, administração, Cirimóveis',
        requiresAuthUser: true
      }
    },


    {
      path: '/property-create',
      name: 'app.user.property.create',
      component: CreatePropertyUserView,
      meta: {
        title: 'Criar Propriedade',
        description: 'Visão geral do sistema administrativo da Cirimóveis',
        keywords: 'dashboard, administração, Cirimóveis',
        requiresAuthUser: true
      }
    },



    {
      path: '/property/edit/:slug',
      name: 'app.user.property.edit',
      component: EditPropertyView,
      meta: {
        title: 'Dashboard - Cirimóveis',
        description: 'Visão geral do sistema administrativo da Cirimóveis',
        keywords: 'dashboard, administração, Cirimóveis',
        requiresAuthUser: true
      }
    },











    ////// ADMINISTRATOR ROUTES //////

    {
      path: '/dash/homepage',
      name: 'app.dash.homepage',
      component: DashboardView,
      meta: {
        title: 'Dashboard - Cirimóveis',
        description: 'Visão geral do sistema administrativo da Cirimóveis',
        keywords: 'dashboard, administração, Cirimóveis',
        requiresAuthDash: true
      }
    },

    {
      path: '/dash/properties',
      name: 'app.dash.properties',
      component: PropertiesDashboardView,
      meta: {
        title: 'Propriedades - Cirimóveis',
        description: 'Gerencie suas propriedades na plataforma Cirimóveis.',
        keywords: 'propriedades, gerenciamento, Cirimóveis',
        requiresAuthDash: true
      }
    },


    {
      path: '/dash/properties-users',
      name: 'app.dash.properties.users',
      component: UsersPropertiesView,
      meta: {
        title: 'Propriedades - Cirimóveis',
        description: 'Gerencie suas propriedades na plataforma Cirimóveis.',
        keywords: 'propriedades, gerenciamento, Cirimóveis',
        requiresAuthDash: true
      }
    },


    {
      path: '/dash/property/create',
      name: 'app.dash.property.create',
      component: CreatePropertyView,
      meta: {
        title: 'Criar Propriedade - Cirimóveis',
        description: 'Crie uma nova propriedade na plataforma Cirimóveis.',
        keywords: 'criar propriedade, gerenciamento, Cirimóveis',
        requiresAuthDash: true
      }
    },



    {
      path: '/dash/property/edit/:slug',
      name: 'app.dash.property.edit',
      component: EditAdmPropertyView,
      meta: {
        title: 'Editar Propriedade - Cirimóveis',
        description: 'Edite uma propriedade existente na plataforma Cirimóveis.',
        keywords: 'editar propriedade, gerenciamento, Cirimóveis',
        requiresAuthDash: true
      }
    },



    {
      path: '/dash/administrators',
      name: 'app.dash.administrators',
      component: AdministratorsView,
      meta: {
        title: 'Administradores - Cirimóveis',
        description: 'Visualize e gerencie administradores da plataforma Cirimóveis.',
        keywords: 'administradores, gerenciamento, Cirimóveis',
        requiresAuthDash: true
      }
    },

    {
      path: '/dash/users',
      name: 'app.dash.users',
      component: UsersView,
      meta: {
        title: 'Usuários - Cirimóveis',
        description: 'Visualize e gerencie usuários da plataforma Cirimóveis.',
        keywords: 'usuários, gerenciamento, Cirimóveis',
        requiresAuthDash: true
      }
    },



    {
      path: '/dash/reports',
      name: 'app.dash.reports',
      component: ReportsView,
      meta: {
        title: 'Relatórios - Cirimóveis',
        description: 'Visualize e gerencie relatórios da plataforma Cirimóveis.',
        keywords: 'relatórios, gerenciamento, Cirimóveis',
        requiresAuthDash: true
      }
    },



    {
      path: '/dash/my-profile',
      name: 'app.dash.my-profile',
      component: PerfilView,
      meta: {
        title: 'Meu Perfil - Cirimóveis',
        description: 'Gerencie seu perfil na plataforma Cirimóveis.',
        keywords: 'configurações, ajustes, Cirimóveis',
        requiresAuthDash: true
      }
    },


    {
      path: '/dash/settings',
      name: 'app.dash.settings',
      component: DashboardView,
      meta: {
        title: 'Configurações - Cirimóveis',
        description: 'Ajuste as configurações da plataforma Cirimóveis.',
        keywords: 'configurações, ajustes, Cirimóveis',
        requiresAuthDash: true
      }
    },




    // {
    //   path: '/terms',
    //   name: 'app.terms',
    //   component: termsView,
    //   meta: {
    //     title: 'Termos da NoHere',
    //     description: 'Veja os termos e condições da NoHere',
    //     keywords: 'doações, ajuda, contribuir, apoio',
    //   },
    // },
    // {
    //   path: '/group/acess',
    //   name: 'app.group.access',
    //   component: AccessGroupView,
    //   meta: { title: 'NoHere - Acessar Grupo', requiresAuth: true }
    // },

    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
      meta: {
        title: 'Página Não Encontrada - NoHere',
        description: 'A página que você tentou acessar não foi encontrada.'
      }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})





router.beforeEach(async (to, from, next) => {

  const user = Cookies.get('user') || null
  const token = Cookies.get('token') || null

  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1'

  if (to.matched.some((record) => record.meta.requiresAuth)) {

    const token = Cookies.get('token') || null
    try {

      const userData = JSON.parse(user || '');
      const response = await fetch(`${apiBase}/auth/request/user/${user}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          accept: 'application/json'
        }
      })
      if (response.ok) {
        const userData = await response.json()

        if (Array.isArray(to.params.user)) {
          to.params.user.push(userData)
        } else {
          to.params.user = userData
        }
        return next()
      } else {
        return next()

      }
    } catch (error) {
        return next()
    }
  }






  if (to.matched.some((record) => record.meta.requiresAuthUser)) {
    if (!user) {
      return next({ name: 'app.auth.login' })
    }

    const token = Cookies.get('token') || null
    try {
      const userData = JSON.parse(user);
      const response = await fetch(`${apiBase}/auth/request/user/${user}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          accept: 'application/json'
        }
      })
      if (response.ok) {
        const userData = await response.json()

        // console.log(userData);
        if (Array.isArray(to.params.user)) {
          to.params.user.push(userData)
        } else {
          to.params.user = userData
        }
        return next()
      } else {
        return next({ name: 'app.auth.login' })
      }
    } catch (error) {
      return next({ name: 'app.auth.login' })
    }
  }








  if (to.matched.some((record) => record.meta.requiresAuthDash)) {
    if (!user) {
      return next({ name: 'app.auth.login' })
    }

    const token = Cookies.get('token') || null
    try {
      const userData = JSON.parse(user);
      const response = await fetch(`${apiBase}/auth/request/dash/${user}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          accept: 'application/json'
        }
      })
      if (response.ok) {
        const userData = await response.json()

        // console.log(userData);
        if (Array.isArray(to.params.user)) {
          to.params.user.push(userData)
        } else {
          to.params.user = userData
        }
        return next()
      } else {
        return next({ name: 'app.auth.login' })
      }
    } catch (error) {
      // console.error('Error fetching user data:', error);
      return next({ name: 'app.auth.login' })
    }
  }

  return next()
})

router.afterEach((to) => {
  const title: any = to.meta.title || 'Cirimóveis - Encontre o imóvel dos seus sonhos'
  document.title = title

  const description: any = to.meta.description || 'A Cirimóveis é a sua plataforma confiável para encontrar imóveis em Angola. Explore nossas ofertas de apartamentos, casas e terrenos para compra ou aluguel.'
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.setAttribute('content', description)
  } else {
    const newMetaDescription = document.createElement('meta')
    newMetaDescription.name = 'description'
    newMetaDescription.content = description
    document.head.appendChild(newMetaDescription)
  }

  const keywords: any = to.meta.keywords || 'imóveis, Angola, apartamentos, casas, terrenos, compra, aluguel'
  const metaKeywords = document.querySelector('meta[name="keywords"]')
  if (metaKeywords) {
    metaKeywords.setAttribute('content', keywords)
  } else {
    const newMetaKeywords = document.createElement('meta')
    newMetaKeywords.name = 'keywords'
    newMetaKeywords.content = keywords
    document.head.appendChild(newMetaKeywords)
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: window.location.href
  }
  const oldScript = document.querySelector('#structured-data')
  if (oldScript) {
    oldScript.remove()
  }
  const script = document.createElement('script')
  script.id = 'structured-data'
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(structuredData)
  document.head.appendChild(script)

  const canonicalLink = document.querySelector('link[rel="canonical"]')
  if (canonicalLink) {
    canonicalLink.setAttribute('href', window.location.href)
  } else {
    const newLink = document.createElement('link')
    newLink.rel = 'canonical'
    newLink.href = window.location.href
    document.head.appendChild(newLink)
  }
})

export default router
