<template>
  <div class="min-vh-100 bg-light-custom">
    <NavbarDashComponent title="Dashboard" class="mb-7" />

    <main class="main-content p-4 mt-5 py-7">
      <section class="row g-4">
        <!-- Total de Propriedades -->
        <div class="col-lg-3 col-md-6">
          <div class="card stat-card h-100">
            <div class="card-body d-flex align-items-center">
              <div class="stat-icon bg-danger text-white">
                <i class="fas fa-home"></i>
              </div>
              <div class="ms-3">
                <h3 class="h5 mb-1 text-dark">Total de Casas</h3>
                <p class="display-6 text-danger mb-0">{{ dashboard.total_properties }}</p>
                <small class="text-muted">Propriedades publicadas</small>
              </div>
            </div>
          </div>
        </div>

        <!-- Total de Usuários -->
        <div class="col-lg-3 col-md-6">
          <div class="card stat-card h-100">
            <div class="card-body d-flex align-items-center">
              <div class="stat-icon bg-success text-white">
                <i class="fas fa-users"></i>
              </div>
              <div class="ms-3">
                <h3 class="h5 mb-1 text-dark">Total de Usuários</h3>
                <p class="display-6 text-success mb-0">{{ dashboard.total_users }}</p>
                <small class="text-muted">Clientes cadastrados</small>
              </div>
            </div>
          </div>
        </div>

        <!-- Total de Visitas -->
        <div class="col-lg-3 col-md-6">
          <div class="card stat-card h-100">
            <div class="card-body d-flex align-items-center">
              <div class="stat-icon bg-primary text-white">
                <i class="fas fa-eye"></i>
              </div>
              <div class="ms-3">
                <h3 class="h5 mb-1 text-dark">Total de Visitas</h3>
                <p class="display-6 text-primary mb-0">{{ formatNumber(dashboard.total_views) }}</p>
                <small class="text-muted">Visitas na plataforma</small>
              </div>
            </div>
          </div>
        </div>

        <!-- Resumo -->
        <div class="col-lg-3 col-md-6">
          <div class="card stat-card h-100">
            <div class="card-body">
              <h3 class="h5 mb-3 text-dark">Resumo</h3>
              <ul class="list-unstyled mb-0">
                <li class="d-flex justify-content-between mb-2">
                  <span><i class="fas fa-heart text-danger me-2"></i>Favoritos</span>
                  <strong class="text-danger">{{ dashboard.total_favorited_properties }}</strong>
                </li>
                <li class="d-flex justify-content-between mb-2">
                  <span><i class="fas fa-eye text-primary me-2"></i>Visualizações</span>
                  <strong class="text-primary">{{ formatNumber(dashboard.total_views) }}</strong>
                </li>
                <li class="d-flex justify-content-between">
                  <span><i class="fas fa-home text-success me-2"></i>Propriedades</span>
                  <strong class="text-success">{{ dashboard.total_properties }}</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Gráfico de Visualizações Mensais -->
        <div class="col-lg-6">
          <div class="card chart-card h-100">
            <div class="card-body">
              <h3 class="h5 mb-3 text-dark">Visualizações Mensais</h3>
              <div class="chart-container">
                <canvas ref="viewsChart"></canvas>
              </div>
            </div>
          </div>
        </div>

        <!-- Gráfico de Casas Mais Vistas -->
        <div class="col-lg-6">
          <div class="card chart-card h-100">
            <div class="card-body">
              <h3 class="h5 mb-3 text-dark">Casas Mais Vistas</h3>
              <div class="chart-container">
                <canvas ref="topPropertiesChart"></canvas>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabela de Propriedades Populares -->
        <!-- <div class="col-12">
          <div class="card table-card">
            <div class="card-body">
              <h3 class="h5 mb-3 text-dark">Propriedades Mais Vistas</h3>
              <div class="table-responsive">
                <table class="table table-hover table-sm align-middle">
                  <thead class="table-light">
                    <tr>
                      <th class="text-danger fw-semibold">Título</th>
                      <th class="text-danger fw-semibold">Localização</th>
                      <th class="text-danger fw-semibold text-center">Visualizações</th>
                      <th class="text-danger fw-semibold text-end">Preço</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="property in dashboard.properties_views" :key="property.id">
                      <td class="fw-medium text-dark">{{ property.name }}</td>
                      <td class="text-muted">{{ property.address || 'N/A' }}</td>
                      <td class="text-center">
                        <span class="badge bg-primary">{{ property.views }}</span>
                      </td>
                      <td class="text-end text-success fw-semibold">
                        {{ formatPrice(property.price) }}
                      </td>
                    </tr>
                    <tr v-if="!dashboard.properties_views.length">
                      <td colspan="4" class="text-center text-muted py-4">
                        <i class="fas fa-home fa-2x mb-2 d-block"></i>
                        Nenhuma propriedade encontrada
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div> -->
      </section>
    </main>

    <!-- Loading -->
    <div v-if="loading" class="position-fixed top-50 start-50 translate-middle z-1050">
      <div class="spinner-border text-danger" style="width: 3rem; height: 3rem;" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
    </div>

    <!-- Notification -->
    <div v-if="notification.message" class="position-fixed top-0 end-0 m-3 alert alert-sm z-1050 shadow-lg"
      :class="notification.type === 'success' ? 'alert-success border-success' : 'alert-danger border-danger'">
      <i :class="`fas fa-${notification.type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2`"></i>
      {{ notification.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import Chart from 'chart.js/auto'
import NavbarDashComponent from '@/components/NavbarDashComponent.vue'
import Cookies from 'js-cookie'

interface DashboardData {
  total_properties: number
  total_users: number
  total_favorited_properties: number
  total_views: number
  properties_views: Array<{
    id: number
    name: string
    address: string | null
    views: number
    price: number
  }>
}

const dashboard = ref<DashboardData>({
  total_properties: 0,
  total_users: 0,
  total_favorited_properties: 0,
  total_views: 0,
  properties_views: []
})

const loading = ref(true)
const notification = ref({ message: '', type: 'success' as 'success' | 'danger' })
const viewsChart = ref<HTMLCanvasElement | null>(null)
const topPropertiesChart = ref<HTMLCanvasElement | null>(null)

const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cirimoveis.com/api/v1'

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('pt-AO').format(num)
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: 'AOA',
    minimumFractionDigits: 0
  }).format(price)
}

const showNotification = (msg: string, type: 'success' | 'danger' = 'success') => {
  notification.value = { message: msg, type }
  setTimeout(() => notification.value.message = '', 4000)
}

const fetchDashboard = async () => {
  loading.value = true
  try {
    const token = Cookies.get('token')
    const response = await fetch(`${API_URL}/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (!response.ok) throw new Error('Erro na requisição')

    const data = await response.json()
    dashboard.value = data

  } catch (error) {
    showNotification('Erro ao carregar dados do dashboard', 'danger')
  } finally {
    loading.value = false
  }
}

const initCharts = () => {
  if (viewsChart.value) {
    new Chart(viewsChart.value, {
      type: 'line',
      data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
        datasets: [{
          label: 'Visualizações',
          data: [1200, 1900, 3000, 2500, 2200, 3200],
          borderColor: '#e63946',
          backgroundColor: 'rgba(230, 57, 70, 0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#e63946',
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { backgroundColor: '#1a1a1a' }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { font: { size: 11 } }
          },
          x: {
            grid: { display: false },
            ticks: { font: { size: 11 } }
          }
        }
      }
    })
  }

  if (topPropertiesChart.value && dashboard.value.properties_views.length) {
    const top5 = dashboard.value.properties_views.slice(0, 5)
    new Chart(topPropertiesChart.value, {
      type: 'bar',
      data: {
        labels: top5.map(p => p.name.length > 20 ? p.name.substring(0, 20) + '...' : p.name),
        datasets: [{
          label: 'Visualizações',
          data: top5.map(p => p.views),
          backgroundColor: '#e63946',
          borderColor: '#c92c39',
          borderWidth: 1,
          borderRadius: 6,
          barThickness: 20
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { backgroundColor: '#1a1a1a' }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { font: { size: 11 } }
          },
          x: {
            grid: { display: false },
            ticks: { font: { size: 10 }, maxRotation: 45, minRotation: 45 }
          }
        }
      }
    })
  }
}

onMounted(() => {
  const token = Cookies.get('token')
  if (!token) {
    window.location.href = '/login'
    return
  }

  fetchDashboard().then(() => {
    nextTick(() => {
      setTimeout(initCharts, 100)
    })
  })
})
</script>

<style scoped>
:root {
  --primary-red: #e63946;
  --soft-red: rgba(230,57,70,0.1);
  --secondary-red: #c92c39;
  --light-bg: #f8fafc;
  --text-dark: #1a1a1a;
  --text-muted: #6b7280;
}

.bg-light-custom { background-color: var(--light-bg); }
.main-content { margin-left: 250px; transition: margin-left 0.3s ease; }

.stat-card {
  background: white;
  border: none;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}
.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.15);
}

.chart-card, .table-card {
  background: white;
  border: none;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.chart-container {
  position: relative;
  height: 260px;
  padding: 1rem 0;
}

.table th {
  border-top: none;
  font-weight: 600;
  color: var(--primary-red);
  font-size: 0.875rem;
}

.table td {
  vertical-align: middle;
  font-size: 0.875rem;
}

.badge {
  font-size: 0.75rem;
  padding: 0.35em 0.65em;
}

.alert {
  z-index: 1050;
  font-size: 0.9rem;
  padding: 1rem 1.5rem;
  border-radius: 10px;
  animation: slideInRight 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@media (max-width: 992px) {
  .main-content { margin-left: 0; padding: 1rem; }
  .stat-icon { width: 48px; height: 48px; font-size: 1.25rem; }
  .chart-container { height: 200px; }
}

@media (max-width: 576px) {
  .display-6 { font-size: 2rem; }
  .chart-container { height: 180px; }
  .table { font-size: 0.8rem; }
}

@keyframes slideInRight {
  from { opacity: 0; transform: translateX(100%); }
  to { opacity: 1; transform: translateX(0); }
}
</style>