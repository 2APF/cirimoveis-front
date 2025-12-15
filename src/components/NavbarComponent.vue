<template>
  <nav class="navbar navbar-expand-lg" role="navigation" aria-label="Menu principal">
    <div class="container">
      <RouterLink class="navbar-brand" to="/" aria-label="Página inicial">
        <img :src="logoSrc" :alt="logoAlt" :style="logoStyle" />
      </RouterLink>

      <button class="navbar-toggler border-0" type="button" @click="toggleNavbar" :aria-expanded="navbarOpen"
        aria-label="Alternar navegação">
        <span class="navbar-toggler-icon" :aria-hidden="true"></span>
      </button>

      <div class="collapse navbar-collapse" :class="{ show: navbarOpen }" id="navbarNav" role="menubar">

        <ul class="navbar-nav mx-auto" role="menubar">
          <li class="nav-item" role="none">
            <RouterLink class="nav-link" :to="{ name: 'app.home' }" :class="{ active: activeItem === 'home' }"
              :aria-current="isActive('app.home') ? 'page' : undefined" @click="closeNavbar">
              <i class="fas fa-home " style="margin-right: 8px;" aria-hidden="true"></i>
              Home
            </RouterLink>
          </li>
          <li class="nav-item" role="none">
            <RouterLink class="nav-link" :to="{ name: 'app.properties' }"
              :class="{ active: activeItem === 'properties' }" @click="closeNavbar">
              <i class="fas fa-building" style="margin-right: 8px;" aria-hidden="true"></i>
              Casas
            </RouterLink>
          </li>
          <li class="nav-item" role="none">
            <RouterLink class="nav-link" :to="{ name: 'app.we' }" :class="{ active: activeItem === 'we' }"
              @click="closeNavbar">
              <i class="fas fa-users" style="margin-right: 8px;" aria-hidden="true"></i>
              Sobre
            </RouterLink>
          </li>
          <li class="nav-item" role="none">
            <RouterLink class="nav-link" :to="{ name: 'app.user.property.create' }" :class="{ active: activeItem === 'property-create' }"
              @click="closeNavbar">
              <i class="fas fa-upload" style="margin-right: 8px;" aria-hidden="true"></i>
              Postar Casa
            </RouterLink>
          </li>
        </ul>

        <div class="navbar-user-section d-flex align-items-center">

          <div class="user-menu me-3" v-if="userNow.id">
            <button class="btn btn-user-menu d-flex align-items-center" @click="toggleUserMenu"
              :aria-expanded="userMenuOpen" aria-label="Menu do usuário">
              <img :src="userAvatar" :alt="`Avatar de ${userName}`" class="user-avatar" />
              <span class="user-name d-none d-md-inline ms-2">{{ userName }}</span>
              <i class="fas fa-chevron-down ms-1" :class="{ 'rotate-180': userMenuOpen }"></i>
            </button>

            <div class="user-dropdown" :class="{ show: userMenuOpen }">
              <ul class="user-menu-list">
                <li>
                  <RouterLink class="dropdown-item" :to="{ name: 'app.user.favorites.properties' }"
                    @click="closeUserMenu">
                    <i class="fas fa-heart me-2"></i>
                    Lista de Adoradas
                  </RouterLink>
                </li>
                <li>
                  <RouterLink class="dropdown-item" :to="{ name: 'app.user.profile' }" @click="closeUserMenu">
                    <i class="fas fa-user me-2"></i>
                    Meu Perfil
                  </RouterLink>
                </li>
                <li>
                  <RouterLink class="dropdown-item" :to="{ name: 'app.user.properties' }" @click="closeUserMenu">
                    <i class="fas fa-home me-2"></i>
                    Meus Anúncios
                  </RouterLink>
                </li>

                <!--                   
                  <li>
                    <a
                      class="dropdown-item" 
                      @click="closeUserMenu">
                      <i class="fas fa-home me-2"></i>
                      Legalizar Casas
                    </a>
                  </li>
                -->

                <li>
                  <hr class="dropdown-divider">
                </li>
                <li>
                  <button class="dropdown-item text-danger" @click="logout">
                    <i class="fas fa-sign-out-alt me-2"></i>
                    Sair
                  </button>
                </li>
              </ul>
            </div>
          </div>




          <button class="btn btn-announce" @click="announceProperty" :disabled="isAnnouncing" :aria-busy="isAnnouncing"
            :aria-label="isAnnouncing ? 'Carregando...' : 'Anunciar nova casa'">
            <!-- <i class="fas fa-plus me-2" :aria-hidden="true"></i> -->
            <span>{{ isAnnouncing ? 'Carregando...' : 'Acessar' }}</span>
          </button>

        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onUnmounted, computed, onMounted } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import axios from 'axios';
import Cookies from 'js-cookie';

const props = defineProps<{
  active?: string
}>()

const route = useRoute();

const LOGO_CONFIG = {
  src: '/logo-danger.png',
  alt: 'Cirimóveis Logo',
  height: '30px',
  width: '90px'
}

const navbarOpen = ref(false)
const userMenuOpen = ref(false)
const isAnnouncing = ref(false)
const routerInstance = useRouter()

const logoSrc = computed(() => LOGO_CONFIG.src)
const logoAlt = computed(() => LOGO_CONFIG.alt)
const logoStyle = computed(() => ({
  height: LOGO_CONFIG.height,
  width: LOGO_CONFIG.width
}))

const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

interface User {
  id?: string;
  name: string;
  email: string;
  phone: string;
  about: string;
  avatar?: string;
  createdAt?: string;
  photo?: string;
}

let userNow: User;
if (typeof route.params.user === 'string') {
  userNow = { id: route.params.user, name: '', phone: '', email: '', about: '', createdAt: '', photo: '' };
} else if (Array.isArray(route.params.user)) {
  userNow = { id: route.params.user[0], name: '', phone: '', email: '', about: '', createdAt: '', photo: '' };
} else {
  userNow = route.params.user || { id: '', name: '', phone: '', email: '', about: '', createdAt: '', photo: '' };
}

const activeItem = computed(() => props.active)

const isActive = (name: string) => computed(() => route.name === name)

const userName = userNow.name
const userAvatar = computed(() =>
  'https://ui-avatars.com/api/?name=' + encodeURIComponent(userName) + '&background=dc3545&color=fff&size=32&rounded=true'
)

const isLoggedIn = computed(() => !userNow.id == false);

const toggleNavbar = () => {
  navbarOpen.value = !navbarOpen.value
  updateBodyOverflow()
}

const closeNavbar = () => {
  if (navbarOpen.value) {
    navbarOpen.value = false
    updateBodyOverflow()
  }
}

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value
}

const closeUserMenu = () => {
  userMenuOpen.value = false
}

const updateBodyOverflow = () => {
  document.body.style.overflow = navbarOpen.value ? 'hidden' : 'auto'
}

const scrollToSection = (selector: string) => {
  const target = document.querySelector(selector)
  if (target) {
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
    closeNavbar()
  }
}

const announceProperty = async () => {
  isAnnouncing.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    await routerInstance.push({ name: 'app.auth.login' })
  } finally {
    isAnnouncing.value = false
    closeNavbar()
  }
}

const goToLogin = () => {
  routerInstance.push({ name: 'app.auth.login' })
  closeNavbar()
}

const logout = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    Cookies.remove('token');
    Cookies.remove('auth');
    Cookies.remove('user');

    await routerInstance.push({ name: 'app.auth.login' })
  } finally {
    closeUserMenu()
    closeNavbar()
  }
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.user-menu')) {
    closeUserMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.body.style.overflow = 'auto'
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.navbar-toggler {
  border: none;
}

.navbar-toggler-icon {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='rgba%280,0,0,0.7%29' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E");
}

.navbar {
  background: var(--glass-bg);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  box-shadow: 0 2px 15px var(--shadow-light);
  padding: 12px 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  transition: all 0.3s var(--animation-ease);
}

.navbar-brand {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--primary-red) !important;
  transition: transform 0.3s var(--animation-ease), color 0.3s ease;
}

.navbar-brand:hover {
  transform: scale(1.03);
  color: #e53935 !important;
}

.navbar-nav {
  display: flex;
  align-items: center;
}

.nav-link {
  color: var(--dark-charcoal) !important;
  font-weight: 600;
  font-size: 1rem;
  margin: 0 18px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  position: relative;
  transition: all 0.3s var(--animation-ease);
  border-radius: 10px;
}

.nav-link i {
  margin-right: 8px;
  font-size: 1.1rem;
}

.nav-link:hover {
  color: var(--primary-red) !important;
  background: var(--soft-red);
}

.nav-link.active {
  color: var(--primary-red) !important;
  background: var(--soft-red);
  box-shadow: 0 2px 8px rgba(211, 47, 47, 0.15);
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 25px;
  height: 2px;
  background: var(--primary-red);
  border-radius: 1px;
}

.btn-announce {
  background: linear-gradient(135deg, var(--primary-red), #e53935);
  color: #fff !important;
  border: none;
  padding: 10px 22px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.95rem;
  transition: all 0.3s var(--animation-ease);
  box-shadow: 0 3px 12px rgba(211, 47, 47, 0.2);
}


.btn-announce:hover:not(:disabled) {
  background: linear-gradient(135deg, #b71c1c, #d32f2f);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(211, 47, 47, 0.3);
}

.btn-login {
  background: transparent;
  color: var(--primary-red) !important;
  border: 2px solid var(--primary-red);
  padding: 8px 20px;
  border-radius: 50px;
  font-weight: 600;
  transition: all 0.3s var(--animation-ease);
}

.btn-login:hover {
  background: var(--primary-red);
  color: #fff !important;
  transform: translateY(-1px);
}

.user-menu {
  position: relative;
}

.btn-user-menu {
  background: transparent;
  border: none;
  padding: 6px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.btn-user-menu:hover {
  background: var(--soft-red);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  font-weight: 600;
  color: var(--dark-charcoal);
  font-size: 0.95rem;
}

.rotate-180 {
  transform: rotate(180deg);
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  min-width: 200px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(0, 0, 0, 0.1);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s var(--animation-ease);
  z-index: 1050;
  margin-top: 8px;
}

.user-dropdown.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.user-menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  color: var(--dark-charcoal);
  text-decoration: none;
  transition: background 0.2s ease;
  border-radius: 8px;
  margin: 2px 0;
  font-weight: 500;
}

.dropdown-item:hover {
  background: var(--soft-red);
  color: var(--primary-red);
}

.dropdown-item i {
  width: 18px;
  text-align: center;
  font-size: 0.9rem;
}

.dropdown-divider {
  border: none;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  margin: 4px 0;
}

@media (min-width: 1400px) {
  .container {
    max-width: 1280px;
  }
}

@media (min-width: 992px) {
  .navbar-nav {
    justify-content: center;
  }

  .nav-link {
    margin: 0 20px;
  }
}

@media (max-width: 992px) {
  .navbar-nav {
    text-align: center;
  }

  .nav-link {
    margin: 8px 0;
    padding: 8px;
  }

  .navbar-user-section {
    flex-direction: column;
    gap: 10px;
    width: 100%;
  }

  .user-menu {
    order: 2;
    width: 100%;
  }

  .btn-user-menu {
    justify-content: center;
  }

  .user-dropdown {
    right: 50%;
    transform: translateX(50%) translateY(-10px);
  }

  .user-dropdown.show {
    transform: translateX(50%) translateY(0);
  }

  .btn-login,
  .btn-announce {
    order: 1;
    width: 100%;
  }

  .btn-user-menu {
    order: 1;
    width: 100%;
  }


}

@media (max-width: 576px) {
  .navbar-brand {
    font-size: 1.5rem;
  }

  .nav-link {
    font-size: 0.9rem;
  }

  .btn-announce,
  .btn-login {
    padding: 8px 15px;
    font-size: 0.9rem;
  }

  .user-name {
    width: 100%;
  }


}
</style>