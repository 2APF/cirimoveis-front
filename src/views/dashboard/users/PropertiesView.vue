<template>
  <div class="min-vh-100 bg-light-custom">
    <main class="main-content p-4">
      <NavbarUserComponent title="Minhas Propriedades"  />
 

      <section class="row g-4  mt-3">
        <div class="col-lg-3 col-md-6">
          <div class="card shadow-sm h-100">
            <div class="card-body">
              <h3 class="card-title h6 mb-3 text-dark">Total de Propriedades</h3>
              <p class="display-7 text-danger mb-0">{{ filteredProperties.length }}</p>
              <small class="text-muted">Propriedades listadas</small>
            </div>
          </div>
        </div>
        
        <div class="col-lg-3 col-md-6">
          <div class="card shadow-sm h-100">
            <div class="card-body">
              <h3 class="card-title h6 mb-3 text-dark">Valor Total</h3>
              <p class="display-7 text-danger mb-0">{{ formatTotalValue(filteredProperties) }}</p>
              <small class="text-muted">Soma dos preços</small>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6">
          <div class="card shadow-sm h-100">
            <div class="card-body">
              <h3 class="card-title h6 mb-3 text-dark">Média de Visitas</h3>
              <p class="display-7 text-danger mb-0">{{ averageVisits }}</p>
              <small class="text-muted">Por propriedade</small>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6">
          <div class="card shadow-sm h-100">
            <div class="card-body">
              <h3 class="card-title h6 mb-3 text-dark">Propriedades Ativas</h3>
              <p class="display-7 text-danger mb-0">{{ activeProperties }}</p>
              <small class="text-muted">Em exibição</small>
            </div>
          </div>
        </div>
      </section>


      
      <div class="card shadow-sm mb-5">
        <div class="card-body">
          <h3 class="card-title h6 mb-3 text-dark">Distribuição por Status</h3>
          <div class="chart-container">
            <canvas ref="statusChart"></canvas>
          </div>
        </div>
      </div>

      <div class="card shadow-sm mb-4">
        <div class="card-body">
          <h3 class="card-title h6 mb-3 text-dark">Filtros</h3>
          <div class="row g-3">
            <div class="col-md-3 col-sm-6">
              <label class="form-label small fw-medium">Localização</label>
              <select v-model="filters.location" class="form-select">
                <option value="">Todas</option>
                <option v-for="loc in uniqueLocations" :key="loc" :value="loc">{{ loc }}</option>
              </select>
            </div>
            <div class="col-md-3 col-sm-6">
              <label class="form-label small fw-medium">Status</label>
              <select v-model="filters.status" class="form-select">
                <option value="">Todos</option>
                <option value="Ativa">Ativa</option>
                <option value="Inativa">Inativa</option>
                <option value="Pendente">Pendente</option>
              </select>
            </div>
            <div class="col-md-2 col-sm-6">
              <label class="form-label small fw-medium">Preço Mín.</label>
              <input v-model.number="filters.priceMin" type="number" class="form-control" placeholder="0" />
            </div>
            <div class="col-md-2 col-sm-6">
              <label class="form-label small fw-medium">Preço Máx.</label>
              <input v-model.number="filters.priceMax" type="number" class="form-control" placeholder="∞" />
            </div>
            <div class="col-md-2 col-sm-6">
              <label class="form-label small fw-medium">Quartos</label>
              <select v-model="filters.bedrooms" class="form-select">
                <option value="">Qualquer</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
            <div class="col-12 mt-3">
              <button class="btn btn-outline-primary btn-sm" @click="resetFilters">Limpar Filtros</button>
            </div>
          </div>
        </div>
      </div>

      <div class="card shadow-sm">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h3 class="card-title h6 mb-0 text-dark">Lista de Propriedades</h3>
            <div class="d-flex align-items-center gap-2">
              <span class="text-muted small me-3">Mostrando {{ paginatedProperties.length }} de {{ filteredProperties.length }} propriedades</span>
              <select v-model="viewMode" class="form-select form-select-sm" style="width: 120px;">
                <option value="table">Tabela</option>
                <option value="cards">Cartões</option>
              </select>
            </div>
          </div>

          <div v-if="viewMode === 'table'" class="table-responsive">
            <table class="table table-hover table-sm align-middle">
              <thead>
                <tr class="text-dark">
                  <th scope="col">Imagem</th>
                  <th scope="col">Título</th>
                  <th scope="col">Localização</th>
                  <th scope="col">Preço</th>
                  <th scope="col">Quartos</th>
                  <th scope="col">Status</th>
                  <th scope="col">Visitas</th>
                  <th scope="col">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="property in paginatedProperties" :key="property.id">
                  <td><img :src="property.image" class="rounded" style="width: 50px; height: 50px; object-fit: cover;" alt="Propriedade" /></td>
                  <td>{{ property.title }}</td>
                  <td>{{ property.location }}</td>
                  <td>{{ formatPrice(property.price) }}</td>
                  <td>{{ property.bedrooms }}</td>
                  <td>
                    <span class="badge" :class="{
                      'bg-success': property.status === 'Ativa',
                      'bg-warning text-dark': property.status === 'Pendente',
                      'bg-secondary': property.status === 'Inativa'
                    }">{{ property.status }}</span>
                  </td>
                  <td>{{ property.views }}</td>
                  <td>
                    <button class="btn btn-outline-primary btn-sm me-1" @click="editProperty(property.id)">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-outline-danger btn-sm" @click="deleteProperty(property.id)">
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
                <tr v-if="paginatedProperties.length === 0">
                  <td colspan="8" class="text-center text-muted py-4">Nenhuma propriedade encontrada</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="row g-4">
            <div v-for="property in paginatedProperties" :key="property.id" class="col-md-6 col-lg-4">
              <div class="card h-100 shadow-sm">
                <img :src="property.image" class="card-img-top" alt="Propriedade" style="height: 180px; object-fit: cover;" />
                <div class="card-body">
                  <h5 class="card-title h6 mb-2">{{ property.title }}</h5>
                  <p class="card-text small text-muted mb-1">{{ property.location }}</p>
                  <p class="card-text fw-bold mb-1">{{ formatPrice(property.price) }}</p>
                  <p class="card-text small mb-2">Quartos: {{ property.bedrooms }} | Visitas: {{ property.views }}</p>
                  <span class="badge mb-3" :class="{
                    'bg-success': property.status === 'Ativa',
                    'bg-warning text-dark': property.status === 'Pendente',
                    'bg-secondary': property.status === 'Inativa'
                  }">{{ property.status }}</span>
                  <div class="d-flex gap-2">
                    <button class="btn btn-outline-primary btn-sm" @click="editProperty(property.id)">
                      <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-outline-danger btn-sm" @click="deleteProperty(property.id)">
                      <i class="fas fa-trash"></i> Excluir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <nav v-if="filteredProperties.length > itemsPerPage" class="mt-4">
            <ul class="pagination justify-content-center">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button class="page-link" @click="currentPage = 1">Primeira</button>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button class="page-link" @click="currentPage--">&laquo;</button>
              </li>
              <li v-for="page in displayedPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
                <button class="page-link" @click="currentPage = page">{{ page }}</button>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <button class="page-link" @click="currentPage++">&raquo;</button>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <button class="page-link" @click="currentPage = totalPages">Última</button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

    </main>

    <div v-if="notification.message" class="position-fixed top-0 end-0 m-3 alert alert-sm" :class="notification.type === 'success' ? 'alert-success' : 'alert-danger'">
      <i :class="`fas fa-${notification.type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2`"></i>
      {{ notification.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Chart from 'chart.js/auto';
import NavbarUserComponent from '@/components/NavbarUserComponent.vue';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  status: 'Ativa' | 'Inativa' | 'Pendente';
  views: number;
  image: string;
}

interface Filters {
  location: string;
  status: string;
  priceMin: number | null;
  priceMax: number | null;
  bedrooms: string;
}

interface Notification {
  message: string;
  type: 'success' | 'danger';
}

const notification = ref<Notification>({ message: '', type: 'success' });
const statusChart = ref<HTMLCanvasElement | null>(null);
const viewMode = ref<'table' | 'cards'>('table');
const currentPage = ref(1);
const itemsPerPage = 12;

const properties = ref<Property[]>([
  { id: '1', title: 'Moradia T3 Moderna', location: 'Luanda, Talatona', price: 45000000, bedrooms: 3, status: 'Ativa', views: 850, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c' },
  { id: '2', title: 'Casa T4 em Construção', location: 'Luanda, Ilha do Cabo', price: 32000000, bedrooms: 4, status: 'Pendente', views: 620, image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be' },
  { id: '3', title: 'Apartamento T2 Centro', location: 'Luanda, Ingombota', price: 28000000, bedrooms: 2, status: 'Ativa', views: 450, image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6' },
  { id: '4', title: 'Villa T5 Luxo', location: 'Benguela, Costa', price: 75000000, bedrooms: 5, status: 'Ativa', views: 1200, image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea' },
  { id: '5', title: 'Casa T1 Simples', location: 'Huambo, Centro', price: 15000000, bedrooms: 1, status: 'Inativa', views: 200, image: 'https://images.unsplash.com/photo-1600585153490-76fb20a0f2c4' },
  { id: '6', title: 'Apartamento T3 Novo', location: 'Luanda, Maianga', price: 38000000, bedrooms: 3, status: 'Ativa', views: 700, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c' },
]);

const filters = ref<Filters>({
  location: '',
  status: '',
  priceMin: null,
  priceMax: null,
  bedrooms: '',
});

const uniqueLocations = computed(() => [...new Set(properties.value.map(p => p.location))].sort());

const filteredProperties = computed(() => {
  return properties.value.filter(p => {
    const matchesLocation = !filters.value.location || p.location === filters.value.location;
    const matchesStatus = !filters.value.status || p.status === filters.value.status;
    const matchesPriceMin = !filters.value.priceMin || p.price >= filters.value.priceMin;
    const matchesPriceMax = !filters.value.priceMax || p.price <= filters.value.priceMax;
    const matchesBedrooms = !filters.value.bedrooms || p.bedrooms >= parseInt(filters.value.bedrooms);
    return matchesLocation && matchesStatus && matchesPriceMin && matchesPriceMax && matchesBedrooms;
  }).sort((a, b) => b.views - a.views);
});

const activeProperties = computed(() => filteredProperties.value.filter(p => p.status === 'Ativa').length);

const averageVisits = computed(() => {
  const total = filteredProperties.value.reduce((sum, p) => sum + p.views, 0);
  return filteredProperties.value.length ? Math.round(total / filteredProperties.value.length) : 0;
});

const totalPages = computed(() => Math.ceil(filteredProperties.value.length / itemsPerPage));

const displayedPages = computed(() => {
  const maxPages = 5;
  const pages = [];
  let startPage = Math.max(1, currentPage.value - Math.floor(maxPages / 2));
  let endPage = Math.min(totalPages.value, startPage + maxPages - 1);
  if (endPage - startPage + 1 < maxPages) {
    startPage = Math.max(1, endPage - maxPages + 1);
  }
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  return pages;
});

const paginatedProperties = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredProperties.value.slice(start, start + itemsPerPage);
});

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 }).format(price);
};

const formatTotalValue = (props: Property[]) => {
  const total = props.reduce((sum, p) => sum + p.price, 0);
  return formatPrice(total);
};

const resetFilters = () => {
  filters.value = { location: '', status: '', priceMin: null, priceMax: null, bedrooms: '' };
  currentPage.value = 1;
  showNotification('Filtros limpos!', 'success');
};

const navigateToCreate = () => {
  showNotification('Redirecionando para criar propriedade...', 'success');
};

const editProperty = (id: string) => {
  showNotification(`Editando propriedade ${id}...`, 'success');
};

const deleteProperty = (id: string) => {
  if (confirm('Tem certeza que deseja excluir esta propriedade?')) {
    properties.value = properties.value.filter(p => p.id !== id);
    showNotification('Propriedade excluída com sucesso!', 'success');
    if (paginatedProperties.value.length === 0 && currentPage.value > 1) {
      currentPage.value--;
    }
  }
};

const showNotification = (message: string, type: 'success' | 'danger') => {
  notification.value = { message, type };
  setTimeout(() => {
    notification.value = { message: '', type: 'success' };
  }, 3000);
};

onMounted(() => {
  if (statusChart.value) {
    const statusCounts = {
      Ativa: filteredProperties.value.filter(p => p.status === 'Ativa').length,
      Pendente: filteredProperties.value.filter(p => p.status === 'Pendente').length,
      Inativa: filteredProperties.value.filter(p => p.status === 'Inativa').length,
    };
    new Chart(statusChart.value, {
      type: 'doughnut',
      data: {
        labels: ['Ativas', 'Pendentes', 'Inativas'],
        datasets: [{
          data: [statusCounts.Ativa, statusCounts.Pendente, statusCounts.Inativa],
          backgroundColor: ['#28a745', '#ffc107', '#6c757d'],
          borderColor: ['#ffffff', '#ffffff', '#ffffff'],
          borderWidth: 2,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { font: { size: 12 } } },
          tooltip: { backgroundColor: '#ffffff', titleColor: '#1a1a1a', bodyColor: '#1a1a1a', borderColor: '#e63946', borderWidth: 1 },
        },
        cutout: '60%',
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

.card-title {
  font-weight: 600;
  color: var(--text-dark);
}

.chart-container {
  position: relative;
  width: 100%;
  height: 220px;
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
  color: var(--primary-red);
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

.btn-outline-danger {
  color: var(--primary-red);
  border-color: var(--primary-red);
  font-size: 0.85rem;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
}

.btn-outline-danger:hover {
  background-color: var(--primary-red);
  color: #ffffff;
}

.alert {
  z-index: 10000;
  font-size: 0.9rem;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.3s ease-in-out;
}

.table {
  font-size: 0.9rem;
  border-collapse: separate;
  border-spacing: 0 8px;
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

.table tr {
  background: #ffffff;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.table tbody tr:hover {
  background-color: #f8fafc;
}

.badge {
  font-size: 0.8rem;
  padding: 0.4rem 0.8rem;
  border-radius: 12px;
}

.pagination .page-link {
  color: var(--primary-red);
  border-radius: 6px;
  margin: 0 3px;
  padding: 0.5rem 1rem;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.pagination .page-link:hover {
  background-color: var(--soft-red);
  color: #ffffff;
}

.pagination .page-item.active .page-link {
  background-color: var(--primary-red);
  border-color: var(--primary-red);
  color: #ffffff;
}

.pagination .page-item.disabled .page-link {
  color: var(--text-muted);
  cursor: not-allowed;
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
    font-size: 1.75rem;
  }

  .chart-container {
    height: 180px;
  }

  .row.g-4 > .col-md-3,
  .row.g-4 > .col-md-2,
  .row.g-4 > .col-sm-6 {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .table-responsive {
    font-size: 0.85rem;
  }

  .table th, .table td {
    padding: 0.75rem;
  }
}
</style>