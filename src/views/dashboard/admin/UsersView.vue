<template>
  <div class="min-vh-100 bg-light-custom">
    <NavbarDashComponent title="Lista de Usuários" class="mb-7" />

    <main class="main-content p-4 mt-5 py-7">
 
  <!-- Cards Totais -->
      <div v-if="!loadingInitial" class="card shadow-sm mb-4">
        <div class="card-body">
          <div class="row g-3 text-center">
            <div class="col-md-4">
              <div class="bg-primary text-white rounded-3 p-3">
                <i class="fas fa-user-shield fa-2x mb-2"></i>
                <div class="h4 mb-0">{{ stats.total }}</div>
                <small>Total Usuários</small>
              </div>
            </div>
            <div class="col-md-4">
              <div class="bg-success text-white rounded-3 p-3">
                <i class="fas fa-check-circle fa-2x mb-2"></i>
                <div class="h4 mb-0">{{ stats.active }}</div>
                <small>Ativos</small>
              </div>
            </div>
            <div class="col-md-4">
              <div class="bg-secondary text-white rounded-3 p-3">
                <i class="fas fa-times-circle fa-2x mb-2"></i>
                <div class="h4 mb-0">{{ stats.inactive }}</div>
                <small>Inativos</small>
              </div>
            </div>
          </div>
        </div>
      </div>


      <!-- Filtros -->
      <div class="card shadow-sm mb-4">
        <div class="card-body">
          <div class="row g-3 align-items-end">
            <div class="col-md-3">
              <label class="form-label small fw-medium">Nome/Email/Telefone</label>
              <input v-model="filters.search" 
                type="text" 
                class="form-control" 
                placeholder="Pesquisar usuário..."
                @keyup.enter="() => fetchUsers()"
              />
            </div>
            <div class="col-md-2">
              <label class="form-label small fw-medium">Data Inicial</label>
              <input 
                v-model="filters.date_from" 
                type="date" 
                class="form-control" 
                max="2025-12-31"
              />
            </div>
            <div class="col-md-2">
              <label class="form-label small fw-medium">Data Final</label>
              <input 
                v-model="filters.date_to" 
                type="date" 
                class="form-control" 
                max="2025-12-31"
              />
            </div>
            <div class="col-md-2">
              <label class="form-label small fw-medium">Status</label>
              <select v-model="filters.status" class="form-select">
                <option value="">Todos</option>
                <option value="1">Ativo</option>
                <option value="0">Inativo</option>
              </select>
            </div>
            <div class="col-md-3">
              <button @click="() => fetchUsers()" class="btn btn-primary me-2">
                <i class="fas fa-search me-1"></i>Filtrar
              </button>
              <button @click="clearFilters" class="btn btn-outline-secondary">
                Limpar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabela -->
      <div class="card shadow-sm">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-dark">
                <tr>
                  <th width="50">
                    <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" />
                  </th>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>Tipo</th>
                  <th>Data</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="loadingInitial">
                  <td colspan="9" class="text-center py-4">
                    <div class="spinner-border text-primary" role="status"></div>
                  </td>
                </tr>
                <tr v-else-if="!users.length && !loadingInitial">
                  <td colspan="9" class="text-center py-4 text-muted">
                    <i class="fas fa-users fa-2x mb-2"></i>
                    <div>Nenhum usuário encontrado</div>
                  </td>
                </tr>
                <tr v-for="user in users" :key="user.id">
                  <td><input type="checkbox" v-model="selectedUsers" :value="user.id" /></td>
                  <td class="fw-medium">{{ user.id }}</td>
                  <td class="fw-medium">{{ user.name }}</td>
                  <td>{{ user.email }}</td>
                  <td>{{ user.phone || 'N/A' }}</td>
                  <td>
                    <span class="badge" :class="getTypeBadge(user.type)">
                      {{ getTypeLabel(user.type) }}
                    </span>
                  </td>
                  <td>{{ formatDate(user.created_at) }}</td>
                  <td>
                    <span class="badge" :class="user.status === '1' ? 'bg-success' : 'bg-secondary'">
                      {{ user.status === '1' ? 'Ativo' : 'Inativo' }}
                    </span>
                  </td>
                  <td>
                    <div class="btn-group btn-group-sm">
                      <button class="btn btn-outline-primary" @click="viewUser(user.id)" title="Ver">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button class="btn btn-outline-warning" @click="editUser(user.id)" title="Editar">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button class="btn btn-outline-danger" @click="confirmDelete(user.id)" title="Excluir">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="loadingMore">
                  <td colspan="9" class="text-center py-3">
                    <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Bulk Actions -->
      <div v-if="selectedUsers.length" class="card shadow-sm mt-3">
        <div class="card-body py-2">
          <div class="d-flex align-items-center gap-2">
            <strong>{{ selectedUsers.length }} selecionado(s):</strong>
            <button class="btn btn-outline-danger btn-sm" @click="bulkDelete">
              <i class="fas fa-trash me-1"></i>Excluir
            </button>
            <button class="btn btn-outline-warning btn-sm" @click="bulkStatus(1)">
              <i class="fas fa-check me-1"></i>Ativar
            </button>
            <button class="btn btn-outline-secondary btn-sm" @click="bulkStatus(0)">
              <i class="fas fa-times me-1"></i>Inativar
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal Delete -->
    <div v-if="showDeleteModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5)">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirmar Exclusão</h5>
            <button class="btn-close" @click="showDeleteModal = false"></button>
          </div>
          <div class="modal-body">
            <p>Excluir {{ deleteCount }} usuário(s)?</p>
            <p class="text-danger small">Esta ação não pode ser desfeita.</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="showDeleteModal = false">Cancelar</button>
            <button class="btn btn-danger" @click="performDelete">Excluir</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Notificação -->
    <div v-if="notification.message" class="position-fixed top-0 end-0 m-3 alert alert-sm z-1050"
      :class="notification.type === 'success' ? 'alert-success' : 'alert-danger'">
      <i :class="`fas fa-${notification.type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2`"></i>
      {{ notification.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import NavbarDashComponent from '@/components/NavbarDashComponent.vue'
import Cookies from 'js-cookie'
import axios from 'axios'

const router = useRouter()

interface User {
  id: number
  name: string
  email: string
  phone: string | null
  type: string
  status: string
  created_at: string
}

interface Stats {
  total: number
  active: number
  inactive: number
}

const users = ref<User[]>([])
const filters = ref({ search: '', date_from: '', date_to: '', status: '' })
const notification = ref({ message: '', type: 'success' })
const showDeleteModal = ref(false)
const deleteIds = ref<number[]>([])
const selectedUsers = ref<number[]>([])
const selectAll = ref(false)
const stats = ref<Stats>({ total: 0, active: 0, inactive: 0 })

const loadingInitial = ref(false)
const loadingMore = ref(false)
const page = ref(1)
const hasMore = ref(true)
const observer = ref<IntersectionObserver | null>(null)

const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cirimoveis.com/api/v1'

// Utils
const getTypeBadge = (type: string) => type === '0' ? 'bg-primary' : type === '1' ? 'bg-warning' : 'bg-success'
const getTypeLabel = (type: string) => type === '0' ? 'Admin' : type === '1' ? 'Agente' : 'Cliente'
const formatDate = (date: string) => new Date(date).toLocaleDateString('pt-AO')
const deleteCount = computed(() => deleteIds.value.length)

// API
const apiCall = async (params: any) => {
  const token = Cookies.get('token')
  const { data } = await axios.get(`${API_URL}/users`, { 
    params, 
    headers: { Authorization: `Bearer ${token}` } 
  })
  return data
}

const fetchUsers = async (reset = true) => {
  if (reset) {
    loadingInitial.value = true
    page.value = 1
    users.value = []
    hasMore.value = true
  } else {
    loadingMore.value = true
  }

  try {
    const params: any = {
      page: page.value,
      per_page: 15,
      ...filters.value
    }

    const { data: newUsers, meta, stats: newStats } = await apiCall(params)
    
    if (reset) {
      users.value = newUsers
      stats.value = newStats
    }

    page.value++
    hasMore.value = newUsers.length === meta.per_page

  } catch (error) {
    showNotification('Erro ao carregar usuários', 'danger')
  } finally {
    loadingInitial.value = false
    loadingMore.value = false
  }
}

// Scroll Infinito
const loadMore = () => {
  if (hasMore.value && !loadingMore.value) {
    fetchUsers(false)
  }
}

const initScroll = () => {
  observer.value = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) loadMore()
    },
    { threshold: 0.1 }
  )

  const sentinel = document.querySelector('.table-responsive')?.lastElementChild
  if (sentinel && observer.value) {
    observer.value.observe(sentinel)
  }
}

// Actions
const clearFilters = () => {
  filters.value = { search: '', date_from: '', date_to: '', status: '' }
  fetchUsers(true)
}

const toggleSelectAll = () => {
  selectedUsers.value = selectAll.value ? users.value.map(u => u.id) : []
}

const viewUser = (id: number) => router.push({ name: 'app.dash.user.view', params: { id: id.toString() } })
const editUser = (id: number) => router.push({ name: 'app.dash.user.edit', params: { id: id.toString() } })

const confirmDelete = (id: number) => {
  deleteIds.value = [id]
  showDeleteModal.value = true
}

const bulkDelete = () => {
  deleteIds.value = [...selectedUsers.value]
  showDeleteModal.value = true
}

const performDelete = async () => {
  try {
    const token = Cookies.get('token')
    await fetch(`${API_URL}/users/delete`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ids: deleteIds.value })
    })

    showNotification(`${deleteCount.value} excluído(s)!`, 'success')
    showDeleteModal.value = false
    deleteIds.value = []
    selectedUsers.value = []
    selectAll.value = false
    fetchUsers(true)

  } catch (error) {
    showNotification('Erro ao excluir', 'danger')
  }
}

const bulkStatus = async (status: number) => {
  try {
    const token = Cookies.get('token')
    await fetch(`${API_URL}/users/status`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ids: selectedUsers.value, status })
    })

    const action = status === 1 ? 'ativado(s)' : 'inativado(s)'
    showNotification(`${selectedUsers.value.length} ${action}!`, 'success')
    selectedUsers.value = []
    selectAll.value = false
    fetchUsers(true)

  } catch (error) {
    showNotification('Erro ao alterar status', 'danger')
  }
}

const showNotification = (message: string, type: 'success' | 'danger' = 'success') => {
  notification.value = { message, type }
  setTimeout(() => notification.value.message = '', 3000)
}

// Lifecycle
onMounted(() => {
  const token = Cookies.get('token')
  if (!token) return router.push({ name: 'auth.login' })
  
  fetchUsers(true)
  nextTick(initScroll)
})

onUnmounted(() => {
  if (observer.value) observer.value.disconnect()
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

.card { 
  background: white; 
  border: none; 
  border-radius: 12px; 
  box-shadow: 0 4px 20px rgba(0,0,0,0.08); 
}

.form-label { 
  color: var(--primary-red); 
  font-size: 0.85rem; 
  font-weight: 500; 
}

.form-control, .form-select { 
  border: 1px solid var(--soft-red); 
  border-radius: 8px; 
  padding: 0.5rem 1rem; 
}
.form-control:focus, .form-select:focus { 
  border-color: var(--primary-red); 
  box-shadow: 0 0 0 3px var(--soft-red); 
}

.btn-primary { 
  background: var(--primary-red); 
  border-color: var(--primary-red); 
}
.btn-primary:hover { background: var(--secondary-red); }

.table { font-size: 0.9rem; }
.table-dark { 
  background: linear-gradient(135deg, var(--primary-red), var(--secondary-red)); 
}
.table th { border-top: none; font-weight: 600; color: white; }
.table td { vertical-align: middle; }

.badge { font-size: 0.75rem; padding: 0.35em 0.65em; }
.btn-group-sm .btn { padding: 0.25rem 0.5rem; font-size: 0.75rem; }

.alert { 
  z-index: 1050; 
  animation: fadeIn 0.3s ease; 
  border-radius: 8px; 
}

@media (max-width: 768px) {
  .main-content { margin-left: 0; padding: 1rem; }
  .row.g-3 > * { flex: 0 0 100%; max-width: 100%; }
  .btn-group { flex-direction: column; gap: 2px; }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>