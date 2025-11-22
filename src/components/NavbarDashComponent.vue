<template>

  <nav class="sidebar bg-red text-white shadow-lg" :class="{ 'sidebar-open': isSidebarOpen }">
    <div class="p-4 d-flex justify-content-between align-items-center">
      <!-- <h1 class="h5 mb-0 text-white">Cirimoveis Admin</h1> -->

        <RouterLink class="navbar-brand text-center" to="/">
        <img src="/logo-white.png" alt="Cirimóveis Logo" style="height: 40px; width: 120px;" />
      </RouterLink>


      <button class="btn btn-sm btn-outline-light d-lg-none" @click="toggleSidebar">
        <i class="fas fa-times"></i>
      </button>
    </div>
       <ul class="nav flex-column gap-2 p-3">
        <li class="nav-item">
          <RouterLink :to="{ name: 'app.dash.homepage' }" :scroll-behavior="{ behavior: 'smooth' }" class="nav-link text-white" @click.prevent="setActiveSection('overview')">
            <i class="fas fa-chart-pie me-2"></i> Dashboard
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink :to="{ name: 'app.dash.property.create' }" :scroll-behavior="{ behavior: 'smooth' }" class="nav-link text-white" @click.prevent="navigateTo('publish')">
            <i class="fas fa-plus-circle me-2"></i> Publicar Casa
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink :to="{ name: 'app.dash.properties' }" :scroll-behavior="{ behavior: 'smooth' }" class="nav-link text-white" @click.prevent="navigateTo('properties')">
            <i class="fas fa-home me-2"></i> Propriedades
          </RouterLink>
        </li>

        
        <li class="nav-item">
          <RouterLink :to="{ name: 'app.dash.users' }" :scroll-behavior="{ behavior: 'smooth' }" class="nav-link text-white" @click.prevent="navigateTo('users')">
            <i class="fas fa-users me-2"></i> Usuários
          </RouterLink>
        </li>

        
        <li class="nav-item" v-if="userNow.type == '0'">
          <RouterLink :to="{ name: 'app.dash.administrators' }" :scroll-behavior="{ behavior: 'smooth' }" class="nav-link text-white" @click.prevent="navigateTo('administrators')">
            <i class="fas fa-user-shield me-2"></i> Administradores
          </RouterLink>
        </li>
        

        <li class="nav-item" v-if="userNow.type == '0'">
          <RouterLink :to="{ name: 'app.dash.reports' }" :scroll-behavior="{ behavior: 'smooth' }" class="nav-link text-white" @click.prevent="navigateTo('reports')">
            <i class="fas fa-home me-2"></i> Relatórios
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink :to="{ name: 'app.dash.my-profile' }" :scroll-behavior="{ behavior: 'smooth' }" class="nav-link text-white" @click.prevent="navigateTo('profile')">
            <i class="fas fa-user me-2"></i> Meu Perfil
          </RouterLink>
        </li>
      </ul>
  </nav>

  <header class="bg-red mb-7 shadow-lg p-4 d-flex justify-content-between align-items-center fixed-header ">
    <h2 class="h4 mb-0 text-white">{{ props.title }}</h2>
    <div class="d-flex align-items-center gap-3">
      <!-- <div class="d-flex align-items-center">
        <img   alt="User Avatar" class="user-avatar me-2">
        <div class="d-none d-md-block">
          <p class="mb-0 fw-bold">kkk</p>
          <small class="text-muted">kkk</small>
        </div>
       </div> -->
      <button class="btn btn-outline-light btn-sm" @click="logout">
        <i class="fas fa-sign-out-alt me-1"></i> Sair
      </button>
      <button class="btn btn-primary btn-sm d-lg-none" @click="toggleSidebar">
        <i class="fas fa-bars"></i>
      </button>
    </div>
  </header>

</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import Cookies from 'js-cookie'

import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();



const props = defineProps<{
  title: string
}>();

interface User {
  name: string;
  email: string;
  phone: string;
}

interface Notification {
  message: string;
  type: 'success' | 'info';
}

const isSidebarOpen = ref(false);
const activeSection = ref('overview');
const activeSectionTitle = ref('Dashboard');
const notification = ref<Notification>({ message: '', type: 'info' });
const viewsChart = ref<HTMLCanvasElement | null>(null);
const topPropertiesChart = ref<HTMLCanvasElement | null>(null);

// const user = ref<User>({
//   name: 'Admin User',
//   email: 'admin@cirimoveis.ao',
//   phone: '+244 952 321 174',
// });


 

interface User {
  id?: string;
  name: string;
  email: string;
  phone: string;
  status?: string;
  type?: string;
  createdAt?: string;
  photo?: string;
}


let userNow: User;
if (typeof route.params.user === 'string') {
  userNow = { id: route.params.user, name: '', phone: '', email: '', status: '', type: '', createdAt: '', photo: '' };
} else if (Array.isArray(route.params.user)) {
  userNow = { id: route.params.user[0], name: '', phone: '', email: '', status: '', type: '', createdAt: '', photo: '' };
} else {
  userNow = route.params.user || { id: '', name: '', phone: '', email: '', status: '', type: '', createdAt: '', photo: '' };
}


console.log('User Now:', userNow);



const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const setActiveSection = (section: string) => {
  activeSection.value = section;
  activeSectionTitle.value = 'Dashboard';
  isSidebarOpen.value = false;
};

const navigateTo = (section: string) => {
  showNotification(`Navegando para ${section}...`, 'info');
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(price);
};

const logout = async () => {
  showNotification('Saindo...', 'info');
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    Cookies.remove('auth');
    Cookies.remove('token');
    Cookies.remove('user');

    await router.push({ name: 'app.home' })
   } catch (error: any) {
    showNotification(error.message || `Erro ao carregar propriedades`, 'info')
  }
};

const showNotification = (message: string, type: 'success' | 'info') => {
  notification.value = { message, type };
  setTimeout(() => {
    notification.value = { message: '', type: 'info' };
  }, 2000);
};

// onMounted(() => {

// });
</script>

<style scoped>
:root {
  --primary-red: #e63946;
  --soft-red: rgba(230, 57, 70, 0.1);
  --secondary-red: #5c040c;
  --light-bg: #f1faee;
}



.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100%;
  background-color: var(--primary-red);
  transition: transform 0.3s ease;
  z-index: 1000;
}

.sidebar-open {
  transform: translateX(0);
}

@media (max-width: 991px) {
  .sidebar {
    transform: translateX(-250px);
  }

  .sidebar-open {
    transform: translateX(0);
  }
}


.nav-link {
  border-radius: 0.5rem;
  padding: 0.75rem 1.25rem;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.nav-link:hover,
.nav-link.active {
  background-color: var(--secondary-red);
  transform: translateX(5px);
}


.btn-primary {
  background-color: var(--primary-red);
  border-color: var(--primary-red);
  font-size: 0.9rem;
  padding: 0.5rem 1.25rem;
  border-radius: 0.375rem;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn-primary:hover {
  background-color: var(--secondary-red);
  border-color: var(--secondary-red);
  transform: translateY(-2px);
}

.btn-outline-primary {
  color: var(--primary-red);
  border-color: var(--primary-red);
  font-size: 0.85rem;
  padding: 0.25rem 0.5rem;
}

.btn-outline-primary:hover {
  background-color: var(--primary-red);
  color: white;
}

.btn-outline-danger {
  color: var(--primary-red);
  border-color: var(--primary-red);
  font-size: 0.85rem;
  padding: 0.25rem 0.5rem;
}

.btn-outline-danger:hover {
  background-color: var(--primary-red);
  color: white;
}

.alert {
  z-index: 9999;
  font-size: 0.9rem;
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 10px rgba(29, 53, 87, 0.2);
  animation: fadeIn 0.3s ease-in-out;
}




.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  left: 250px;
  z-index: 999; 
  background-color: var(--primary-red);
}

.user-avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--primary-red);
}





@media (max-width: 991px) {
  .fixed-header {

    left: 0;

  }
}




@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 576px) {
  .card-title {
    font-size: 1rem;
  }

  .btn-sm,
  .form-control,
  .form-select,
  .form-label,
  .table {
    font-size: 0.85rem;
  }

  .btn-primary {
    padding: 0.4rem 1rem;
  }

  .display-6 {
    font-size: 2rem;
  }

}
</style>

