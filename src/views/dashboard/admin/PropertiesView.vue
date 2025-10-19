<template>
  <div class="min-vh-100 bg-light-custom">
    <NavbarDashComponent title="Minhas Propriedades" class="mb-7" />

    <main class="main-content p-4 mt-5">
      <section class="row g-4 ">
        <div class="col-lg-3 col-md-6">
          <div class="card-stat h-100">
            <div class="card-body text-center">
              <div class="stat-icon bg-danger-soft mb-3">
                <i class="fas fa-home fa-2x"></i>
              </div>
              <h7 class="stat-number text-danger">{{ totalProperties }}</h7>
              <p class="stat-label">Total Geral</p>
            </div>
          </div>
        </div>

        <div class="col-lg-3 col-md-6">
          <div class="card-stat h-100">
            <div class="card-body text-center">
              <div class="stat-icon bg-success-soft mb-3">
                <i class="fas fa-user fa-2x"></i>
              </div>
              <h7 class="stat-number text-danger">{{ myPropertiesCount }}</h7>
              <p class="stat-label">Minhas</p>
            </div>
          </div>
        </div>

        <div class="col-lg-3 col-md-6">
          <div class="card-stat h-100">
            <div class="card-body text-center">
              <div class="stat-icon bg-primary-soft mb-3">
                <i class="fas fa-coins fa-2x"></i>
              </div>
              <h7 class="stat-number text-danger">{{ formatTotalValue }}</h7>
              <p class="stat-label">Valor Total</p>
            </div>
          </div>
        </div>

        <div class="col-lg-3 col-md-6">
          <div class="card-stat h-100">
            <div class="card-body text-center">
              <div class="stat-icon bg-info-soft mb-3">
                <i class="fas fa-eye fa-2x"></i>
              </div>
              <h7 class="stat-number text-danger">{{ totalViews }}</h7>
              <p class="stat-label">Visitas</p>
            </div>
          </div>
        </div>
      </section>

      <div class="card shadow-sm mb-4">
        <div class="card-body p-4">
          <div class="row g-3 align-items-end">
            <div class="col-md-2">
              <label class="form-label small fw-medium">Proprietário</label>
              <select v-model="filters.owner" class="form-select">
                <option value="">Todos</option>
                <option value="minhas">Minhas</option>
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label small fw-medium">Tipo</label>
              <select v-model="filters.type" class="form-select">
                <option value="">Todas</option>
                <option value="0">🏠 Casa</option>
                <option value="1">🏢 Apartamento</option>
                <option value="2">🏪 Comercial</option>
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label small fw-medium">Status</label>
              <select v-model="filters.status" class="form-select">
                <option value="">Todos</option>
                <option value="1">✅ Ativa</option>
                <option value="0">⏸️ Inativa</option>
                <option value="2">⏳ Pendente</option>
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label small fw-medium">Preço Mín.</label>
              <div class="input-group">
                <span class="input-group-text bg-white">AOA</span>
                <input v-model.number="filters.price_min" type="number" class="form-control" placeholder="0" />
              </div>
            </div>
            <div class="col-md-2">
              <label class="form-label small fw-medium">Preço Máx.</label>
              <div class="input-group">
                <input v-model.number="filters.price_max" type="number" class="form-control" placeholder="∞" />
                <span class="input-group-text bg-white">AOA</span>
              </div>
            </div>
            
            <div class="col-md-auto">
              <button class="btn btn-danger px-3" @click="applyFilters">
                <i class="fas fa-search me-2"></i>Filtrar
              </button>
              <button class="btn btn-outline-secondary px-3 ms-2" @click="resetFilters">
                <i class="fas fa-times me-2"></i>Limpar
              </button>
            </div>
          </div>
          <div class="mt-3">
            <small class="text-muted">
              {{ filteredProperties.length }} de {{ totalProperties }} propriedades
            </small>
          </div>
        </div>
      </div>

      <div class="card shadow-sm">
        <div class="card-body p-4">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="card-title h5 mb-0 text-dark fw-bold">
              <i class="fas fa-list me-2 text-danger"></i>
              Lista de Propriedades
            </h3>
            <div class="d-flex align-items-center gap-3">
              <div class="bg-light rounded-pill px-3 py-1 small text-muted">
                {{ filteredProperties.length }} propriedades
              </div>
              <select v-model="viewMode" class="form-select form-select-sm" style="width: 100px;">
                <option value="cards">Cartões</option>
                <option value="table">Tabela</option>
              </select>
            </div>
          </div>

          <div v-if="viewMode === 'table'" class="table-responsive">
            <table class="table table-hover align-middle">
              <thead class="table-danger">
                <tr>
                  <th>Imagem</th>
                  <th>Nome</th>
                  <th>Endereço</th>
                  <th>Preço</th>
                  <th>Q/B</th>
                  <th>Área</th>
                  <th>Visitas</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="property in filteredProperties" :key="property.id" class="table-row-hover">
                  <td>
                    <img :src="property.photo || placeholderImg" class="rounded-circle" style="width: 50px; height: 50px; object-fit: cover;" />
                  </td>
                  <td>
                    <strong class="d-block">{{ property.name }}</strong>
                    <small class="text-muted">{{ getTypeLabel(property.type) }}</small>
                  </td>
                  <td>
                    <i class="fas fa-map-marker-alt text-danger me-1"></i>
                    {{ property.address }}
                  </td>
                  <td><strong class="text-danger">{{ formatPrice(property.price) }}</strong></td>
                  <td>
                    <span class="badge bg-success">{{ property.bedrooms }}Q/{{ property.bathrooms }}B</span>
                  </td>
                  <td>{{ property.area }} m²</td>
                  <td>
                    <span class="badge bg-info">
                      <i class="fas fa-eye me-1"></i>{{ property.views || 0 }}
                    </span>
                  </td>
                  <td>
                    <span class="badge" :class="{
                      'bg-success': property.status === '1',
                      'bg-warning': property.status === '2',
                      'bg-secondary': property.status === '0'
                    }">
                      {{ property.status === '1' ? '✅ Ativa' : property.status === '2' ? '⏳ Pendente' : '⏸️ Inativa' }}
                    </span>
                  </td>
                  <td>
                    <div class="btn-group btn-group-sm">
                      <button class="btn btn-outline-danger" @click="editProperty(property.id)">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button class="btn btn-outline-success" @click="toggleStatus(property.id)">
                        <i class="fas fa-power-off"></i>
                      </button>
                      <button class="btn btn-outline-danger" @click="deleteProperty(property.id)">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="loading && filteredProperties.length === 0">
                  <td colspan="9" class="text-center py-5">
                    <i class="fas fa-spinner fa-spin fa-3x text-danger mb-3"></i>
                    <p class="text-muted">Carregando propriedades...</p>
                  </td>
                </tr>
                <tr v-if="!loading && filteredProperties.length === 0">
                  <td colspan="9" class="text-center py-5">
                    <i class="fas fa-home fa-3x text-muted mb-3"></i>
                    <p class="text-muted">Nenhuma propriedade encontrada</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="properties-container">
            <div v-for="property in filteredProperties" :key="property.id" class="col-xl-3 col-lg-4 col-md-6 mb-4">
              <div class="card h-100 shadow-sm overflow-hidden">
                <div class="position-relative">
                  <img :src="property.photo || placeholderImg" class="card-img-top" style="height: 200px; object-fit: cover;" />
                  <span class="badge position-absolute top-2 end-2" :class="{
                    'bg-success': property.status === '1',
                    'bg-warning': property.status === '2',
                    'bg-secondary': property.status === '0'
                  }">
                    {{ property.status === '1' ? '✅' : property.status === '2' ? '⏳' : '⏸️' }}
                  </span>
                  <div class="views-badge position-absolute bottom-2 start-2">
                    <i class="fas fa-eye me-1"></i>{{ property.views || 0 }}
                  </div>
                </div>
                <div class="card-body d-flex flex-column"><br></br >
                  <h3 class="card-title fw-bold text-danger">{{ property.name }}</h3>
                  <p class="card-text text-muted small mb-2">
                    <i class="fas fa-map-marker-alt me-1"></i>{{ property.address }}
                  </p>
                  <div class="price-tag text-danger fw-bold h5 mb-3">{{ formatPrice(property.price) }}</div>
                  <div class="property-specs mb-3">
                    <span class="spec-item me-2"><i class="fas fa-bed text-danger me-1"></i>{{ property.bedrooms }}</span>
                    <span class="spec-item me-2"><i class="fas fa-bath text-danger me-1"></i>{{ property.bathrooms }}</span>
                    <span class="spec-item"><i class="fas fa-ruler-combined text-danger me-1"></i>{{ property.area }}m²</span>
                  </div>
                  <div class="mt-auto">
                    <div class="btn-group w-100">
                      <button class="btn btn-outline-danger flex-fill me-1" @click="editProperty(property.id)">
                        <i class="fas fa-edit me-1"></i>Editar
                      </button>
                      <button class="btn btn-outline-success flex-fill" @click="toggleStatus(property.id)">
                        <i class="fas fa-power-off me-1"></i>
                        {{ property.status === '1' ? 'Pausar' : 'Ativar' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="loading" class="col-12 text-center py-5">
              <i class="fas fa-spinner fa-spin fa-3x text-danger mb-3"></i>
              <p class="text-muted">Carregando mais propriedades...</p>
            </div>

            <div v-if="!loading && filteredProperties.length === 0" class="col-12 text-center py-5">
              <i class="fas fa-home fa-3x text-muted mb-3"></i>
              <p class="text-muted">Nenhuma propriedade encontrada</p>
            </div>

            <div ref="loadTrigger" class="load-trigger"></div>
          </div>
        </div>
      </div>
    </main>

    <div v-if="notification.message" class="position-fixed top-0 end-0 m-3 alert alert-sm z-1050 shadow-lg" 
         :class="notification.type === 'success' ? 'alert-success border-success' : 'alert-danger border-danger'">
      <i :class="`fas fa-${notification.type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2`"></i>
      {{ notification.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import NavbarDashComponent from '@/components/NavbarDashComponent.vue'
import Cookies from 'js-cookie'

interface Property {
  id: string
  name: string
  price: number
  address: string
  type: string
  bedrooms: number
  bathrooms: number
  area: number
  status: '0' | '1' | '2'
  views?: number
  photos: { url: string }[]
  photo: string
  category_id: string
  user_id: string
  year_built?: number
  condition?: string
  availability?: string
  garages?: boolean
  swimming_pool?: boolean
  garden?: boolean
  air_conditioning?: boolean
}

interface Filters {
  owner: string
  type: string
  category_id: string
  status: string
  bedrooms: string
  price_min: number | null
  price_max: number | null
}

const notification: any = ref({ message: '', type: 'success' as const })
const viewMode = ref<'cards' | 'table'>('cards')
const properties = ref<Property[]>([])
const filteredProperties = ref<Property[]>([])
const loading = ref(false)
const hasMore = ref(true)
const page = ref(1)
const loadTrigger = ref<HTMLElement>()

const filters = ref<Filters>({
  owner: '', type: '', category_id: '', status: '', bedrooms: '', price_min: null, price_max: null
})

const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cirimoveis.com/api/v1'

const totalProperties = computed(() => filteredProperties.value.length)
const myPropertiesCount = computed(() => filteredProperties.value.filter(p => p.user_id === Cookies.get('user') ? JSON.parse(Cookies.get('user')!).id : '').length)
const formatTotalValue = computed(() => formatPrice(filteredProperties.value.reduce((sum, p) => sum + p.price, 0)))
const totalViews = computed(() => filteredProperties.value.reduce((sum, p) => sum + (p.views || 0), 0))

const placeholderImg = 'https://via.placeholder.com/300x200?text=Imagem'
const formatPrice = (price: number) => new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 }).format(price)
const getTypeLabel = (type: string) => type === '0' ? 'Casa' : type === '1' ? 'Apartamento' : 'Comercial'

const applyFilters = async () => {
  page.value = 1
  properties.value = []
  filteredProperties.value = []
  await loadProperties()
  showNotification('Filtros aplicados!', 'success')
}

const resetFilters = async () => {
  Object.assign(filters.value, { owner: '', type: '', category_id: '', status: '', bedrooms: '', price_min: null, price_max: null })
  page.value = 1
  properties.value = []
  filteredProperties.value = []
  await loadProperties()
  showNotification('Filtros limpos!', 'success')
}

const loadProperties = async () => {
  if (loading.value) return
  loading.value = true

  try {
    const token = Cookies.get('token')
    if (!token) throw new Error('Token não encontrado')

    const params = new URLSearchParams()
    if (filters.value.type) params.append('type', filters.value.type)
    if (filters.value.category_id) params.append('category_id', filters.value.category_id)
    if (filters.value.status) params.append('status', filters.value.status)
    if (filters.value.bedrooms) params.append('bedrooms_min', filters.value.bedrooms)
    if (filters.value.price_min) params.append('price_min', filters.value.price_min.toString())
    if (filters.value.price_max) params.append('price_max', filters.value.price_max.toString())
    params.append('page', page.value.toString())
    params.append('limit', '12')

    const response = await fetch(`${API_URL}/products?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) throw new Error('Erro ao carregar propriedades')

    const data = await response.json()
    
    if (data.products && data.products.length > 0) {
      // Normalizar photos

      console.log(data.products)
      const newProperties = data.products.map((p: any) => ({
        ...p,
        photos: p.photos?.length ? [{ url: p.photos[0]['url'] }] : [{ url: placeholderImg }],
        views: p.views || 0
      }))

      if (page.value === 1) {
        filteredProperties.value = newProperties
      } else {
        filteredProperties.value.push(...newProperties)
      }

      properties.value = [...properties.value, ...newProperties]
      page.value++
      hasMore.value = newProperties.length === 12
    } else {
      hasMore.value = false
    }
  } catch (error: any) {
    showNotification(error.message || 'Erro ao carregar propriedades', 'danger')
  } finally {
    loading.value = false
  }
}

const editProperty = (id: string) => {
  showNotification(`Editando propriedade ${id}`, 'success')
}

const toggleStatus = async (id: string) => {
  try {
    const token = Cookies.get('token')
    const prop = filteredProperties.value.find(p => p.id === id)
    if (!prop || !token) return

    const newStatus = prop.status === '1' ? '0' : '1'
    const response = await fetch(`${API_URL}/products/${id}/status`, {
      method: 'PATCH',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: newStatus })
    })

    if (response.ok) {
      prop.status = newStatus
      showNotification(`Propriedade ${newStatus === '1' ? 'ativada' : 'pausada'}!`, 'success')
    }
  } catch (error) {
    showNotification('Erro ao alterar status', 'danger')
  }
}

const deleteProperty = async (id: string) => {
  if (!confirm('Confirmar exclusão?')) return
  
  try {
    const token = Cookies.get('token')
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })

    if (response.ok) {
      filteredProperties.value = filteredProperties.value.filter(p => p.id !== id)
      showNotification('Propriedade excluída!', 'success')
    }
  } catch (error) {
    showNotification('Erro ao excluir propriedade', 'danger')
  }
}

const showNotification = (message: string, type: string) => {
  notification.value = { message, type }
  setTimeout(() => notification.value.message = '', 4000)
}

let observer: IntersectionObserver | null = null

onMounted(async () => {
  await loadProperties()
  
  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && hasMore.value && !loading.value) {
      loadProperties()
    }
  }, { threshold: 0.1 })

  if (loadTrigger.value) {
    observer.observe(loadTrigger.value)
  }
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
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

.bg-light-custom { background-color: var(--light-bg); }
.main-content { margin-left: 250px; transition: margin-left 0.3s ease; }

.card-stat { 
  background: #ffffff; border: none; border-radius: 16px; 
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08); overflow: hidden;
  transition: all 0.3s ease;
}
.card-stat:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12); }
.stat-icon { 
  width: 60px; height: 60px; border-radius: 50%; 
  display: flex; align-items: center; justify-content: center; margin: 0 auto;
}
.bg-danger-soft { background: var(--soft-red); }
.bg-success-soft { background: rgba(16,185,129,0.1); }
.bg-primary-soft { background: rgba(13,110,253,0.1); }
.bg-info-soft { background: rgba(13,202,240,0.1); }
.stat-number { font-size: 2.5rem; font-weight: 700; margin: 0.5rem 0; }
.stat-label { color: var(--text-muted); font-size: 0.9rem; margin: 0; }

.form-label { 
  color: var(--primary-red); font-size: 0.85rem; font-weight: 600; margin-bottom: 0.5rem;
}
.form-control, .form-select { 
  border: 2px solid var(--soft-red); border-radius: 10px; 
  font-size: 0.95rem; padding: 0.75rem 1rem; background: #fafbfc;
  transition: all 0.3s ease;
}
.form-control:focus, .form-select:focus { 
  border-color: var(--primary-red); box-shadow: 0 0 0 4px var(--soft-red); 
  background: #fff; transform: translateY(-1px);
}

.properties-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.table-row-hover:hover { background-color: var(--soft-red) !important; transform: scale(1.01); }
.table-danger { --bs-table-bg: var(--soft-red); color: var(--primary-red); }
.price-tag { font-size: 1.25rem; }
.property-specs .spec-item { color: var(--text-muted); font-size: 0.9rem; }
.views-badge { 
  background: rgba(0,0,0,0.7); color: white; padding: 0.25rem 0.5rem; 
  border-radius: 12px; font-size: 0.75rem;
}

.card { 
  background: #ffffff; border: none; border-radius: 16px; 
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08); transition: all 0.3s ease;
}
.card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(0, 0, 0, 0.12); }

.load-trigger {
  height: 20px;
}

.alert { 
  z-index: 1050; font-size: 0.9rem; padding: 1rem 1.5rem; 
  border-radius: 10px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  animation: slideInRight 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); border: none;
}
.border-success { border-left: 4px solid #198754 !important; }
.border-danger { border-left: 4px solid #dc3545 !important; }

@media (max-width: 991px) { .main-content { margin-left: 0; } }
@media (max-width: 768px) { 
  .properties-container > * { flex: 0 0 100%; max-width: 100%; } 
  .stat-number { font-size: 2rem; }
  .card-body { padding: 1.5rem !important; }
}

@keyframes slideInRight {
  from { opacity: 0; transform: translateX(100%); }
  to { opacity: 1; transform: translateX(0); }
}
</style>