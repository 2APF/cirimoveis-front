<template>
  <div class="min-vh-100 bg-light-custom">
    <main class="main-content p-3 p-md-4">
      <NavbarDashComponent title="dd" />

      <header class="bg-white rounded-lg shadow p-3 p-md-4 d-flex justify-content-between align-items-center flex-wrap">
        <h2 class="h4 mb-0 text-dark me-3">Propriedades</h2>
        <button class="btn btn-primary btn-sm mb-2 mb-md-0" @click="navigateToCreate">
          <i class="fas fa-plus me-1"></i> Nova Propriedade
        </button>
      </header>

      <section class="row g-3 g-md-4">
        <div class="col-lg-3 col-md-6 col-12">
          <div class="card shadow-sm h-100">
            <div class="card-body text-center">
              <i class="fas fa-home fa-2x text-primary mb-2"></i>
              <h3 class="card-title h6 mb-2 text-dark">Total de Propriedades</h3>
              <p class="display-6 text-primary mb-0">{{ filteredProperties.length }}</p>
              <small class="text-muted">Propriedades listadas</small>
            </div>
          </div>
        </div>

        <div class="col-lg-3 col-md-6 col-12">
          <div class="card shadow-sm h-100">
            <div class="card-body text-center">
              <i class="fas fa-coins fa-2x text-primary mb-2"></i>
              <h3 class="card-title h6 mb-2 text-dark">Valor Total</h3>
              <p class="display-6 text-primary mb-0">{{ formatTotalValue(filteredProperties) }}</p>
              <small class="text-muted">Soma dos preços</small>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 col-12">
          <div class="card shadow-sm h-100">
            <div class="card-body text-center">
              <i class="fas fa-eye fa-2x text-primary mb-2"></i>
              <h3 class="card-title h6 mb-2 text-dark">Média de Visitas</h3>
              <p class="display-6 text-primary mb-0">{{ averageVisits }}</p>
              <small class="text-muted">Por propriedade</small>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 col-12">
          <div class="card shadow-sm h-100">
            <div class="card-body text-center">
              <i class="fas fa-check-circle fa-2x text-primary mb-2"></i>
              <h3 class="card-title h6 mb-2 text-dark">Propriedades Ativas</h3>
              <p class="display-6 text-primary mb-0">{{ activeProperties }}</p>
              <small class="text-muted">Em exibição</small>
            </div>
          </div>
        </div>
      </section>



      
      <div class="row g-3 g-md-4 ">
        <div class="col-lg-6 col-12">
          <div class="card shadow-sm">
            <div class="card-body">
              <h3 class="card-title h6 mb-3 text-dark">Distribuição por Status</h3>
              <div class="chart-container">
                <canvas ref="statusChart"></canvas>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-6 col-12">
          <div class="card shadow-sm">
            <div class="card-body">
              <h3 class="card-title h6 mb-3 text-dark">Propriedades por Localização</h3>
              <div class="chart-container">
                <canvas ref="locationChart"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>



      <div class="card shadow-sm mb-4">
        <div class="card-body">
          <h3 class="card-title h6 mb-3 text-dark">Filtros</h3>
          <div class="row g-2 g-md-3">
            <div class="col-md-3 col-sm-6 col-12">
              <label class="form-label small fw-medium">Localização</label>
              <select v-model="filters.location" class="form-select">
                <option value="">Todas</option>
                <option v-for="loc in uniqueLocations" :key="loc" :value="loc">{{ loc }}</option>
              </select>
            </div>
            <div class="col-md-3 col-sm-6 col-12">
              <label class="form-label small fw-medium">Status</label>
              <select v-model="filters.status" class="form-select">
                <option value="">Todos</option>
                <option value="Ativa">Ativa</option>
                <option value="Inativa">Inativa</option>
                <option value="Pendente">Pendente</option>
              </select>
            </div>
            <div class="col-md-3 col-sm-6 col-12">
              <label class="form-label small fw-medium">Usuário</label>
              <select v-model="filters.userId" class="form-select">
                <option value="">Todos</option>
                <option v-for="user in uniqueUsers" :key="user.id" :value="user.id">{{ user.name }}</option>
              </select>
            </div>
            <div class="col-md-3 col-sm-6 col-12">
              <label class="form-label small fw-medium">Tipologia</label>
              <select v-model="filters.type" class="form-select">
                <option value="">Todas</option>
                <option value="T1">T1</option>
                <option value="T2">T2</option>
                <option value="T3">T3</option>
                <option value="T4">T4</option>
                <option value="T5">T5</option>
                <option value="Villa">Villa</option>
                <option value="Apartamento">Apartamento</option>
              </select>
            </div>
            <div class="col-md-2 col-sm-6 col-12">
              <label class="form-label small fw-medium">Preço Mín. (AOA)</label>
              <input v-model.number="filters.priceMin" type="number" class="form-control" placeholder="0" />
            </div>
            <div class="col-md-2 col-sm-6 col-12">
              <label class="form-label small fw-medium">Preço Máx. (AOA)</label>
              <input v-model.number="filters.priceMax" type="number" class="form-control" placeholder="∞" />
            </div>
            <div class="col-md-2 col-sm-6 col-12">
              <label class="form-label small fw-medium">Quartos</label>
              <select v-model="filters.bedrooms" class="form-select">
                <option value="">Qualquer</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
            <div class="col-md-2 col-sm-6 col-12">
              <label class="form-label small fw-medium">Data Início</label>
              <input v-model="filters.startDate" type="date" class="form-control" />
            </div>
            <div class="col-md-2 col-sm-6 col-12">
              <label class="form-label small fw-medium">Data Fim</label>
              <input v-model="filters.endDate" type="date" class="form-control" />
            </div>
            <div class="col-md-2 col-sm-6 col-12">
              <label class="form-label small fw-medium">Características</label>
              <select v-model="filters.feature" class="form-select">
                <option value="">Nenhuma</option>
                <option value="garage">Garagem</option>
                <option value="piscina">Piscina</option>
                <option value="jardim">Jardim</option>
                <option value="arcondicionado">Ar Condicionado</option>
              </select>
            </div>
            <div class="col-12 mt-2 mt-md-3">
              <button class="btn btn-outline-primary btn-sm" @click="resetFilters">Limpar Filtros</button>
            </div>
          </div>
        </div>
      </div>

      <div class="card shadow-sm">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap">
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
                  <th scope="col" class="col-2 col-md-1">Imagem</th>
                  <th scope="col" class="col-3 col-md-2">Título</th>
                  <th scope="col" class="col-3 col-md-2">Localização</th>
                  <th scope="col" class="col-2 col-md-1">Preço</th>
                  <th scope="col" class="col-1 col-md-1">Quartos</th>
                  <th scope="col" class="col-2 col-md-1">Status</th>
                  <th scope="col" class="col-1 col-md-1">Visitas</th>
                  <th scope="col" class="col-2 col-md-2 d-none d-md-table-cell">Usuário</th>
                  <th scope="col" class="col-1 col-md-1">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="property in paginatedProperties" :key="property.id">
                  <td><img :src="property.images[0] || defaultImage" class="rounded img-framed" alt="Propriedade" /></td>
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
                  <td class="d-none d-md-table-cell">{{ getUserName(property.userId) }}</td>
                  <td>
                    <div class="dropdown">
                      <button class="btn btn-outline-secondary btn-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fas fa-ellipsis-h"></i>
                      </button>
                      <ul class="dropdown-menu dropdown-menu-end">
                        <li><a class="dropdown-item" @click="viewProperty(property)"><i class="fas fa-eye me-2"></i> Visualizar</a></li>
                        <li><a class="dropdown-item" @click="acceptProperty(property.id)" :class="{ 'disabled': property.status === 'Ativa' }"><i class="fas fa-check me-2"></i> Aceitar</a></li>
                        <li><a class="dropdown-item" @click="rejectProperty(property.id)" :class="{ 'disabled': property.status === 'Inativa' }"><i class="fas fa-times me-2"></i> Rejeitar</a></li>
                        <li><a class="dropdown-item" @click="editProperty(property.id)"><i class="fas fa-edit me-2"></i> Editar</a></li>
                        <li><a class="dropdown-item text-danger" @click="deleteProperty(property.id)"><i class="fas fa-trash me-2"></i> Excluir</a></li>
                      </ul>
                    </div>
                  </td>
                </tr>
                <tr v-if="paginatedProperties.length === 0">
                  <td colspan="9" class="text-center text-muted py-4">Nenhuma propriedade encontrada</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="row g-3 g-md-4">
            <div v-for="property in paginatedProperties" :key="property.id" class="col-md-6 col-lg-4 col-12">
              <div class="card h-100 shadow-sm">
                <img :src="property.images[0] || defaultImage" class="card-img-top img-framed" alt="Propriedade" />
                <div class="card-body">
                  <h5 class="card-title h6 mb-2">{{ property.title }}</h5>
                  <p class="card-text small text-muted mb-1">{{ property.location }}</p>
                  <p class="card-text fw-bold mb-1">{{ formatPrice(property.price) }}</p>
                  <p class="card-text small mb-1">Quartos: {{ property.bedrooms }} | Visitas: {{ property.views }}</p>
                  <p class="card-text small mb-2 d-md-block d-none">Usuário: {{ getUserName(property.userId) }}</p>
                  <span class="badge mb-3" :class="{
                    'bg-success': property.status === 'Ativa',
                    'bg-warning text-dark': property.status === 'Pendente',
                    'bg-secondary': property.status === 'Inativa'
                  }">{{ property.status }}</span>
                  <div class="d-flex gap-2 flex-wrap">
                    <button class="btn btn-outline-info btn-sm flex-fill" @click="viewProperty(property)">
                      <i class="fas fa-eye"></i> Ver
                    </button>
                    <button class="btn btn-outline-success btn-sm flex-fill" @click="acceptProperty(property.id)" :disabled="property.status === 'Ativa'">
                      <i class="fas fa-check"></i> Aceitar
                    </button>
                    <button class="btn btn-outline-danger btn-sm flex-fill" @click="rejectProperty(property.id)" :disabled="property.status === 'Inativa'">
                      <i class="fas fa-times"></i> Rejeitar
                    </button>
                    <button class="btn btn-outline-primary btn-sm flex-fill" @click="editProperty(property.id)">
                      <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-outline-danger btn-sm flex-fill" @click="deleteProperty(property.id)">
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

      <!-- Modal de Visualização -->
      <div v-if="showPreview" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ selectedProperty?.title || 'Sem título' }}</h5>
              <button type="button" class="btn-close" @click="showPreview = false"></button>
            </div>
            <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
              <div class="row g-3 g-md-4">
                <div class="col-12 col-md-6">
                  <div v-if="selectedProperty?.images.length" class="carousel slide" id="propertyCarousel" data-bs-ride="carousel">
                    <div class="carousel-inner">
                      <div v-for="(img, index) in selectedProperty.images" :key="index" class="carousel-item" :class="{ active: index === 0 }">
                        <img :src="img" class="img-fluid rounded img-framed" alt="Pré-visualização" />
                      </div>
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#propertyCarousel" data-bs-slide="prev">
                      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                      <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#propertyCarousel" data-bs-slide="next">
                      <span class="carousel-control-next-icon" aria-hidden="true"></span>
                      <span class="visually-hidden">Next</span>
                    </button>
                  </div>
                  <div v-else class="text-muted text-center py-3">Nenhuma imagem carregada</div>
                </div>
                <div class="col-12 col-md-6">
                  <h3 class="h5 mb-2">{{ selectedProperty?.title || 'Sem título' }}</h3>
                  <p class="text-muted small mb-1"><i class="fas fa-map-marker-alt me-2"></i>{{ selectedProperty?.location || 'Não especificado' }}</p>
                  <p class="fw-bold mb-1">{{ formatPrice(selectedProperty?.price || 0) }}</p>
                  <p class="small mb-1"><i class="fas fa-user me-2"></i>Publicado por: {{ getUserName(selectedProperty?.userId) }}</p>
                  <span class="badge mb-3" :class="{
                    'bg-success': selectedProperty?.status === 'Ativa',
                    'bg-warning text-dark': selectedProperty?.status === 'Pendente',
                    'bg-secondary': selectedProperty?.status === 'Inativa'
                  }">{{ selectedProperty?.status || 'Não especificado' }}</span>
                  <div class="mt-2">
                    <h4 class="h6">Detalhes</h4>
                    <div class="row g-2">
                      <div class="col-6 small"><i class="fas fa-bed me-1"></i>{{ selectedProperty?.bedrooms || 0 }} Quartos</div>
                      <div class="col-6 small"><i class="fas fa-bath me-1"></i>{{ selectedProperty?.bathrooms || 0 }} Banheiros</div>
                      <div class="col-6 small"><i class="fas fa-ruler-combined me-1"></i>{{ selectedProperty?.area || 0 }} m²</div>
                      <div class="col-6 small"><i class="fas fa-home me-1"></i>{{ selectedProperty?.type || 'Não especificado' }}</div>
                      <div class="col-6 small"><i class="fas fa-car me-1"></i>Garagem: {{ selectedProperty?.garage ? 'Sim' : 'Não' }}</div>
                      <div class="col-6 small"><i class="fas fa-swimming-pool me-1"></i>Piscina: {{ selectedProperty?.piscina ? 'Sim' : 'Não' }}</div>
                      <div class="col-6 small"><i class="fas fa-tree me-1"></i>Jardim: {{ selectedProperty?.jardim ? 'Sim' : 'Não' }}</div>
                      <div class="col-6 small"><i class="fas fa-snowflake me-1"></i>Ar Cond.: {{ selectedProperty?.arcondicionado ? 'Sim' : 'Não' }}</div>
                      <div class="col-12 small"><i class="fas fa-eye me-1"></i>Visitas: {{ selectedProperty?.views || 0 }}</div>
                    </div>
                  </div>
                  <div class="mt-2">
                    <h4 class="h6">Descrição</h4>
                    <p class="small">{{ selectedProperty?.description || 'Nenhuma descrição fornecida' }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-outline-success btn-sm me-2" @click="acceptProperty(selectedProperty?.id)" :disabled="selectedProperty?.status === 'Ativa'">
                <i class="fas fa-check"></i> Aceitar
              </button>
              <button class="btn btn-outline-danger btn-sm me-2" @click="rejectProperty(selectedProperty?.id)" :disabled="selectedProperty?.status === 'Inativa'">
                <i class="fas fa-times"></i> Rejeitar
              </button>
              <button class="btn btn-outline-secondary btn-sm" @click="showPreview = false">Fechar</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="notification.message" class="position-fixed top-0 end-0 m-2 m-md-3 alert alert-sm" :class="notification.type === 'success' ? 'alert-success' : 'alert-danger'">
        <i :class="`fas fa-${notification.type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2`"></i>
        {{ notification.message }}
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Chart from 'chart.js/auto';
import NavbarDashComponent from '@/components/NavbarDashComponent.vue';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: string;
  status: 'Ativa' | 'Inativa' | 'Pendente';
  views: number;
  images: string[];
  userId: any;
  postedDate: string;
  garage: boolean;
  piscina: boolean;
  jardim: boolean;
  arcondicionado: boolean;
  description: string;
}

interface User {
  id: string;
  name: string;
}

interface Filters {
  location: string;
  status: string;
  userId: string;
  type: string;
  priceMin: number | null;
  priceMax: number | null;
  bedrooms: string;
  startDate: string;
  endDate: string;
  feature: string;
}

interface Notification {
  message: string;
  type: 'success' | 'danger';
}

const defaultImage = 'https://via.placeholder.com/150';
const notification = ref<Notification>({ message: '', type: 'success' });
const statusChart = ref<HTMLCanvasElement | null>(null);
const locationChart = ref<HTMLCanvasElement | null>(null);
const viewMode = ref<'table' | 'cards'>('table');
const currentPage = ref(1);
const itemsPerPage = 12;
const showPreview = ref(false);
const selectedProperty = ref<Property | null>(null);

const users = ref<User[]>([
  { id: 'u1', name: 'João Silva' },
  { id: 'u2', name: 'Maria Santos' },
  { id: 'u3', name: 'Pedro Almeida' },
  { id: 'u4', name: 'Ana Costa' },
]);

const properties = ref<Property[]>([
  {
    id: '1', title: 'Moradia T3 Moderna', location: 'Luanda, Talatona', price: 45000000, bedrooms: 3, bathrooms: 2, area: 120, type: 'T3', status: 'Ativa', views: 850,
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c'], userId: 'u1', postedDate: '2025-09-20', garage: true, piscina: false, jardim: true, arcondicionado: true, description: 'Moradia moderna com acabamentos de alta qualidade.'
  },
  {
    id: '2', title: 'Casa T4 em Construção', location: 'Luanda, Ilha do Cabo', price: 32000000, bedrooms: 4, bathrooms: 3, area: 180, type: 'T4', status: 'Pendente', views: 620,
    images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be'], userId: 'u2', postedDate: '2025-09-18', garage: true, piscina: true, jardim: false, arcondicionado: false, description: 'Casa em construção com vista para o mar.'
  },
  {
    id: '3', title: 'Apartamento T2 Centro', location: 'Luanda, Ingombota', price: 28000000, bedrooms: 2, bathrooms: 1, area: 80, type: 'Apartamento', status: 'Ativa', views: 450,
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6'], userId: 'u3', postedDate: '2025-09-15', garage: false, piscina: false, jardim: false, arcondicionado: true, description: 'Apartamento central ideal para solteiros.'
  },
  {
    id: '4', title: 'Villa T5 Luxo', location: 'Benguela, Costa', price: 75000000, bedrooms: 5, bathrooms: 4, area: 300, type: 'Villa', status: 'Ativa', views: 1200,
    images: ['https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea'], userId: 'u4', postedDate: '2025-09-10', garage: true, piscina: true, jardim: true, arcondicionado: true, description: 'Villa de luxo com piscina e jardim.'
  },
  {
    id: '5', title: 'Casa T1 Simples', location: 'Huambo, Centro', price: 15000000, bedrooms: 1, bathrooms: 1, area: 60, type: 'T1', status: 'Inativa', views: 200,
    images: ['https://images.unsplash.com/photo-1600585153490-76fb20a0f2c4'], userId: 'u1', postedDate: '2025-09-05', garage: false, piscina: false, jardim: false, arcondicionado: false, description: 'Casa compacta para uma pessoa.'
  },
  {
    id: '6', title: 'Apartamento T3 Novo', location: 'Luanda, Maianga', price: 38000000, bedrooms: 3, bathrooms: 2, area: 110, type: 'Apartamento', status: 'Pendente', views: 700,
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c'], userId: 'u2', postedDate: '2025-09-22', garage: true, piscina: false, jardim: true, arcondicionado: true, description: 'Apartamento novo com excelente localização.'
  },
]);

const filters = ref<Filters>({
  location: '',
  status: '',
  userId: '',
  type: '',
  priceMin: null,
  priceMax: null,
  bedrooms: '',
  startDate: '',
  endDate: '',
  feature: '',
});

const uniqueLocations = computed(() => [...new Set(properties.value.map(p => p.location))].sort());
const uniqueUsers = computed(() => users.value);

const filteredProperties = computed(() => {
  return properties.value.filter(p => {
    const matchesLocation = !filters.value.location || p.location === filters.value.location;
    const matchesStatus = !filters.value.status || p.status === filters.value.status;
    const matchesUser = !filters.value.userId || p.userId === filters.value.userId;
    const matchesType = !filters.value.type || p.type === filters.value.type;
    const matchesPriceMin = !filters.value.priceMin || p.price >= filters.value.priceMin;
    const matchesPriceMax = !filters.value.priceMax || p.price <= filters.value.priceMax;
    const matchesBedrooms = !filters.value.bedrooms || p.bedrooms >= parseInt(filters.value.bedrooms);
    const matchesStartDate = !filters.value.startDate || new Date(p.postedDate) >= new Date(filters.value.startDate);
    const matchesEndDate = !filters.value.endDate || new Date(p.postedDate) <= new Date(filters.value.endDate);
    const matchesFeature = !filters.value.feature || p[filters.value.feature as keyof Property] === true;
    return matchesLocation && matchesStatus && matchesUser && matchesType && matchesPriceMin && matchesPriceMax && matchesBedrooms && matchesStartDate && matchesEndDate && matchesFeature;
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

const getUserName = (userId: string) => {
  const user = users.value.find(u => u.id === userId);
  return user ? user.name : 'Desconhecido';
};

const resetFilters = () => {
  filters.value = { location: '', status: '', userId: '', type: '', priceMin: null, priceMax: null, bedrooms: '', startDate: '', endDate: '', feature: '' };
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

const viewProperty = (property: Property) => {
  selectedProperty.value = property;
  showPreview.value = true;
};

const acceptProperty = (id: string | undefined) => {
  if (!id) return;
  if (confirm('Deseja aceitar esta propriedade?')) {
    const property = properties.value.find(p => p.id === id);
    if (property) {
      property.status = 'Ativa';
      showNotification('Propriedade aceita com sucesso!', 'success');
      updateCharts();
    }
  }
};

const rejectProperty = (id: string | undefined) => {
  if (!id) return;
  if (confirm('Deseja rejeitar esta propriedade?')) {
    const property = properties.value.find(p => p.id === id);
    if (property) {
      property.status = 'Inativa';
      showNotification('Propriedade rejeitada com sucesso!', 'success');
      updateCharts();
    }
  }
};

const showNotification = (message: string, type: 'success' | 'danger') => {
  notification.value = { message, type };
  setTimeout(() => {
    notification.value = { message: '', type: 'success' };
  }, 3000);
};

const updateCharts = () => {
  if (statusChart.value) {
    const ctx = statusChart.value.getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Ativas', 'Pendentes', 'Inativas'],
          datasets: [{
            data: [
              filteredProperties.value.filter(p => p.status === 'Ativa').length,
              filteredProperties.value.filter(p => p.status === 'Pendente').length,
              filteredProperties.value.filter(p => p.status === 'Inativa').length,
            ],
            backgroundColor: ['#28a745', '#ffc107', '#6c757d'],
            borderColor: ['#ffffff', '#ffffff', '#ffffff'],
            borderWidth: 2,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { font: { size: 10 } } },
            tooltip: { backgroundColor: '#ffffff', titleColor: '#1a1a1a', bodyColor: '#1a1a1a', borderColor: '#e63946', borderWidth: 1 },
          },
          cutout: '60%',
        },
      });
    }
  }

  if (locationChart.value) {
    const locations = uniqueLocations.value;
    const counts = locations.map(loc => filteredProperties.value.filter(p => p.location === loc).length);
    const ctx = locationChart.value.getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: locations,
          datasets: [{
            label: 'Propriedades',
            data: counts,
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
            y: { beginAtZero: true, ticks: { font: { size: 10 } } },
            x: { ticks: { font: { size: 10 } } },
          },
        },
      });
    }
  }
};

onMounted(() => {
  updateCharts();
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

.card {
  background: #ffffff;
  border: none;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
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

.img-framed {
  width: 100%;
  height: 40px;
  object-fit: cover;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.card-img-top {
  height: 160px;
  object-fit: cover;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.carousel img {
  width: 100%;
  max-height: 250px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-control, .form-select {
  border: 1px solid var(--soft-red);
  border-radius: 6px;
  font-size: 0.85rem;
  padding: 0.4rem 0.8rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-control:focus, .form-select:focus {
  border-color: var(--primary-red);
  box-shadow: 0 0 0 2px var(--soft-red);
  outline: none;
}

.form-control::placeholder {
  color: var(--text-muted);
  opacity: 0.7;
}

.form-label {
  color: var(--primary-red);
  font-size: 0.8rem;
  font-weight: 500;
}

.btn-primary {
  background-color: var(--primary-red);
  border-color: var(--primary-red);
  font-size: 0.85rem;
  padding: 0.4rem 1.2rem;
  border-radius: 6px;
  font-weight: 500;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.btn-primary:hover {
  background-color: var(--secondary-red);
  border-color: var(--secondary-red);
  transform: translateY(-2px);
}

.btn-outline-primary, .btn-outline-info, .btn-outline-success, .btn-outline-danger, .btn-outline-secondary {
  font-size: 0.8rem;
  padding: 0.2rem 0.6rem;
  border-radius: 5px;
  border: 1px solid;
}

.btn-outline-primary {
  color: var(--primary-red);
  border-color: var(--primary-red);
}

.btn-outline-primary:hover {
  background-color: var(--primary-red);
  color: #ffffff;
}

.btn-outline-info {
  color: #17a2b8;
  border-color: #17a2b8;
}

.btn-outline-info:hover {
  background-color: #17a2b8;
  color: #ffffff;
}

.btn-outline-success {
  color: #28a745;
  border-color: #28a745;
}

.btn-outline-success:hover {
  background-color: #28a745;
  color: #ffffff;
}

.btn-outline-danger {
  color: var(--primary-red);
  border-color: var(--primary-red);
}

.btn-outline-danger:hover {
  background-color: var(--primary-red);
  color: #ffffff;
}

.btn-outline-secondary {
  color: var(--text-muted);
  border-color: var(--text-muted);
}

.btn-outline-secondary:hover {
  background-color: var(--text-muted);
  color: #ffffff;
}

.alert {
  z-index: 10000;
  font-size: 0.8rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.3s ease-in-out;
}

.dropdown-menu {
  border-radius: 6px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  min-width: 120px;
}

.dropdown-item {
  font-size: 0.8rem;
  padding: 0.4rem 0.8rem;
  transition: background-color 0.2s ease;
}

.dropdown-item:hover {
  background-color: var(--soft-red);
  color: #ffffff;
}

.dropdown-item.text-danger {
  color: var(--primary-red) !important;
}

.dropdown-item.text-danger:hover {
  background-color: var(--soft-red);
  color: #ffffff !important;
}

.table {
  font-size: 0.85rem;
  border-collapse: separate;
  border-spacing: 0 6px;
}

.table th {
  color: var(--text-dark);
  font-weight: 600;
  padding: 0.5rem 0.8rem;
}

.table td {
  padding: 0.5rem 0.8rem;
  vertical-align: middle;
}

.table tr {
  background: #ffffff;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.table tbody tr:hover {
  background-color: #f8fafc;
}

.badge {
  font-size: 0.75rem;
  padding: 0.3rem 0.6rem;
  border-radius: 10px;
}

.pagination .page-link {
  color: var(--primary-red);
  border-radius: 5px;
  margin: 0 2px;
  padding: 0.4rem 0.8rem;
  font-size: 0.8rem;
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

.modal-content {
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.modal-header {
  border-bottom: none;
  padding: 0.8rem 1.2rem;
}

.modal-footer {
  border-top: none;
  padding: 0.8rem 1.2rem;
}

/* Responsividade */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding: 1rem;
  }

  .card {
    border-radius: 8px;
  }

  .card-img-top {
    height: 140px;
  }

  .form-label {
    font-size: 0.75rem;
  }

  .form-control, .form-select {
    font-size: 0.8rem;
    padding: 0.35rem 0.7rem;
  }

  .btn-primary, .btn-outline-primary, .btn-outline-info, .btn-outline-success, .btn-outline-danger, .btn-outline-secondary {
    font-size: 0.75rem;
    padding: 0.35rem 0.7rem;
  }

  .btn-sm {
    font-size: 0.7rem;
    padding: 0.2rem 0.5rem;
  }

  .chart-container {
    height: 180px;
  }

  .modal-dialog {
    margin: 0.5rem auto;
    max-width: 95%;
  }

  .carousel img {
    max-height: 200px;
  }

  .img-framed {
    height: 35px;
  }

  .table th, .table td {
    padding: 0.4rem 0.6rem;
    font-size: 0.8rem;
  }

  .table-responsive {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .row.g-3 > .col-md-3,
  .row.g-3 > .col-sm-6,
  .row.g-2 > .col-12 {
    flex: 0 0 50%;
    max-width: 50%;
  }

  .pagination .page-link {
    padding: 0.3rem 0.6rem;
    font-size: 0.75rem;
  }
}

@media (max-width: 576px) {
  .main-content {
    padding: 0.5rem;
  }

  .card-title {
    font-size: 0.9rem;
  }

  .card-img-top {
    height: 120px;
  }

  .form-control, .form-select {
    font-size: 0.75rem;
    padding: 0.3rem 0.6rem;
  }

  .form-label {
    font-size: 0.7rem;
  }

  .btn-primary, .btn-outline-primary, .btn-outline-info, .btn-outline-success, .btn-outline-danger, .btn-outline-secondary {
    font-size: 0.7rem;
    padding: 0.3rem 0.6rem;
    width: 100%;
  }

  .btn-sm {
    font-size: 0.65rem;
    padding: 0.15rem 0.4rem;
  }

  .row.g-3 > .col-12,
  .row.g-3 > .col-md-3,
  .row.g-3 > .col-sm-6,
  .row.g-2 > .col-12,
  .row.g-2 > .col-md-2,
  .row.g-2 > .col-sm-6 {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .modal-dialog {
    margin: 0.25rem auto;
    max-width: 90%;
  }

  .modal-content {
    border-radius: 6px;
  }

  .modal-body {
    padding: 0.5rem;
    max-height: 60vh;
  }

  .modal-header, .modal-footer {
    padding: 0.5rem 1rem;
  }

  .carousel img {
    max-height: 150px;
  }

  .img-framed {
    height: 30px;
  }

  .modal-title {
    font-size: 0.9rem;
  }

  .modal-body h3.h5 {
    font-size: 1rem;
  }

  .modal-body h4.h6 {
    font-size: 0.8rem;
  }

  .modal-body p, .modal-body .row div {
    font-size: 0.75rem;
  }

  .table {
    font-size: 0.75rem;
  }

  .table th, .table td {
    padding: 0.3rem 0.5rem;
  }

  .chart-container {
    height: 150px;
  }

  .dropdown-menu {
    min-width: 100px;
  }

  .dropdown-item {
    font-size: 0.75rem;
    padding: 0.3rem 0.6rem;
  }

  .badge {
    font-size: 0.7rem;
    padding: 0.2rem 0.5rem;
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>