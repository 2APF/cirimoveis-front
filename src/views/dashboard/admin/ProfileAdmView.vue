<template>
  <div class="min-vh-100 bg-light-custom">

    <NavbarDashComponent title="Meu Perfil" />

    <main class="main-content p-4 mt-5">
   
      <section class="row g-4">
        <div class="col-lg-4 col-md-6">
          <div class="card shadow-sm h-100">
            <div class="card-body">
              <h3 class="card-title h6 mb-3 text-dark">Informações do Perfil</h3>
              <form @submit.prevent="saveProfile">
                <div class="mb-3">
                  <label for="name" class="form-label">Nome</label>
                  <input v-model="user.name" type="text" id="name" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label for="email" class="form-label">E-mail</label>
                  <input v-model="user.email" type="email" id="email" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label for="phone" class="form-label">Telefone</label>
                  <input v-model="user.phone" type="number" id="phone" class="form-control" required />
                </div> 
                <button type="submit" class="btn btn-primary w-100">Salvar Alterações</button>
              </form>
            </div>
          </div>
        </div>
        <div class="col-lg-8 col-md-6">
          <div class="card shadow-sm h-100">
            <div class="card-body">
              <h3 class="card-title h6 mb-3 text-dark">Estatísticas</h3>
              <div class="row g-3">
                <div class="col-6">
                  <p class="h5 text-danger mb-1">{{ user.score }}</p>
                  <small class="text-muted">Pontuação</small>
                </div>
                <div class="col-6">
                  <p class="h5 text-danger mb-1">{{ '99' }}</p>
                  <small class="text-muted">Casas Publicadas</small>
                </div>
                <div class="col-6">
                  <p class="h5 text-danger mb-1">{{ user.views }}</p>
                  <small class="text-muted">Visualizações</small>
                </div>
                <div class="col-6">
                  <p class="h5 text-danger mb-1">{{ user.favorites }}</p>
                  <small class="text-muted">Favoritos</small>
                </div>
              </div>
              <div class="chart-container mt-4">
                <canvas ref="activityChart"></canvas>
              </div>
            </div>
          </div>
        </div>
      </section>

 
      <!-- Notification -->
      <div v-if="notification.message" class="position-fixed top-0 end-0 m-3 alert alert-sm" :class="notification.type === 'success' ? 'alert-success' : 'alert-info'">
        <i :class="`fas fa-${notification.type === 'success' ? 'check-circle' : 'info-circle'} me-2`"></i>
        {{ notification.message }}
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Chart from 'chart.js/auto';
import NavbarDashComponent from '@/components/NavbarDashComponent.vue';

 
interface User {
  name: string;
  email: string;
  phone: string;
  bio: string;
  score: number;
  views: number;
  favorites: number;
}

interface Notification {
  message: string;
  type: 'success' | 'info';
}

const router = useRouter();
const notification = ref<Notification>({ message: '', type: 'info' });
const activityChart = ref<HTMLCanvasElement | null>(null);

const user = ref<User>({
  name: 'Usuário',
  email: 'user@cirimoveis.ao',
  phone: '+244 952 321 174',
  bio: 'Apaixonado por imóveis, ajudando a conectar pessoas com suas casas ideais.',
  score: 750,
  views: 1200,
  favorites: 150,
});

 

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(price);
};

const showNotification = (message: string, type: 'success' | 'info') => {
  notification.value = { message, type };
  setTimeout(() => {
    notification.value = { message: '', type: 'info' };
  }, 2000);
};

const saveProfile = () => {
  showNotification('Perfil atualizado com sucesso!', 'success');
}; 
 

onMounted(() => {
  if (activityChart.value) {
    new Chart(activityChart.value, {
      type: 'line',
      data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
        datasets: [{
          label: 'Atividade',
          data: [50, 80, 120, 200, 150, 250],
          borderColor: '#e63946',
          backgroundColor: 'rgba(230, 57, 70, 0.2)',
          fill: true,
          tension: 0.4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, max: 300 },
          x: { grid: { display: false } },
        },
      },
    });
  }
});
</script>

<style scoped>
:root {
  --primary-red: #e63946;
  --soft-red: rgba(230, 57, 70, 0.1);
  --secondary-red: #c92c39;
  --light-bg: #f1faee;
  --primary-dark: #2d3748;
}

.bg-light-custom {
  background-color: var(--light-bg);
}

body {
  font-family: 'Inter', sans-serif;
}

.main-content {
  margin-left: 250px;
}

@media (max-width: 991px) {
  .main-content {
    margin-left: 0;
  }
}

.card {
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 0.75rem;
  box-shadow: 0 4px 15px rgba(29, 53, 87, 0.15);
  backdrop-filter: blur(5px);
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-3px);
}

.chart-container {
  position: relative;
  width: 100%;
  height: 200px;
}

.form-control, .form-select {
  background: rgba(255, 255, 255, 0.9);
  border-color: var(--soft-red);
  border-radius: 0.375rem;
  font-size: 0.9rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-control:focus, .form-select:focus {
  border-color: var(--primary-red);
  box-shadow: 0 0 6px rgba(230, 57, 70, 0.3);
}

.form-label {
  color: var(--primary-red);
  font-size: 0.85rem;
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

.btn-outline-primary, .btn-outline-danger {
  color: var(--primary-red);
  border-color: var(--primary-red);
  font-size: 0.85rem;
  padding: 0.25rem 0.5rem;
}

.btn-outline-primary:hover, .btn-outline-danger:hover {
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

.text-primary {
  color: var(--primary-red);
}

.text-dark {
  color: var(--primary-dark);
}

.table {
  font-size: 0.9rem;
}

.table th {
  color: var(--primary-red);
  font-weight: 600;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 576px) {
  .card-title {
    font-size: 1rem;
  }

  .btn-sm, .form-control, .form-select, .form-label, .table {
    font-size: 0.85rem;
  }

  .btn-primary {
    padding: 0.4rem 1rem;
  }

  .display-6 {
    font-size: 2rem;
  }

  .chart-container {
    height: 150px;
  }
}
</style>