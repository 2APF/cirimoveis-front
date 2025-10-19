<template>
  <div class="min-vh-100 bg-light-custom">
    <main class="main-content p-4">

      <NavbarUserComponent title="Relatórios" />

  
      <section class="row g-4 mt-3">
        <div class="col-lg-3 col-md-6">
          <div class="card shadow-sm h-100">
            <div class="card-body text-center">
              <i class="fas fa-chart-line display-4 text-primary mb-3"></i>
              <h3 class="card-title h5 mb-2">Relatórios Gerados</h3>
              <p class="display-6 mb-0">{{ reportsGenerated }}</p>
              <small class="text-muted">Neste mês</small>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6">
          <div class="card shadow-sm h-100">
            <div class="card-body text-center">
              <i class="fas fa-download display-4 text-success mb-3"></i>
              <h3 class="card-title h5 mb-2">Downloads Totais</h3>
              <p class="display-6 mb-0">{{ totalDownloads }}</p>
              <small class="text-muted">Total histórico</small>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6">
          <div class="card shadow-sm h-100">
            <div class="card-body text-center">
              <i class="fas fa-file-pdf display-4 text-danger mb-3"></i>
              <h3 class="card-title h5 mb-2">Relatórios PDF</h3>
              <p class="display-6 mb-0">{{ pdfReports }}</p>
              <small class="text-muted">Formato mais popular</small>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6">
          <div class="card shadow-sm h-100">
            <div class="card-body text-center">
              <i class="fas fa-file-excel display-4 text-success mb-3"></i>
              <h3 class="card-title h5 mb-2">Relatórios Excel</h3>
              <p class="display-6 mb-0">{{ excelReports }}</p>
              <small class="text-muted">Análises detalhadas</small>
            </div>
          </div>
        </div>
      </section>

      <div class="row g-4">
        <!-- Filtros -->
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-body">
              <h3 class="card-title h6 mb-3 text-dark">Filtros de Relatórios</h3>
              <div class="row g-3">
                <div class="col-md-3 col-sm-6">
                  <label class="form-label small fw-medium">Tipo de Relatório</label>
                  <select v-model="selectedReportType" class="form-select" @change="updateCharts">
                    <option value="overview">Visão Geral</option>
                    <option value="properties">Propriedades</option>
                    <option value="visits">Visitas</option>
                    <option value="conversions">Conversões</option>
                  </select>
                </div>
                <div class="col-md-2 col-sm-6">
                  <label class="form-label small fw-medium">Período</label>
                  <select v-model="selectedPeriod" class="form-select" @change="updateCharts">
                    <option value="today">Hoje</option>
                    <option value="week">Esta Semana</option>
                    <option value="month">Este Mês</option>
                    <option value="year">Este Ano</option>
                    <option value="all">Todo Período</option>
                  </select>
                </div>
                <div class="col-md-2 col-sm-6">
                  <label class="form-label small fw-medium">Data Início</label>
                  <input v-model="startDate" type="date" class="form-control" @change="updateCharts" />
                </div>
                <div class="col-md-2 col-sm-6">
                  <label class="form-label small fw-medium">Data Fim</label>
                  <input v-model="endDate" type="date" class="form-control" @change="updateCharts" />
                </div>
                <div class="col-md-3 d-flex align-items-end">
                  <button class="btn btn-primary w-100" @click="generateCustomReport">
                    <i class="fas fa-chart-bar me-1"></i> Gerar Relatório
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Gráficos Principais -->
        <div class="col-lg-8">
          <div class="card shadow-sm h-100">
            <div class="card-body">
              <h3 class="card-title h6 mb-3 text-dark">{{ reportTypeTitle }}</h3>
              <div class="chart-container">
                <canvas ref="mainChart"></canvas>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="row g-3 h-100">
            <div class="col-12">
              <div class="card shadow-sm">
                <div class="card-body">
                  <h3 class="card-title h6 mb-3 text-dark">Distribuição por Tipo</h3>
                  <div class="chart-container">
                    <canvas ref="pieChart"></canvas>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12">
              <div class="card shadow-sm">
                <div class="card-body">
                  <h3 class="card-title h6 mb-3 text-dark">Top 5 Regiões</h3>
                  <div class="chart-container">
                    <canvas ref="barChart"></canvas>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabela de Dados -->
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h3 class="card-title h6 mb-0 text-dark">Dados Detalhados</h3>
                <button class="btn btn-outline-primary btn-sm" @click="toggleTable">
                  <i class="fas" :class="showTable ? 'fa-eye-slash' : 'fa-eye'"></i>
                  {{ showTable ? 'Ocultar' : 'Mostrar' }} Tabela
                </button>
              </div>
              <div v-if="showTable" class="table-responsive">
                <table class="table table-hover table-sm">
                  <thead>
                    <tr class="text-dark">
                      <th scope="col">Data</th>
                      <th scope="col">Propriedades</th>
                      <th scope="col">Visitas</th>
                      <th scope="col">Conversões</th>
                      <th scope="col">Receita</th>
                      <th scope="col">Taxa de Conversão</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(data, index) in tableData" :key="index">
                      <td>{{ data.date }}</td>
                      <td>{{ data.properties }}</td>
                      <td>{{ data.visits }}</td>
                      <td>{{ data.conversions }}</td>
                      <td>{{ formatPrice(data.revenue) }}</td>
                      <td>{{ data.conversionRate }}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Notificação -->
    <div v-if="notification.message" class="position-fixed top-0 end-0 m-3 alert alert-sm" :class="notification.type === 'success' ? 'alert-success' : 'alert-info'">
      <i :class="`fas fa-${notification.type === 'success' ? 'check-circle' : 'info-circle'} me-2`"></i>
      {{ notification.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import Chart from 'chart.js/auto';
import NavbarUserComponent from '@/components/NavbarUserComponent.vue';

interface ReportData {
  date: string;
  properties: number;
  visits: number;
  conversions: number;
  revenue: number;
  conversionRate: number;
}

interface Notification {
  message: string;
  type: 'success' | 'info';
}

const notification = ref<Notification>({ message: '', type: 'info' });
const mainChart = ref<HTMLCanvasElement | null>(null);
const pieChart = ref<HTMLCanvasElement | null>(null);
const barChart = ref<HTMLCanvasElement | null>(null);
const showTable = ref(false);
const selectedReportType = ref('overview');
const selectedPeriod = ref('month');
const startDate = ref('');
const endDate = ref('');

const reportsGenerated = ref(42);
const totalDownloads = ref(156);
const pdfReports = ref(98);
const excelReports = ref(58);

const reportTypeTitle = computed(() => {
  const titles = {
    overview: 'Visão Geral do Desempenho',
    properties: 'Propriedades por Categoria',
    visits: 'Tráfego de Visitas',
    conversions: 'Conversões e Vendas',
  };
  return titles[selectedReportType.value as keyof typeof titles];
});

const tableData = ref<ReportData[]>([
  { date: '25/09', properties: 12, visits: 245, conversions: 8, revenue: 450000, conversionRate: 3.3 },
  { date: '24/09', properties: 15, visits: 289, conversions: 10, revenue: 520000, conversionRate: 3.5 },
  { date: '23/09', properties: 10, visits: 198, conversions: 6, revenue: 380000, conversionRate: 3.0 },
  { date: '22/09', properties: 18, visits: 356, conversions: 12, revenue: 620000, conversionRate: 3.4 },
  { date: '21/09', properties: 14, visits: 267, conversions: 9, revenue: 480000, conversionRate: 3.4 },
]);

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 }).format(price);
};

const updateCharts = () => {
  destroyCharts();
  initCharts();
};

const generateReport = (format: 'pdf' | 'excel') => {
  showNotification(`Relatório ${format.toUpperCase()} gerado com sucesso!`, 'success');
  reportsGenerated.value++;
  if (format === 'pdf') pdfReports.value++;
  else excelReports.value++;
};

const generateCustomReport = () => {
  showNotification('Relatório personalizado gerado!', 'success');
  reportsGenerated.value++;
};

const toggleTable = () => {
  showTable.value = !showTable.value;
};

const destroyCharts = () => {
  if (mainChart.value) {
    const ctx = mainChart.value.getContext('2d');
    if (ctx) {
      ctx.canvas.remove();
    }
  }
  if (pieChart.value) {
    const ctx = pieChart.value.getContext('2d');
    if (ctx) {
      ctx.canvas.remove();
    }
  }
  if (barChart.value) {
    const ctx = barChart.value.getContext('2d');
    if (ctx) {
      ctx.canvas.remove();
    }
  }
};

const initCharts = () => {
  if (mainChart.value) {
    const ctx = mainChart.value.getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['25/09', '24/09', '23/09', '22/09', '21/09'],
          datasets: [{
            label: 'Visitas',
            data: [245, 289, 198, 356, 267],
            borderColor: '#e63946',
            backgroundColor: 'rgba(230, 57, 70, 0.1)',
            fill: true,
            tension: 0.4,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true },
            x: { grid: { display: false } },
          },
        },
      });
    }
  }

  if (pieChart.value) {
    const ctx = pieChart.value.getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Propriedades', 'Visitas', 'Conversões'],
          datasets: [{
            data: [45, 320, 28],
            backgroundColor: ['#e63946', '#457b9d', '#06d6a0'],
            borderColor: '#ffffff',
            borderWidth: 2,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom' } },
          cutout: '60%',
        },
      });
    }
  }

  if (barChart.value) {
    const ctx = barChart.value.getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Talatona', 'Ilha', 'Ingombota', 'Benguela', 'Huambo'],
          datasets: [{
            label: 'Propriedades',
            data: [12, 8, 15, 10, 5],
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
            y: { beginAtZero: true },
          },
        },
      });
    }
  }
};

const showNotification = (message: string, type: 'success' | 'info') => {
  notification.value = { message, type };
  setTimeout(() => {
    notification.value = { message: '', type: 'info' };
  }, 3000);
};

onMounted(() => {
  initCharts();
});
</script>

<style scoped>
:root {
  --primary-red: #e63946;
  --soft-red: rgba(230, 57, 70, 0.1);
  --light-bg: #f8fafc;
  --text-dark: #1a1a1a;
  --text-muted: #6b7280;
}

.bg-light-custom {
  background-color: var(--light-bg);
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: var(--text-dark);
}

.main-content {
  margin-left: 250px;
  transition: margin-left 0.3s ease;
}

@media (max-width: 991px) {
  .main-content {
    margin-left: 0;
  }
}

.card {
  background: #ffffff;
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.chart-container {
  position: relative;
  width: 100%;
  height: 300px;
}

.form-control, .form-select {
  border: 1px solid var(--soft-red);
  border-radius: 8px;
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-control:focus, .form-select:focus {
  border-color: var(--primary-red);
  box-shadow: 0 0 0 3px var(--soft-red);
  outline: none;
}

.form-label {
  color: var(--text-dark);
  font-size: 0.85rem;
  font-weight: 500;
}

.btn-primary {
  background-color: var(--primary-red);
  border-color: var(--primary-red);
  font-size: 0.9rem;
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  transition: background-color 0.2s ease, transform 0.2s ease;
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
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
}

.btn-outline-primary:hover {
  background-color: var(--primary-red);
  color: #ffffff;
}

.btn-outline-success {
  color: #16a34a;
  border-color: #16a34a;
  font-size: 0.85rem;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
}

.btn-outline-success:hover {
  background-color: #16a34a;
  color: #ffffff;
}

.btn-outline-secondary {
  color: var(--text-muted);
  border-color: var(--text-muted);
  font-size: 0.85rem;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
}

.btn-outline-secondary:hover {
  background-color: var(--text-muted);
  color: #ffffff;
}

.table {
  font-size: 0.9rem;
}

.table th {
  color: var(--text-dark);
  font-weight: 600;
  padding: 1rem;
}

.table td {
  padding: 1rem;
  vertical-align: middle;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }

  .card {
    border-radius: 10px;
  }

  .form-label {
    font-size: 0.8rem;
  }

  .form-control, .form-select {
    font-size: 0.85rem;
    padding: 0.45rem 0.9rem;
  }

  .btn-primary, .btn-outline-primary, .btn-outline-success, .btn-outline-secondary {
    font-size: 0.85rem;
    padding: 0.45rem 1rem;
  }

  .btn-sm {
    font-size: 0.8rem;
  }

  .chart-container {
    height: 250px;
  }

  .table th, .table td {
    padding: 0.75rem;
  }
}

@media (max-width: 576px) {
  .card-title {
    font-size: 1rem;
  }

  .form-control, .form-select {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }

  .form-label {
    font-size: 0.75rem;
  }

  .btn-primary, .btn-outline-primary, .btn-outline-success, .btn-outline-secondary {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
    width: 100%;
  }

  .btn-sm {
    font-size: 0.75rem;
    padding: 0.2rem 0.5rem;
  }

  .row.g-4 > .col-12,
  .row.g-4 > .col-md-4,
  .row.g-4 > .col-md-6,
  .row.g-3 > .col-6,
  .row.g-3 > .col-md-3,
  .row.g-2 > .col-6,
  .row.g-2 > .col-md-3 {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .chart-container {
    height: 200px;
  }

  .table {
    font-size: 0.8rem;
  }

  .table th, .table td {
    padding: 0.5rem;
  }
}
</style>