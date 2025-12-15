<template>
  <div class="min-vh-100 bg-gradient-light">
    <NavbarDashComponent title="Propriedades" class="mb-6" />

    <main class="main-content px-4 pt-5">
      
      <section class="row g-3">
        <div class="col-lg-3 col-md-6">
          <div class="stat-card">
            <div class="d-flex align-items-center">
              <div class="stat-icon bg-red">
                <i class="fas fa-home"></i>
              </div>
              <div class="ms-3">
                <h5 class="stat-num mb-0">{{ totalProperties }}</h5>
                <p class="stat-text mb-0">Total de casas</p>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-3 col-md-6">
          <div class="stat-card">
            <div class="d-flex align-items-center">
              <div class="stat-icon bg-green">
                <i class="fas fa-user"></i>
              </div>
              <div class="ms-3">
                <h5 class="stat-num mb-0">{{ myPropertiesCount }}</h5>
                <p class="stat-text mb-0">Cirimóveis</p>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-3 col-md-6">
          <div class="stat-card">
            <div class="d-flex align-items-center">
              <div class="stat-icon bg-purple">
                <i class="fas fa-coins"></i>
              </div>
              <div class="ms-3">
                <h5 class="stat-num mb-0">{{ formatTotalValue }}</h5>
                <p class="stat-text mb-0">Valor total</p>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-3 col-md-6">
          <div class="stat-card">
            <div class="d-flex align-items-center">
              <div class="stat-icon bg-blue">
                <i class="fas fa-eye"></i>
              </div>
              <div class="ms-3">
                <h5 class="stat-num mb-0">{{ totalViews }}</h5>
                <p class="stat-text mb-0">Visitas</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <div class="card-filter mb-4">
        <div class="card-body p-4">
          <div class="row g-3 align-items-end">
            <div class="col-md-2">
              <input v-model="filters.name" type="text" class="form-control clean-input" placeholder="Pesquisar por título" />
            </div>
            
            <div class="col-md-2">
              <select v-model="filters.owner" class="form-select clean-select">
                <option value="">-- Propriedades --</option>
                <option value="minhas">Minhas</option>
                <option value="0">Cirimóveis</option>
                <option value="1">Usuários</option>
              </select>
            </div>
            <div class="col-md-2">
              <select v-model="filters.emphasis" class="form-select clean-select">
                <option value="">-- Destaque --</option>
                <option value="0">Não</option>
                <option value="1">Sim</option>
              </select>
            </div>
            <div class="col-md-2">
              <select v-model="filters.status" class="form-select clean-select">
                <option value="">-- Estado --</option>
                <option value="1">Ativa</option>
                <option value="0">Inativa</option>
                <option value="2">Pendente</option>
              </select>
            </div>
            <div class="col-md-2">
              <input v-model.number="filters.price_min" type="number" class="form-control clean-input" placeholder="Preço mín." />
            </div>
            <div class="col-md-2">
              <input v-model.number="filters.price_max" type="number" class="form-control clean-input" placeholder="Preço máx." />
            </div>
            <div class="col-md-auto">
              <button @click="applyFilters" class="btn btn-red btn-sm px-4">
                <i class="fas fa-search me-1"></i> Buscar
              </button>
              <button @click="resetFilters" class="btn btn-outline-red btn-sm px-4 ms-2">
                Limpar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista -->
      <div class="card-list">
        <div class="card-body p-4">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="mb-0 fw-medium text-dark">
              <i class="fas fa-th-list me-2 text-red"></i>
              Todas as propriedades
            </h3>
            <div class="d-flex align-items-center gap-3">
              <span class="text-muted small">{{ filteredProperties.length }} imóveis</span>
              <button @click="viewMode = 'cards'" :class="{ 'active': viewMode === 'cards' }" class="btn-view">
                <i class="fas fa-th"></i>
              </button>
              <button @click="viewMode = 'table'" :class="{ 'active': viewMode === 'table' }" class="btn-view">
                <i class="fas fa-list"></i>
              </button>
            </div>
          </div>

          <!-- Vista Cartões -->
          <div v-if="viewMode === 'cards'" class="row g-4">
            <div v-for="property in filteredProperties" :key="property.id" class="col-xl-3 col-lg-4 col-md-6">
              <div class="property-card">
                <div class="img-wrapper">
                  <img :src="property.photo || '/placeholder-home.jpg'" class="img-fluid" />
                  <div class="badge-status" :class="statusClass(property.status)">
                    {{ statusText(property.status) }}
                  </div>
                  <div class="views">
                    <i class="fas fa-eye"></i> {{ property.views || 0 }}
                  </div>
                </div>
                <div class="p-3">
                  <h6 class="mb-1 fw-bold text-dark">{{ property.name }}</h6>
                  <p class="text-muted small mb-2">
                    <i class="fas fa-map-marker-alt text-red me-1"></i>
                    {{ property.address }}
                  </p>
                  <div class="price mb-3 text-red fw-bold">{{ formatPrice(property.price) }}</div>
                  <div class="d-flex justify-content-between text-muted small mb-3">
                    <span><i class="fas fa-bed me-1"></i>{{ property.bedrooms }}</span>
                    <span><i class="fas fa-bath me-1"></i>{{ property.bathrooms }}</span>
                    <span><i class="fas fa-ruler-combined me-1"></i>{{ property.area }}m²</span>
                  </div>
                  <div class="d-flex gap-2">
                    
                    <RouterLink :to="{ name: 'app.dash.property.edit', params: { slug: property.slug } }" class="btn btn-outline-red flex-fill btn-sm"
                                            title="Editar">
                                            <i class="fas fa-edit"></i>
                                        </RouterLink>

                    <button @click="confirmDelete(property)" class="btn btn-red flex-fill btn-sm">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Vista Tabela -->
          <div v-if="viewMode === 'table'" class="table-responsive">
            <table class="table table-clean">
              <thead>
                <tr>
                  <th>Foto</th>
                  <th>Título</th>
                  <th>Preço</th>
                  <th>Tipo</th>
                  <th>Status</th>
                  <th>Visitas</th>
                  <th class="text-end">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="property in filteredProperties" :key="property.id">
                  <td>
                    <img :src="property.photo" class="thumb" />
                  </td>
                  <td>
                    <div class="fw-medium">{{ property.name }}</div>
                    <small class="text-muted">{{ property.address }}</small>
                  </td>
                  <td class="text-red fw-bold">{{ formatPrice(property.price) }}</td>
                  <td>{{ getTypeLabel(property.type) }}</td>
                  <td>
                    <span class="badge-sm" :class="statusClass(property.status)">
                      {{ statusText(property.status) }}
                    </span>
                  </td>
                  <td>{{ property.views || 0 }}</td>
                  <td class="text-end">
                    <button @click="editProperty(property.slug)" class="btn btn-outline-red btn-sm me-1">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button @click="confirmDelete(property)" class="btn btn-red btn-sm">
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="loading && filteredProperties.length === 0" class="text-center py-5">
            <i class="fas fa-spinner fa-spin fa-2x text-red"></i>
            <p class="text-muted mt-3">Carregando imóveis...</p>
          </div>

          <div v-if="!loading && filteredProperties.length === 0" class="text-center py-5">
            <i class="fas fa-home fa-3x text-muted"></i>
            <p class="text-muted mt-3">Nenhum imóvel encontrado</p>
          </div>

          <div ref="loadTrigger" class="h-1"></div>
        </div>
      </div>
    </main>

    <div v-if="showDeleteModal" class="modal-backdrop" @click="showDeleteModal = false">
      <div class="modal-delete" @click.stop>
        <div class="modal-header">
          <h5>Excluir imóvel?</h5>
          <button @click="showDeleteModal = false" class="btn-close"></button>
        </div>
        <div class="modal-body">
          <p>Queres mesmo apagar <strong>"{{ propertyToDelete?.name }}"</strong>?</p>
          <small class="text-muted">Essa ação não pode ser desfeita.</small>
        </div>
        <div class="modal-footer">
          <button @click="showDeleteModal = false" class="btn btn-light">Cancelar</button>
          <button @click="deleteProperty" :disabled="deleting" class="btn btn-red">
            <i v-if="deleting" class="fas fa-spinner fa-spin me-2"></i>
            {{ deleting ? 'Apagando...' : 'Sim, apagar' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div v-if="notification.message" class="toast-notification" :class="notification.type">
      <i :class="notification.type === 'success' ? 'fas fa-check' : 'fas fa-times'"></i>
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
  photo: string
  emphasis: any
  slug: string

  user_id: string
}

const notification = ref({ message: '', type: 'success' })
const viewMode = ref<'cards' | 'table'>('cards')
const filteredProperties = ref<Property[]>([])
const loading = ref(false)
const hasMore = ref(true)
const page = ref(1)
const loadTrigger = ref<HTMLElement>()
const showDeleteModal = ref(false)
const propertyToDelete = ref<Property | null>(null)
const deleting = ref(false)

const filters = ref({
  name: '', owner: '', type: '', status: '', price_min: null as number | null, price_max: null as number | null, emphasis: ''
})

const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cirimoveis.com/api/v1'

const totalProperties = computed(() => filteredProperties.value.length)
const myPropertiesCount = computed(() => {
  const userId = Cookies.get('user') ? JSON.parse(Cookies.get('user')!).id : ''
  return filteredProperties.value.filter(p => p.user_id === userId).length
})
const formatTotalValue = computed(() => formatPrice(filteredProperties.value.reduce((s, p) => s + p.price, 0)))
const totalViews = computed(() => filteredProperties.value.reduce((s, p) => s + (p.views || 0), 0))

const formatPrice = (p: number) => new Intl.NumberFormat('pt-AO', { 
  style: 'currency', currency: 'AOA', maximumFractionDigits: 0 
}).format(p)

const getTypeLabel = (t: string) => t === '0' ? 'Casa' : t === '1' ? 'Apartamento' : 'Comercial'
const statusText = (s: string) => s === '1' ? 'Activa' : s === '2' ? 'Pendente' : 'Inativa'
const statusClass = (s: string) => ({
  '1': 'bg-success', '2': 'bg-warning', '0': 'bg-secondary'
}[s])

const applyFilters = async () => {
  page.value = 1
  filteredProperties.value = []
  await loadProperties()
  showNotification('Filtros aplicados', 'success')
}

const resetFilters = async () => {
  filters.value = { name: '', owner: '', type: '', status: '', price_min: null, price_max: null, emphasis: '' }
  page.value = 1
  filteredProperties.value = []
  await loadProperties()
  showNotification('Filtros limpos', 'success')
}

const loadProperties = async () => {
  if (loading.value) return
  loading.value = true

  try {
    const token = Cookies.get('token')
    const params = new URLSearchParams()
    
    if (filters.value.owner === 'minhas') {
      const userId = JSON.parse(Cookies.get('user')!).id
      params.append('user_id', userId)
    }
    if (filters.value.name) params.append('name', filters.value.name)
    if (filters.value.emphasis) params.append('emphasis', filters.value.emphasis)

    if (filters.value.type) params.append('type', filters.value.type)
    if (filters.value.status) params.append('status', filters.value.status)
    if (filters.value.price_min) params.append('price_min', filters.value.price_min.toString())
    if (filters.value.price_max) params.append('price_max', filters.value.price_max.toString())
    params.append('page', page.value.toString())
    params.append('limit', '12')

    const res = await fetch(`${API_URL}/products?${params}`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    
    if (!res.ok) throw new Error('Erro')

    const data = await res.json()

    

    const newProps = data.products.map((p: any) => ({
      ...p,
      views: p.views || 0
    }))


    if (page.value === 1) filteredProperties.value = newProps
    else filteredProperties.value.push(...newProps)

    page.value++
    hasMore.value = newProps.length === 12
  } catch {
    showNotification('Erro ao carregar', 'error')
  } finally {
    loading.value = false
  }
}

const editProperty = (slug: string) => {
  location.href = `/admin/properties/edit/${slug}`
}

const confirmDelete = (p: Property) => {
  propertyToDelete.value = p
  showDeleteModal.value = true
}

const deleteProperty = async () => {
  if (!propertyToDelete.value) return
  deleting.value = true

  try {
    const token = Cookies.get('token')
    const res = await fetch(`${API_URL}/products/${propertyToDelete.value.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })

    if (res.ok) {
      filteredProperties.value = filteredProperties.value.filter(p => p.id !== propertyToDelete.value!.id)
      showDeleteModal.value = false
      propertyToDelete.value = null
      showNotification('Imóvel apagado', 'success')
    }
  } catch {
    showNotification('Erro ao apagar', 'error')
  } finally {
    deleting.value = false
  }
}

const showNotification = (msg: string, type: 'success' | 'error') => {
  notification.value = { message: msg, type }
  setTimeout(() => notification.value.message = '', 3500)
}

let observer: IntersectionObserver | null = null
onMounted(async () => {
  await loadProperties()
  observer = new IntersectionObserver(([e]) => {
    if (e.isIntersecting && hasMore.value && !loading.value) loadProperties()
  }, { threshold: 0.1 })
  loadTrigger.value && observer.observe(loadTrigger.value)
})
onUnmounted(() => observer?.disconnect())
</script>

<style scoped>
.bg-gradient-light {
  background: linear-gradient(135deg, #fdfbfb 0%, #f8f9fa 100%);
}
.main-content { margin-left: 250px; transition: margin-left .3s; }

.stat-card {
  background: white;
  padding: 1.2rem 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  transition: all .3s ease;
}
.stat-card:hover { transform: translateY(-4px); box-shadow: 0 10px 25px rgba(230,57,70,0.1); }

.stat-icon {
  width: 48px; height: 48px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.3rem; color: white;
}
.bg-red { background: #e63946; }
.bg-green { background: #10b981; }
.bg-purple { background: #8b5cf6; }
.bg-blue { background: #3b82f6; }

.stat-num { font-size: 1.1rem; font-weight: 700; color: #1f2937; }
.stat-text { font-size: 0.9rem; color: #6b7280; }

.card-filter {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}
.clean-select, .clean-input {
  border: 1.5px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 0.6rem 0.9rem;
  font-size: 0.95rem;
}
.clean-select:focus, .clean-input:focus {
  border-color: #e63946;
  box-shadow: 0 0 0 3px rgba(230,57,70,0.15);
}

.btn-red {
  background: #e63946;
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 500;
  transition: all .2s;
}
.btn-red:hover { background: #c92c39; transform: translateY(-1px); }
.btn-outline-red {
  border: 1.5px solid #e63946;
  color: #e63946;
  border-radius: 0.75rem;
}
.btn-outline-red:hover {
  background: #e63946;
  color: white;
}

.card-list {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
}

.btn-view {
  width: 38px; height: 38px;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.75rem;
  background: white;
  color: #6b7280;
}
.btn-view.active {
  background: #e63946;
  color: white;
  border-color: #e63946;
}

.property-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.06);
  transition: all .3s ease;
}
.property-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 15px 35px rgba(230,57,70,0.15);
}
.img-wrapper {
  position: relative;
  height: 180px;
  overflow: hidden;
}
.img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .4s;
}
.property-card:hover .img-wrapper img { transform: scale(1.08); }

.badge-status {
  position: absolute;
  top: 12px; left: 12px;
  padding: 4px 10px;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
}
.views {
  position: absolute;
  bottom: 12px; right: 12px;
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 4px 10px;
  border-radius: 1rem;
  font-size: 0.8rem;
}

.table-clean {
  margin-bottom: 0;
}
.table-clean th {
  border-top: none;
  font-weight: 600;
  color: #4b5563;
  font-size: 0.9rem;
}
.table-clean td {
  vertical-align: middle;
  font-size: 0.95rem;
}
.thumb {
  width: 45px; height: 45px;
  object-fit: cover;
  border-radius: 0.5rem;
}
.badge-sm {
  padding: 4px 10px;
  font-size: 0.75rem;
  border-radius: 1rem;
}

.modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(5px);
}
.modal-delete {
  background: white;
  border-radius: 1rem;
  width: 420px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.3);
  animation: pop .3s ease;
}
.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal-body {
  padding: 1.5rem;
  text-align: center;
}
.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #eee;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.toast-notification {
  position: fixed;
  top: 20px; right: 20px;
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  color: white;
  font-weight: 500;
  z-index: 9999;
  animation: slideIn .4s ease;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}
.toast-notification.success { background: #10b981; }
.toast-notification.error { background: #ef4444; }

@keyframes pop {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@media (max-width: 991px) {
  .main-content { margin-left: 0; }
}
</style>