<template>
  <div class="min-vh-100 bg-light-custom">
    <NavbarDashComponent title="Lista de Usuários" class="mb-7" />

    <main class="main-content p-4 mt-5 py-7">
 
      <!-- Cards Totais -->
      <div v-if="!loadingInitial" class="card shadow-sm mb-4">
        <div class="card-body">
          <div class="row g-3 text-center">
            <div class="col-md-4">
              <div class="bg-danger text-white rounded-3 p-3">
                <i class="fas fa-users fa-2x mb-2"></i>
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
              <label class="form-label small fw-medium text-danger">Nome/Email/Telefone</label>
              <input v-model="filters.search" 
                type="text" 
                class="form-control" 
                placeholder="Pesquisar usuário..."
                @keyup.enter="() => fetchUsers(true)"
              />
            </div>
            <div class="col-md-2">
              <label class="form-label small fw-medium text-danger">Data Inicial</label>
              <input 
                v-model="filters.date_from" 
                type="date" 
                class="form-control" 
                max="2025-12-31"
              />
            </div>
            <div class="col-md-2">
              <label class="form-label small fw-medium text-danger">Data Final</label>
              <input 
                v-model="filters.date_to" 
                type="date" 
                class="form-control" 
                max="2025-12-31"
              />
            </div>
            <div class="col-md-2">
              <label class="form-label small fw-medium text-danger">Status</label>
              <select v-model="filters.status" class="form-select">
                <option value="">Todos</option>
                <option value="1">Ativo</option>
                <option value="0">Inativo</option>
              </select>
            </div>
            <div class="col-md-3">
              <button @click="() => fetchUsers(true)" class="btn btn-danger me-2">
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
                  <td colspan="8" class="text-center py-4">
                    <div class="spinner-border text-danger"></div>
                  </td>
                </tr>
                <tr v-else-if="!users.length && !loadingInitial">
                  <td colspan="8" class="text-center py-4 text-muted">
                    <i class="fas fa-users fa-3x mb-3"></i>
                    <div>Nenhum usuário encontrado</div>
                  </td>
                </tr>
                <tr v-for="(user, index) in users" :key="user.id">
                  <td class="fw-medium">{{ index + 1 }}</td>
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
                      <button class="btn btn-outline-danger" @click="editUser(user)" title="Editar">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button class="btn btn-outline-danger" @click="confirmDelete(user)" title="Excluir">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="loadingMore">
                  <td colspan="8" class="text-center py-3">
                    <div class="spinner-border spinner-border-sm text-danger"></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal Editar -->
    <div v-if="showEditModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5)" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content rounded-4">
          <div class="modal-header bg-danger text-white rounded-top-4">
            <h5 class="modal-title mb-0">
              <i class="fas fa-edit me-2"></i>
              Editar Usuário
            </h5>
            <button class="btn-close btn-close-white" @click="showEditModal = false"></button>
          </div>
          <form @submit.prevent="saveUser">
            <div class="modal-body p-4">
              <div class="row g-4">
                <div class="col-md-6">
                  <label class="form-label small fw-medium text-danger">Nome Completo *</label>
                  <input v-model="editForm.name" type="text" class="form-control" required />
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-medium text-danger">Telefone</label>
                  <input v-model="editForm.phone" type="tel" class="form-control" />
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-medium text-danger">Email *</label>
                  <input v-model="editForm.email" type="email" class="form-control" required />
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-medium text-danger">Status</label>
                  <select v-model="editForm.status" class="form-select">
                    <option value="1">Ativo</option>
                    <option value="0">Inativo</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="modal-footer bg-light rounded-bottom-4">
              <button type="button" class="btn btn-outline-secondary" @click="showEditModal = false">Cancelar</button>
              <button type="submit" class="btn btn-danger" :disabled="saving">
                <i v-if="saving" class="fas fa-spinner fa-spin me-2"></i>
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal Delete -->
    <div v-if="showDeleteModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5)">
      <div class="modal-dialog">
        <div class="modal-content rounded-4">
          <div class="modal-header bg-danger text-white rounded-top-4">
            <h5 class="modal-title mb-0">
              <i class="fas fa-exclamation-triangle me-2"></i>
              Confirmar Exclusão
            </h5>
            <button class="btn-close btn-close-white" @click="showDeleteModal = false"></button>
          </div>
          <div class="modal-body">
            <p v-if="deleteCount === 1">
              Deseja realmente excluir o usuário <strong class="text-danger">{{ deleteName }}</strong>?
            </p>
            <p v-else>
              Deseja realmente excluir <strong class="text-danger">{{ deleteCount }} usuários</strong>?
            </p>
            <p class="text-muted small">Esta ação não pode ser desfeita.</p>
          </div>
          <div class="modal-footer bg-light rounded-bottom-4">
            <button class="btn btn-outline-secondary" @click="showDeleteModal = false">Cancelar</button>
            <button class="btn btn-danger" @click="performDelete">
              <i class="fas fa-trash me-1"></i>Excluir
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Notificação -->
    <div v-if="notification.message" class="position-fixed top-0 end-0 m-3 alert alert-sm z-1050 shadow-lg"
      :class="notification.type === 'success' ? 'alert-success border-success' : 'alert-danger border-danger'">
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
const notification = ref({ message: '', type: 'success' as 'success' | 'danger' })
const showDeleteModal = ref(false)
const deleteIds = ref<number[]>([])
const deleteNames = ref<string[]>([])
const stats = ref<Stats>({ total: 0, active: 0, inactive: 0 })

const showEditModal = ref(false)
const saving = ref(false)
const editForm = ref({
  id: 0,
  name: '',
  email: '',
  phone: '',
  status: '1'
})

const loadingInitial = ref(false)
const loadingMore = ref(false)
const page = ref(1)
const hasMore = ref(true)
const observer = ref<IntersectionObserver | null>(null)

const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cirimoveis.com/api/v1'

const deleteCount = computed(() => deleteIds.value.length)
const deleteName = computed(() => deleteNames.value[0] || '')

const getTypeBadge = (type: string) => {
  return type === '0' ? 'bg-danger' : type === '1' ? 'bg-warning text-dark' : 'bg-success'
}
const getTypeLabel = (type: string) => {
  return type === '0' ? 'Admin' : type === '1' ? 'Agente' : 'Cliente'
}
const formatDate = (date: string) => new Date(date).toLocaleDateString('pt-AO')

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

  } catch {
    showNotification('Erro ao carregar usuários', 'danger')
  } finally {
    loadingInitial.value = false
    loadingMore.value = false
  }
}

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

  nextTick(() => {
    const sentinel = document.querySelector('.table-responsive')?.lastElementChild
    if (sentinel && observer.value) {
      observer.value.observe(sentinel)
    }
  })
}

const clearFilters = () => {
  filters.value = { search: '', date_from: '', date_to: '', status: '' }
  fetchUsers(true)
}

const editUser = (user: User) => {
  editForm.value = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    status: user.status
  }
  showEditModal.value = true
}

const saveUser = async () => {
  if (!editForm.value.name || !editForm.value.email) {
    return showNotification('Nome e email são obrigatórios', 'danger')
  }

  saving.value = true
  try {
    const token = Cookies.get('token')
    const formData = new FormData()
    formData.append('name', editForm.value.name)
    formData.append('email', editForm.value.email)
    formData.append('phone', editForm.value.phone || '')
    formData.append('status', editForm.value.status)

    await fetch(`${API_URL}/user/update/${editForm.value.id}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    })

    showNotification('Usuário atualizado com sucesso!', 'success')
    showEditModal.value = false
    fetchUsers(true)

  } catch {
    showNotification('Erro ao atualizar usuário', 'danger')
  } finally {
    saving.value = false
  }
}

const confirmDelete = (user: User) => {
  deleteIds.value = [user.id]
  deleteNames.value = [user.name]
  showDeleteModal.value = true
}

const performDelete = async () => {
  try {
    const token = Cookies.get('token')
    await fetch(`${API_URL}/user/delete/${deleteIds.value[0]}`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    showNotification(`"${deleteName.value}" excluído com sucesso!`, 'success')
    showDeleteModal.value = false
    deleteIds.value = []
    deleteNames.value = []
    fetchUsers(true)

  } catch {
    showNotification('Erro ao excluir usuário', 'danger')
  }
}

const showNotification = (message: string, type: 'success' | 'danger' = 'success') => {
  notification.value = { message, type }
  setTimeout(() => notification.value.message = '', 4000)
}

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
  --soft-red: rgba(230,57,70,0.1);
  --secondary-red: #c92c39;
  --light-bg: #f8fafc;
  --text-dark: #1a1a1a;
  --text-muted: #6b7280;
}

.bg-light-custom { background-color: var(--light-bg); }
.main-content { margin-left: 250px; transition: margin-left 0.3s ease; }

.card { 
  background: #ffffff; 
  border: none; 
  border-radius: 16px; 
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08); 
  overflow: hidden;
}
.card:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12); }

.table-dark { background: linear-gradient(135deg, var(--primary-red), var(--secondary-red)); }
.table th { border-top: none; font-weight: 600; color: white; }
.table td { vertical-align: middle; }

.form-label { 
  color: var(--primary-red); 
  font-size: 0.85rem; 
  font-weight: 600; 
  margin-bottom: 0.5rem;
}
.form-control, .form-select { 
  border: 2px solid var(--soft-red); 
  border-radius: 10px; 
  font-size: 0.95rem; 
  padding: 0.75rem 1rem; 
  background: #fafbfc;
}
.form-control:focus, .form-select:focus { 
  border-color: var(--primary-red); 
  box-shadow: 0 0 0 4px rgba(230, 57, 70, 0.15); 
  background: #fff;
}

.btn-danger { 
  background: var(--primary-red);
  border: none; 
  font-weight: 600; 
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(230, 57, 70, 0.3);
}
.btn-danger:hover { 
  transform: translateY(-1px); 
  box-shadow: 0 6px 20px rgba(230, 57, 70, 0.4);
}

.btn-outline-danger { 
  border: 2px solid var(--primary-red); 
  color: var(--primary-red); 
  border-radius: 10px;
}
.btn-outline-danger:hover { 
  background: var(--primary-red); 
  color: white;
}

.badge { font-size: 0.75rem; padding: 0.35em 0.65em; }
.btn-group-sm .btn { padding: 0.25rem 0.5rem; font-size: 0.75rem; }

.alert { 
  z-index: 1050; 
  font-size: 0.9rem; 
  padding: 1rem 1.5rem; 
  border-radius: 10px; 
  animation: slideInRight 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.modal-content { 
  border-radius: 16px; 
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2); 
  border: none;
}

@media (max-width: 768px) {
  .main-content { margin-left: 0; padding: 1rem; }
  .row.g-4 > * { flex: 0 0 100%; max-width: 100%; }
}

@keyframes slideInRight {
  from { opacity: 0; transform: translateX(100%); }
  to { opacity: 1; transform: translateX(0); }
}
</style>