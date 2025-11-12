<template>
  <div class="min-vh-100 bg-light-custom">
    <NavbarDashComponent title="Gestores" class="mb-7" />

    <main class="main-content p-4 mt-5 py-7">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="mb-0 fw-bold text-dark">
          <i class="fas fa-user-shield me-2 text-danger"></i>
          Gestores
        </h4>
        <button @click="newAdmin" class="btn btn-danger">
          <i class="fas fa-plus me-2"></i>Novo Admin
        </button>
      </div>

      <div v-if="!loadingInitial" class="card shadow-sm mb-4">
        <div class="card-body">
          <div class="row g-3 text-center">
            <div class="col-md-4">
              <div class="bg-danger text-white rounded-3 p-3">
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

      <div class="card shadow-sm mb-4">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-dark">
                <tr>
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
                  <td colspan="8" class="text-center py-4">
                    <div class="spinner-border text-danger"></div>
                  </td>
                </tr>
                <tr v-else-if="!admins.length && !loadingInitial">
                  <td colspan="8" class="text-center py-4 text-muted">
                    <i class="fas fa-user-shield fa-3x mb-3"></i>
                    <div>Nenhum Gestor encontrado</div>
                  </td>
                </tr>
                <tr v-for="(admin, index) in admins" :key="admin.id">
                  <td class="fw-medium">{{ index + 1 }}</td>
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
                  <td>{{ admin.type == '0' ? 'Gestor' : 'Comercial' }}</td>
                  <td>
                    <span class="badge" :class="admin.status === '1' ? 'bg-success' : 'bg-secondary'">
                      {{ admin.status === '1' ? 'Ativo' : 'Inativo' }}
                    </span>
                  </td>
                  <td>
                    <div class="btn-group btn-group-sm">
                      <button class="btn btn-outline-danger" @click="editAdmin(admin)" title="Editar">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button class="btn btn-outline-danger" @click="confirmDelete(admin)" title="Excluir">
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

    <div v-if="showForm" class="modal fade show d-block" style="background: rgba(0,0,0,0.5)" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content rounded-4">
          <div class="modal-header text-white rounded-top-4">
            <h5 class="modal-title mb-0 text-danger">
              <i class="fas fa-user-shield me-2"></i>
              {{ isEdit ? 'Editar Gestor(a)' : 'Novo(a) Gestor(a)' }}
            </h5>
            <button class="btn-close btn-close-white" @click="cancelForm"></button>
          </div>
          <form @submit.prevent="saveAdmin">
            <div class="modal-body p-4">
              <div class="row g-4">
                <div class="col-md-6">
                  <label class="form-label small fw-medium text-danger">Nome Completo *</label>
                  <input v-model="form.name" type="text" class="form-control" required />
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-medium text-danger">Telefone</label>
                  <input v-model="form.phone" type="tel" class="form-control" />
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-medium text-danger">Email *</label>
                  <input v-model="form.email" type="email" class="form-control" :disabled="isEdit" required />
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-medium text-danger">Tipo *</label>
                  <select v-model="form.type" class="form-select" required>
                    <option value="" disabled>-- Selecionar --</option>
                    <option value="0">Gestor</option>
                    <option value="1">Comercial</option>
                  </select>
                </div>
                <div v-if="!isEdit" class="col-md-6">
                  <label class="form-label small fw-medium text-danger">Senha *</label>
                  <input v-model="form.password" type="password" class="form-control" required />
                </div>
                <div v-if="!isEdit" class="col-md-6">
                  <label class="form-label small fw-medium text-danger">Confirmar Senha *</label>
                  <input v-model="form.confirm_password" type="password" class="form-control" required />
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-medium text-danger">Status</label>
                  <select v-model="form.status" class="form-select">
                    <option value="1">Ativo</option>
                    <option value="0">Inativo</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="modal-footer bg-light rounded-bottom-4">
              <button type="button" class="btn btn-outline-secondary" @click="cancelForm">Cancelar</button>
              <button type="submit" class="btn btn-danger" :disabled="saving">
                <i v-if="saving == true" class="fas fa-spinner fa-spin me-2"></i>
                {{ isEdit ? 'Salvar Alterações' : 'Criar Gestor(a)' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

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
              Deseja realmente excluir o gestor <strong class="text-danger">{{ deleteName }}</strong>?
            </p>
            <p v-else>
              Deseja realmente excluir <strong class="text-danger">{{ deleteCount }} gestores</strong>?
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

interface Admin {
  id: number
  name: string
  email: string
  phone: string | null
  photo: string | null
  status: string
  type: string
}

interface Stats { total: number; active: number; inactive: number }

const admins = ref<Admin[]>([])
const stats = ref<Stats>({ total: 0, active: 0, inactive: 0 })
const notification = ref<{ message: string; type: 'success' | 'danger' }>({ message: '', type: 'success' })

const showForm = ref(false)
const isEdit = ref(false)
const form = ref({
  id: 0,
  name: '',
  email: '',
  phone: '',
  type: '',
  password: '',
  status: '1',
  confirm_password: ''
})

const loadingInitial = ref(false)
const loadingMore = ref(false)
const page = ref(1)
const hasMore = ref(true)
const observer = ref<IntersectionObserver | null>(null)
const showDeleteModal = ref(false)
const deleteIds = ref<number[]>([])
const deleteNames = ref<string[]>([])
const saving = ref(false)

const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cirimoveis.com/api/v1'

const deleteCount = computed(() => deleteIds.value.length)
const deleteName = computed(() => deleteNames.value[0] || '')

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

    page.value++
    hasMore.value = newAdmins.length === meta.per_page

  } catch {
    showNotification('Erro ao carregar gestores', 'danger')
  } finally {
    loadingInitial.value = false
    loadingMore.value = false
  }
}

const loadMore = () => hasMore.value && !loadingMore.value && fetchAdmins(false)
const initScroll = () => {
  observer.value = new IntersectionObserver(([e]) => e.isIntersecting && loadMore(), { threshold: 0.1 })
  nextTick(() => observer.value?.observe(document.querySelector('.table-responsive')!.lastElementChild!))
}

const newAdmin = () => {
  isEdit.value = false
  form.value = {
    id: 0, name: '', email: '', phone: '', password: '', type: '', status: '1', confirm_password: ''
  }
  showForm.value = true
}

const editAdmin = (admin: Admin) => {
  isEdit.value = true
  form.value = {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    phone: admin.phone || '',
    type: admin.type,
    password: '',
    status: admin.status,
    confirm_password: ''
  }
  showForm.value = true
}

const saveAdmin = async () => {
  if (!form.value.name || !form.value.email || (!isEdit.value && !form.value.password)) {
    return showNotification('Preencha todos os campos obrigatórios', 'danger')
  }

  if (!isEdit.value && form.value.password !== form.value.confirm_password) {
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
    formData.append('status', form.value.status)
    if (!isEdit.value) {
      formData.append('password', form.value.password)
      formData.append('confirm_password', form.value.confirm_password)
    }


    const url = isEdit.value ? `${API_URL}/admin/update/${form.value.id}` : `${API_URL}/admin/create`
   

    // console.log('Enviando dados para:', formData, method, url, form.value)
    await fetch(url, { 
      method: 'POST', 
      headers: { Authorization: `Bearer ${token}` }, 
      body: formData
    })

    showNotification(isEdit.value ? 'Gestor atualizado com sucesso!' : 'Gestor criado com sucesso!', 'success')
    showForm.value = false
    fetchAdmins(true)

  } catch {
    showNotification(isEdit.value ? 'Erro ao atualizar gestor' : 'Erro ao criar gestor', 'danger')
  } finally {
    saving.value = false
  }
}

const cancelForm = () => showForm.value = false

const confirmDelete = (admin: Admin) => {
  deleteIds.value = [admin.id]
  deleteNames.value = [admin.name]
  showDeleteModal.value = true
}

const performDelete = async () => {
  try {
    const token = Cookies.get('token')
    await fetch(`${API_URL}/admin/delete/${deleteIds.value[0]}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: deleteIds.value[0] })
    })
    showNotification(`"${deleteNames.value.join(', ')}" excluído com sucesso!`, 'success')
    showDeleteModal.value = false
    deleteIds.value = []
    deleteNames.value = []
    fetchAdmins(true)
  } catch {
    showNotification('Erro ao excluir gestor', 'danger')
  }
}

const showNotification = (msg: string, type: 'success' | 'danger' = 'success') => {
  notification.value = { message: msg, type }
  setTimeout(() => {
    notification.value.message = ''
  }, 3000)
}

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