<template>
  <nav class="navbar navbar-expand-lg" role="navigation" aria-label="Menu principal">
    <div class="container">
      <RouterLink class="navbar-brand" to="/" aria-label="Página inicial">
        <img :src="logoSrc" :alt="logoAlt" :style="logoStyle" />
      </RouterLink>

      <button
        class="navbar-toggler border-0"
        type="button"
        @click="toggleNavbar"
        :aria-expanded="navbarOpen"
        aria-label="Alternar navegação"
      >
        <span class="navbar-toggler-icon" :aria-hidden="true"></span>
      </button>

      <div 
        class="collapse navbar-collapse" 
        :class="{ show: navbarOpen }" 
        id="navbarNav"
        role="menubar"
      >
        <ul class="navbar-nav mx-auto" role="menubar">
          <li class="nav-item" role="none">
            <RouterLink 
              class="nav-link" 
              :to="{ name: 'app.home' }" 
              :aria-current="isActive('app.home') ? 'page' : undefined"
              @click="closeNavbar"
            >
              <i class="fas fa-home " style="margin-right: 8px;" aria-hidden="true"></i> 
              Home
            </RouterLink>
          </li>
          <li class="nav-item" role="none">
            <RouterLink 
              class="nav-link" 
              :to="{ name: 'app.properties' }" 
              @click="closeNavbar"
            >
              <i class="fas fa-building" style="margin-right: 8px;" aria-hidden="true"></i> 
              Casas
            </RouterLink>
          </li>
          <li class="nav-item" role="none">
            <a 
              class="nav-link" 
              href="#agentes" 
              @click.prevent="scrollToSection('#agentes')"
              :aria-label="`Ir para seção Agentes`"
            >
              <i class="fas fa-users" style="margin-right: 8px;" aria-hidden="true"></i> 
              Agentes
            </a>
          </li>
          <li class="nav-item" role="none">
            <RouterLink 
              class="nav-link" 
              :to="{ name: 'app.we' }" 
              @click="closeNavbar"
            >
              <i class="fas fa-info-circle" style="margin-right: 8px;" aria-hidden="true"></i> 
              Sobre
            </RouterLink>
          </li>
        </ul>

        <div class="d-flex">
          <button
            class="btn btn-announce"
            @click="announceProperty"
            :disabled="isAnnouncing"
            :aria-busy="isAnnouncing"
            :aria-label="isAnnouncing ? 'Carregando...' : 'Anunciar nova casa'"
          >
            <i class="fas fa-plus me-2" :aria-hidden="true"></i>
            {{ isAnnouncing ? 'Carregando...' : 'Anunciar Casa' }}
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onUnmounted, computed } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import router from '@/router'

const LOGO_CONFIG = {
  src: '/logo-danger.png',
  alt: 'Cirimóveis Logo',
  height: '40px',
  width: '120px'
}

const navbarOpen = ref(false)
const isAnnouncing = ref(false)
const routerInstance = useRouter()
const route = useRoute()

const logoSrc = computed(() => LOGO_CONFIG.src)
const logoAlt = computed(() => LOGO_CONFIG.alt)
const logoStyle = computed(() => ({
  height: LOGO_CONFIG.height,
  width: LOGO_CONFIG.width
}))

const isActive = (name: string) => computed(() => route.name === name)

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
    await new Promise(resolve => setTimeout(resolve, 1000))
    await routerInstance.push({ name: 'app.auth.login' })
  } finally {
    isAnnouncing.value = false
    closeNavbar()
  }
}

onUnmounted(() => {
  document.body.style.overflow = 'auto'
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

.btn-announce:hover {
  background: linear-gradient(135deg, #b71c1c, #d32f2f);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(211, 47, 47, 0.3);
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
}

@media (max-width: 576px) {
  .navbar-brand {
    font-size: 1.5rem;
  }

  .nav-link {
    font-size: 0.9rem;
  }

  .btn-announce {
    padding: 8px 15px;
    font-size: 0.9rem;
    width: 100%;
  }
}
</style>