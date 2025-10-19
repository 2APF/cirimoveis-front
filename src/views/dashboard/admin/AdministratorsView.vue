<template>
  <div class="min-vh-100 bg-light-custom">
    <NavbarDashComponent title="Administradores" class="mb-7" />

    <main class="main-content p-4 mt-5 py-7">
      <!-- Header com Botão Novo -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="mb-0 fw-bold text-dark">
          <i class="fas fa-user-shield me-2 text-primary"></i>
          Administradores
        </h4>
        <button @click="newAdmin" class="btn btn-primary">
          <i class="fas fa-plus me-2"></i>Novo Admin
        </button>
      </div>

      <!-- Cards Totais -->
      <div v-if="!loadingInitial" class="card shadow-sm mb-4">
        <div class="card-body">
          <div class="row g-3 text-center">
            <div class="col-md-4">
              <div class="bg-primary text-white rounded-3 p-3">
                <i class="fas fa-user-shield fa-2x mb-2"></i>
                <div class="h4 mb-0">{{ stats.total }}</div>
                <small>Total Admins</small>
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

      <!-- Tabela -->
      <div class="card shadow-sm mb-4">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-dark">
                <tr>
                  <th width="50">
                    <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" />
                  </th>
                  <th>ID</th>
                  <th>Foto</th>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>Tipo</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="loadingInitial">
                  <td colspan="9" class="text-center py-4">
                    <div class="spinner-border text-primary"></div>
                  </td>
                </tr>
                <tr v-else-if="!admins.length && !loadingInitial">
                  <td colspan="9" class="text-center py-4 text-muted">
                    <i class="fas fa-user-shield fa-3x mb-3"></i>
                    <div>Nenhum administrador encontrado</div>
                  </td>
                </tr>
                <tr v-for="admin in admins" :key="admin.id">
                  <td><input type="checkbox" v-model="selectedAdmins" :value="admin.id" /></td>
                  <td class="fw-medium">{{ admin.id }}</td>
                  <td>
                    <img 
                      v-if="admin.photo" 
                      :src="admin.photo" 
                      class="rounded-circle" 
                      width="40" 
                      height="40" 
                      alt="Foto"
                    />
                    <div v-else class="bg-secondary rounded-circle d-flex align-items-center justify-content-center" 
                         style="width: 40px; height: 40px;">
                      <i class="fas fa-user text-white"></i>
                    </div>
                  </td>
                  <td class="fw-medium">{{ admin.name }}</td>
                  <td>{{ admin.email }}</td>
                  <td>{{ admin.phone || 'N/A' }}</td>
                  <td>{{ admin.type == '0' ? 'Super Admin' : 'Admin' }}</td>
                  <td>
                    <span class="badge" :class="admin.status === '1' ? 'bg-success' : 'bg-secondary'">
                      {{ admin.status === '1' ? 'Ativo' : 'Inativo' }}
                    </span>
                  </td>
                  <td>
                    <div class="btn-group btn-group-sm">
                      <button class="btn btn-outline-primary" @click="viewAdmin(admin.id)" title="Ver">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button class="btn btn-outline-danger" @click="confirmDelete(admin.id)" title="Excluir">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="loadingMore">
                  <td colspan="9" class="text-center py-3">
                    <div class="spinner-border spinner-border-sm text-primary"></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Bulk Actions -->
      <div v-if="selectedAdmins.length" class="card shadow-sm">
        <div class="card-body py-2">
          <div class="d-flex align-items-center gap-2">
            <strong>{{ selectedAdmins.length }} selecionado(s):</strong>
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

    <!-- Modal NOVO Admin (Somente Cadastro) -->
    <div v-if="showForm" class="modal fade show d-block" style="background: rgba(0,0,0,0.5)" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-user-shield me-2"></i>Novo Administrador
            </h5>
            <button class="btn-close" @click="cancelForm"></button>
          </div>
          <form @submit.prevent="saveAdmin">
            <div class="modal-body">
              <div class="row g-3">
                <div class="col-md-12">
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label fw-medium">Nome Completo *</label>
                      <input v-model="form.name" type="text" class="form-control" required />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-medium">Telefone</label>
                      <input v-model="form.phone" type="tel" class="form-control" />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-medium">Email *</label>
                      <input v-model="form.email" type="email" class="form-control" required />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-medium">Tipo *</label>
                      <select v-model="form.type" class="form-select" required>
                        <option value="" disabled>-- Selecionar --</option>
                        <option value="0">Super Admin</option>
                        <option value="1">Admin</option>
                      </select>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-medium">Senha *</label>
                      <input v-model="form.password" type="password" class="form-control" required />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-medium">Confirmar Senha *</label>
                      <input v-model="form.confirm_password" type="password" class="form-control" required />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="cancelForm">Cancelar</button>
              <button type="submit" class="btn btn-primary">
                <i v-if="saving" class="fas fa-spinner fa-spin me-2"></i>
                Criar Admin
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal Delete -->
    <div v-if="showDeleteModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5)">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirmar Exclusão</h5>
            <button class="btn-close" @click="showDeleteModal = false"></button>
          </div>
          <div class="modal-body">
            <p>Excluir {{ deleteCount }} administrador(es)?</p>
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

interface Admin {
  id: number
  name: string
  email: string
  phone: string | null
  photo: string | null
  status: string
  type: string
  created_at: string
}

interface Stats { total: number; active: number; inactive: number }

const admins = ref<Admin[]>([])
const stats = ref<Stats>({ total: 0, active: 0, inactive: 0 })
const notification = ref({ message: '', type: 'success' })

// Form (Somente Novo)
const showForm = ref(false)
const form = ref({
  name: '',
  email: '',
  phone: '',
  type: '',
  password: '',
  status: '1',
  confirm_password: ''
})

// States
const loadingInitial = ref(false)
const loadingMore = ref(false)
const page = ref(1)
const hasMore = ref(true)
const observer = ref<IntersectionObserver | null>(null)
const selectedAdmins = ref<number[]>([])
const selectAll = ref(false)
const showDeleteModal = ref(false)
const deleteIds = ref<number[]>([])
const saving = ref(false)

const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cirimoveis.com/api/v1'

// Utils
const formatDate = (date: string) => new Date(date).toLocaleDateString('pt-AO')
const deleteCount = computed(() => deleteIds.value.length)

// API
const apiCall = async (params: any) => {
  const token = Cookies.get('token')
  const { data } = await axios.get(`${API_URL}/admins`, { 
    params, 
    headers: { Authorization: `Bearer ${token}` } 
  })
  return data
}

const fetchAdmins = async (reset = true) => {
  if (reset) {
    loadingInitial.value = true
    page.value = 1
    admins.value = []
    hasMore.value = true
  } else loadingMore.value = true

  try {
    const params = { page: page.value, per_page: 15 }
    const { data: newAdmins, meta, stats: newStats } = await apiCall(params)
    
    if (reset) {
      admins.value = newAdmins
      stats.value = newStats
    } 
    // else admins.value.push(...newAdmins)

    page.value++
    hasMore.value = newAdmins.length === meta.per_page

  } catch (error) {
    showNotification('Erro ao carregar', 'danger')
  } finally {
    loadingInitial.value = false
    loadingMore.value = false
  }
}

// Scroll
const loadMore = () => hasMore.value && !loadingMore.value && fetchAdmins(false)
const initScroll = () => {
  observer.value = new IntersectionObserver(([e]) => e.isIntersecting && loadMore(), { threshold: 0.1 })
  nextTick(() => observer.value?.observe(document.querySelector('.table-responsive')!.lastElementChild!))
}


const newAdmin = () => {
  form.value = {
    name: '', email: '', phone: '', password: '', type: '', status: '1', confirm_password: ''
  }
  showForm.value = true
}

const saveAdmin = async () => {
  if (!form.value.name || !form.value.email || !form.value.password || !form.value.confirm_password) {
    return showNotification('Preencha todos os campos obrigatórios', 'danger')
  }

  if (form.value.password !== form.value.confirm_password) {
    return showNotification('As senhas não coincidem', 'danger')
  }

  saving.value = true
  try {
    const token = Cookies.get('token')
    const formData = new FormData()
    formData.append('name', form.value.name)
    formData.append('email', form.value.email)
    formData.append('phone', form.value.phone || '')
    formData.append('type', form.value.type)
    formData.append('password', form.value.password)
    formData.append('confirm_password', form.value.confirm_password)
    // if (form.value.photoFile) formData.append('photo', form.value.photoFile)

    await fetch(`${API_URL}/admin/create`, { 
      method: 'POST', 
      headers: { Authorization: `Bearer ${token}` }, 
      body: formData
    })

    showNotification('Administrador(a) criado(a) com sucesso!', 'success')
    showForm.value = false
    fetchAdmins(true)

  } catch (error) {
    showNotification('Erro ao criar administrador(a)', 'danger')
  } finally {
    saving.value = false
  }
}

const cancelForm = () => {
  showForm.value = false
}

// Other Actions
const toggleSelectAll = () => selectedAdmins.value = selectAll.value ? admins.value.map(a => a.id) : []
const viewAdmin = (id: number) => router.push({ name: 'app.dash.admin.view', params: { id: id.toString() } })
const confirmDelete = (id: number) => { deleteIds.value = [id]; showDeleteModal.value = true }
const bulkDelete = () => { deleteIds.value = [...selectedAdmins.value]; showDeleteModal.value = true }

const performDelete = async () => {
  try {
    const token = Cookies.get('token')
    await fetch(`${API_URL}/admins/delete`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: deleteIds.value })
    })
    showNotification(`${deleteCount.value} excluído(s)!`, 'success')
    showDeleteModal.value = false
    selectedAdmins.value = []
    selectAll.value = false
    fetchAdmins(true)
  } catch (error) {
    showNotification('Erro ao excluir', 'danger')
  }
}

const bulkStatus = async (status: number) => {
  try {
    const token = Cookies.get('token')
    await fetch(`${API_URL}/admins/status`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: selectedAdmins.value, status })
    })
    showNotification(`${selectedAdmins.value.length} ${status ? 'ativado' : 'inativado'}!`, 'success')
    selectedAdmins.value = []
    selectAll.value = false
    fetchAdmins(true)
  } catch (error) {
    showNotification('Erro ao alterar status', 'danger')
  }
}

const showNotification = (msg: string, type: 'success' | 'danger' = 'success') => {
  notification.value = { message: msg, type }
  setTimeout(() => notification.value.message = '', 3000)
}

// Lifecycle
onMounted(() => {
  const token = Cookies.get('token')
  if (!token) return router.push({ name: 'auth.login' })
  fetchAdmins(true)
  nextTick(initScroll)
})

onUnmounted(() => observer.value?.disconnect())
</script>

<style scoped>
:root {
  --primary-red: #e63946; --soft-red: rgba(230,57,70,0.1);
  --secondary-red: #c92c39; --light-bg: #f8fafc;
  --text-dark: #1a1a1a; --text-muted: #6b7280;
}

.bg-light-custom { background-color: var(--light-bg); }
.main-content { margin-left: 250px; transition: margin-left 0.3s; }

.card { background: white; border: none; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
.table-dark { background: linear-gradient(135deg, var(--primary-red), var(--secondary-red)); }
.table th { border-top: none; font-weight: 600; color: white; }
.table td { vertical-align: middle; }

.form-label { color: var(--primary-red); font-size: 0.85rem; font-weight: 500; }
.form-control, .form-select { 
  border: 1px solid var(--soft-red); border-radius: 8px; padding: 0.5rem 1rem; 
}
.form-control:focus, .form-select:focus { 
  border-color: var(--primary-red); box-shadow: 0 0 0 3px var(--soft-red); 
}

.btn-primary { background: var(--primary-red); border-color: var(--primary-red); }
.btn-primary:hover { background: var(--secondary-red); }

.badge { font-size: 0.75rem; padding: 0.35em 0.65em; }
.btn-group-sm .btn { padding: 0.25rem 0.5rem; font-size: 0.75rem; }

.alert { z-index: 1050; animation: fadeIn 0.3s; border-radius: 8px; }

@media (max-width: 768px) {
  .main-content { margin-left: 0; padding: 1rem; }
  .row.g-3 > * { flex: 0 0 100%; max-width: 100%; }
  .btn-group { flex-direction: column; gap: 2px; }
}

@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
</style>