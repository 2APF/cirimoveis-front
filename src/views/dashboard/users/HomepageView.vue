<template>
  <div class="min-vh-100 bg-light-custom">
    
    
    <main class="main-content p-4">
   
    <NavbarUserComponent title="Dashboard"/>


      
    
      <section class="row g-4 mt-2">
        <div class="col-lg-4 col-md-6">
          <div class="card shadow-sm h-100">
            <div class="card-body">
              <h3 class="card-title h6 mb-3 text-dark">Total de Casas</h3>
              <p class="display-6 text-danger mb-0">{{ properties.length }}</p>
              <small class="text-muted">Propriedades publicadas</small>
            </div>
          </div>
        </div>
        <div class="col-lg-4 col-md-6">
          <div class="card shadow-sm h-100">
            <div class="card-body">
              <h3 class="card-title h6 mb-3 text-dark">Total de Visitas</h3>
              <p class="display-6 text-danger mb-0">2,500</p>
              <small class="text-muted">Visitas na plataforma</small>
            </div>
          </div>
        </div>
        <div class="col-lg-4 col-md-12">
          <div class="card shadow-sm h-100">
            <div class="card-body">
              <h3 class="card-title h6 mb-3 text-dark">Resumo</h3>
              <ul class="list-unstyled">
                <li class="mb-2"><i class="fas fa-eye text-danger me-2"></i> Visualizações Totais: 2,500</li>
                <li class="mb-2"><i class="fas fa-heart text-danger me-2"></i> Favoritos: 320</li>
                <li><i class="fas fa-phone text-danger me-2"></i> Contatos: 150</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="card shadow-sm h-100">
            <div class="card-body">
              <h3 class="card-title h6 mb-3 text-dark">Visualizações Mensais</h3>
              <div class="chart-container">
                <canvas ref="viewsChart"></canvas>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="card shadow-sm h-100">
            <div class="card-body">
              <h3 class="card-title h6 mb-3 text-dark">Casas Mais Vistas</h3>
              <div class="chart-container">
                <canvas ref="topPropertiesChart"></canvas>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-body">
              <h3 class="card-title h6 mb-3 text-dark">Propriedades Populares</h3>
              <div class="table-responsive">
                <table class="table table-hover table-sm">
                  <thead>
                    <tr class="text-dark">
                      <th scope="col">Título</th>
                      <th scope="col">Localização</th>
                      <th scope="col">Visualizações</th>
                      <th scope="col">Preço</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="property in topProperties" :key="property.id">
                      <td>{{ property.title }}</td>
                      <td>{{ property.location }}</td>
                      <td>{{ property.views }}</td>
                      <td>{{ formatPrice(property.price) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Notification -->
    <div v-if="notification.message" class="position-fixed top-0 end-0 m-3 alert alert-sm" :class="notification.type === 'success' ? 'alert-success' : 'alert-info'">
      <i :class="`fas fa-${notification.type === 'success' ? 'check-circle' : 'info-circle'} me-2`"></i>
      {{ notification.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';
import NavbarUserComponent from '@/components/NavbarUserComponent.vue';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  views: number;
}

interface User {
  name: string;
  email: string;
  phone: string;
}

interface Notification {
  message: string;
  type: 'success' | 'info';
}


const activeSection = ref('overview');
const activeSectionTitle = ref('Dashboard');
const notification = ref<Notification>({ message: '', type: 'info' });
const viewsChart = ref<HTMLCanvasElement | null>(null);
const topPropertiesChart = ref<HTMLCanvasElement | null>(null);

const user = ref<User>({
  name: 'Admin User',
  email: 'admin@cirimoveis.ao',
  phone: '+244 123 456 789',
});

const properties = ref<Property[]>([
  { id: '1', title: 'Moradia T3 Moderna', location: 'Luanda, Talatona', price: 45000000, views: 850 },
  { id: '2', title: 'Casa T4 em Construção', location: 'Luanda, Ilha do Cabo', price: 32000000, views: 620 },
  { id: '3', title: 'Apartamento T2 Centro', location: 'Luanda, Ingombota', price: 28000000, views: 450 },
]);

const topProperties = ref<Property[]>([
  { id: '1', title: 'Moradia T3 Moderna', location: 'Luanda, Talatona', price: 45000000, views: 850 },
  { id: '2', title: 'Casa T4 em Construção', location: 'Luanda, Ilha do Cabo', price: 32000000, views: 620 },
]);




const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(price);
};


const showNotification = (message: string, type: 'success' | 'info') => {
  notification.value = { message, type };
  setTimeout(() => {
    notification.value = { message: '', type: 'info' };
  }, 2000);
};

onMounted(() => {
  if (viewsChart.value) {
    new Chart(viewsChart.value, {
      type: 'line',
      data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
        datasets: [{
          label: 'Visualizações',
          data: [120, 190, 300, 500, 400, 600],
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
          y: { beginAtZero: true, max: 700 },
          x: { grid: { display: false } },
        },
      },
    });
  }

  if (topPropertiesChart.value) {
    new Chart(topPropertiesChart.value, {
      type: 'bar',
      data: {
        labels: topProperties.value.map(p => p.title),
        datasets: [{
          label: 'Visualizações',
          data: topProperties.value.map(p => p.views),
          backgroundColor: '#e63946',
          borderColor: '#e63946',
          borderWidth: 1,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, max: 1000 },
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

.table {
  font-size: 0.9rem;
}

.table th {
  color: var(--primary-red);
  font-weight: 600;
}

.list-unstyled li {
  color: var(--primary-red);
  font-size: 0.9rem;
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