<template>
  <main class="main profile-page" id="top">
    <NavbarComponent />

    <section class="profile-section">
      <div class="container">



        <div class="profile-content">
          <div class="row">
            <div class="col-lg-8">
              <div class="profile-card">
                <div class="card-header">
                  <h2><i class="fas fa-user-edit me-2"></i>Informações Pessoais</h2>
                </div>
                <div class="card-body">
                  <form @submit.prevent="updateProfile" class="profile-form">
                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group mt-3">
                          <label for="name">Nome Completo *</label>
                          <input id="name" v-model="form.name" type="text" class="form-control"
                            :class="{ 'is-invalid': errors.name }" placeholder="Digite seu nome completo" />
                          <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group mt-3">
                          <label for="phone">Telefone/WhatsApp *</label>
                          <input id="phone" v-model="form.phone" type="text" class="form-control"
                            :class="{ 'is-invalid': errors.phone }" placeholder="+244 999 999 999" />
                          <div v-if="errors.phone" class="invalid-feedback">{{ errors.phone }}</div>
                        </div>
                      </div>
                    </div>

                    <div class="form-group mt-3">
                      <label for="email">E-mail *</label>
                      <input id="email" v-model="form.email" type="email" class="form-control"
                        :class="{ 'is-invalid': errors.email }" placeholder="seu@email.com" :readonly="isSocialLogin" />
                      <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>

                    </div>

                    <div v-if="isSocialLogin" class="alert alert-info mt-3">
                      <i class="fas fa-info-circle me-2"></i>
                      Conta criada via <strong>{{ userLoginType }}</strong>
                    </div>

                    <div class="form-actions">

                      <button type="submit" class="btn btn-primary" :disabled="isLoading">
                        <i v-show="isLoading" class="fas fa-spinner fa-spin me-2"></i>
                        {{ isLoading ? 'Salvando...' : 'Salvar Alterações' }}
                      </button>
                    </div>
                  </form>
                </div>
              </div>



              <div class="profile-card password-card" v-if="!userNow.provider">
                <div class="card-header">
                  <h2><i class="fas fa-lock me-2"></i>{{ hasPassword ? 'Alterar Senha' : 'Configurar Senha' }}</h2>
                </div>
                <div class="card-body">

                  <form @submit.prevent="updatePassword" class="password-form">

                    <div v-if="!hasPassword" class="alert alert-warning mb-3">
                      <i class="fas fa-exclamation-triangle me-2"></i>
                      Podes alterar sua senha sempre.
                    </div>



                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label for="new-password">Nova Senha</label>
                          <div class="password-input">
                            <input id="new-password" :type="showNewPassword ? 'text' : 'password'"
                              v-model="passwordForm.newPassword" class="form-control"
                              :class="{ 'is-invalid': errors.newPassword }" placeholder="Mínimo 6 caracteres"
                              autocomplete="new-password" />
                            <button type="button" @click="showNewPassword = !showNewPassword" class="toggle-btn">
                              <i :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                            </button>
                          </div>
                          <div v-if="errors.newPassword" class="invalid-feedback">{{ errors.newPassword }}</div>
                          <small class="form-text text-muted">Mínimo 6 caracteres</small>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label for="confirm-password">Confirmar Nova Senha</label>
                          <div class="password-input">
                            <input id="confirm-password" :type="showConfirmPassword ? 'text' : 'password'"
                              v-model="passwordForm.confirmPassword" class="form-control"
                              :class="{ 'is-invalid': errors.confirmPassword }" placeholder="Repita a nova senha"
                              autocomplete="new-password" />
                            <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                              class="toggle-btn">
                              <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                            </button>
                          </div>
                          <div v-if="errors.confirmPassword" class="invalid-feedback">{{ errors.confirmPassword }}</div>
                        </div>
                      </div>
                    </div>

                    <div v-if="passwordForm.newPassword" class="password-strength mt-3">
                      <div class="strength-bar">
                        <div :class="['strength-fill', `strength-${getPasswordStrength()}`]"
                          :style="{ width: `${getPasswordStrengthPercentage()}%` }"></div>
                      </div>
                      <small :class="['strength-text', `text-${getPasswordStrength()}`]">
                        {{ getPasswordStrengthText() }}
                      </small>
                    </div>

                    <div class="form-actions">
                      <button type="button" @click="resetPasswordForm" class="btn btn-secondary">
                        <i class="fas fa-undo me-2"></i>{{ hasPassword ? 'Limpar' : 'Cancelar' }}
                      </button>
                      <button type="submit" class="btn btn-primary"
                        :disabled="isPasswordLoading || !passwordForm.newPassword">
                        <i v-show="isPasswordLoading" class="fas fa-spinner fa-spin me-2"></i>
                        {{ isPasswordLoading ? 'Salvando...' : (hasPassword ? 'Alterar Senha' : 'Configurar Senha') }}
                      </button>
                    </div>
                  </form>
                </div>
              </div>






              <!-- <div class="profile-card ">
                <div class="card-header">
                  <h2><i class="fas fa-lock me-2"></i>{{ hasPassword ? 'Alterar Senha' : 'Configurar Senha' }}</h2>
                </div>
                <div class="card-body">

                  <form @submit.prevent="updatePassword" class="password-form">

                    <div v-if="!hasPassword" class="alert alert-warning mb-3">
                      <i class="fas fa-exclamation-triangle me-2"></i>
                      Podes alterar sua senha sempre.
                    </div>



                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label for="new-password">Nova Senha</label>
                          <div class="password-input">
                            <input id="new-password" :type="showNewPassword ? 'text' : 'password'"
                              v-model="passwordForm.newPassword" class="form-control"
                              :class="{ 'is-invalid': errors.newPassword }" placeholder="Mínimo 6 caracteres"
                              autocomplete="new-password" />
                            <button type="button" @click="showNewPassword = !showNewPassword" class="toggle-btn">
                              <i :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                            </button>
                          </div>
                          <div v-if="errors.newPassword" class="invalid-feedback">{{ errors.newPassword }}</div>
                          <small class="form-text text-muted">Mínimo 6 caracteres</small>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label for="confirm-password">Confirmar Nova Senha</label>
                          <div class="password-input">
                            <input id="confirm-password" :type="showConfirmPassword ? 'text' : 'password'"
                              v-model="passwordForm.confirmPassword" class="form-control"
                              :class="{ 'is-invalid': errors.confirmPassword }" placeholder="Repita a nova senha"
                              autocomplete="new-password" />
                            <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                              class="toggle-btn">
                              <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                            </button>
                          </div>
                          <div v-if="errors.confirmPassword" class="invalid-feedback">{{ errors.confirmPassword }}</div>
                        </div>
                      </div>
                    </div>

                    <div v-if="passwordForm.newPassword" class="password-strength mt-3">
                      <div class="strength-bar">
                        <div :class="['strength-fill', `strength-${getPasswordStrength()}`]"
                          :style="{ width: `${getPasswordStrengthPercentage()}%` }"></div>
                      </div>
                      <small :class="['strength-text', `text-${getPasswordStrength()}`]">
                        {{ getPasswordStrengthText() }}
                      </small>
                    </div>

                    <div class="form-actions">
                      <button type="button" @click="resetPasswordForm" class="btn btn-secondary">
                        <i class="fas fa-undo me-2"></i>{{ hasPassword ? 'Limpar' : 'Cancelar' }}
                      </button>
                      <button type="submit" class="btn btn-primary"
                        :disabled="isPasswordLoading || !passwordForm.newPassword">
                        <i v-show="isPasswordLoading" class="fas fa-spinner fa-spin me-2"></i>
                        {{ isPasswordLoading ? 'Salvando...' : (hasPassword ? 'Alterar Senha' : 'Configurar Senha') }}
                      </button>
                    </div>
                  </form>
                </div>
              </div> -->

            </div>






            <div class="col-lg-4">
              <div class="profile-sidebar">
                <div class="profile-stats-card card">
                  <div class="card-body text-center">
                    <h3 class="stats-title">Minha Conta</h3>
                    <div class="stats-item">
                      <i class="fas fa-home"></i>
                      <div>
                        <span class="stats-label">Anúncios</span>
                        <span class="stats-number">{{ user.favorites || 0 }}</span>
                      </div>
                    </div>
                    <div class="stats-item">
                      <i class="fas fa-heart"></i>
                      <div>
                        <span class="stats-label">Favoritos</span>
                        <span class="stats-number">{{ user.favorites || 0 }}</span>
                      </div>
                    </div>
                    <div class="stats-item">
                      <i class="fas fa-eye"></i>
                      <div>
                        <span class="stats-label">Views</span>
                        <span class="stats-number">{{ user.favorites || 0 }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="quick-actions-card card">
                  <div class="card-header">
                    <h5><i class="fas fa-bolt me-2"></i>Ações Rápidas</h5>
                  </div>
                  <div class="card-body">
                    <RouterLink to="/meus-anuncios" class="action-item">
                      <i class="fas fa-building"></i>
                      <span>Meus Anúncios</span>
                    </RouterLink>
                    <RouterLink to="/favoritos" class="action-item">
                      <i class="fas fa-heart"></i>
                      <span>Lista de Adoradas</span>
                    </RouterLink>
                    <RouterLink to="/anunciar" class="action-item">
                      <i class="fas fa-plus"></i>
                      <span>Anunciar Casa</span>
                    </RouterLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <FooterComponent />
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import NavbarComponent from '@/components/NavbarComponent.vue'
import FooterComponent from '@/components/FooterComponent.vue'
import axios from 'axios'
import Cookies from 'js-cookie'

const router = useRouter()
const API_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'https://api.cirimoveis.com/api/v1'



const route = useRoute();

interface User {
  id?: string;
  name: string;
  email: string;
  phone: string;
  about: string;
  avatar?: string;
  provider?: string;
  createdAt?: string;
  photo?: string;
}


let userNow: User;
if (typeof route.params.user === 'string') {
  userNow = { id: route.params.user, name: '', phone: '', email: '', about: '', createdAt: '', provider: '', photo: '' };
} else if (Array.isArray(route.params.user)) {
  userNow = { id: route.params.user[0], name: '', phone: '', email: '', about: '', createdAt: '', provider: '', photo: '' };
} else {
  userNow = route.params.user || { id: '', name: '', phone: '', email: '', about: '', createdAt: '', provider: '', photo: '' };
}




interface UserProfile {
  id: number
  name: string
  email: string
  phone?: string
  type: number
  login_type?: 'email' | 'google' | 'facebook'
  has_password?: boolean
  properties?: number
  favorites?: number
  views?: number
}

interface ProfileForm {
  name: string
  email: string
  phone: string
  favorites: number
}

interface PasswordForm {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

const user = ref<UserProfile>({
  id: 0,
  name: '',
  email: '',
  phone: '',
  type: 3,
  has_password: false,
  properties: 0,
  favorites: 0,
  views: 0
})

const form = reactive<ProfileForm>({
  name: '',
  email: '',
  phone: '',
  favorites: 0
})

const passwordForm = reactive<PasswordForm>({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const errors = reactive({
  name: '',
  email: '',
  phone: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const isLoading = ref(false)
const isPasswordLoading = ref(false)
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const avatarUrl = computed(() =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(user.value.name)}&background=dc3545&color=fff&size=120&rounded=true`
)

const isSocialLogin = computed(() => user.value.login_type !== 'email')
const hasPassword = computed(() => user.value.has_password || false)

const userLoginType = computed(() => {
  switch (userNow.provider) {
    case 'google': return 'Google'
    case 'facebook': return 'Facebook'
    default: return 'Senha'
  }
})


const loadProfile = async () => {
  try {
    const token = Cookies.get('token')
    const userId = Cookies.get('user')
    if (!token) throw new Error('Token não encontrado')

    const response = await axios.get(`${API_URL}/user/data/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    console.log('AA', response.data)

    user.value = { ...response.data }
    form.name = response.data.user.name
    form.email = response.data.user.email
    form.phone = response.data.user.phone || ''
    form.favorites = response.data.favorite_total || 0
  } catch (error) {
    // console.error('Erro ao carregar perfil:', error)
    router.push({ name: 'app.auth.login' })
  }
}

const validateProfileForm = () => {
  Object.keys(errors).forEach(key => (errors as any)[key] = '')

  if (!form.name.trim()) {
    errors.name = 'Nome é obrigatório'
    return false
  }

  if (!/^[a-zA-Z\s]{2,50}$/.test(form.name.trim())) {
    errors.name = 'Nome deve ter entre 2-50 caracteres (apenas letras)'
    return false
  }


  // qualquer numero, so nao pode passar de 15 (comeca com +): +244934349483
  // if (form.phone && !/^\(\d{2}\)\s?\d{4,5}-\d{4}$/.test(form.phone)) {
  //   errors.phone = 'Telefone inválido. Use: (11) 99999-9999'
  //   return false
  // }

  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Email inválido'
    return false
  }

  return true
}

const updateProfile = async () => {
  if (!validateProfileForm()) return

  isLoading.value = true
  try {
    const token = Cookies.get('token')
    const payload: any = { name: form.name, phone: form.phone }

    if (form.email !== user.value.email) payload.email = form.email

    const response = await axios.put(`${API_URL}/user/update/${userNow.id}`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    })

    // user.value = { ...user.value, ...response.data }
    showNotification('Perfil atualizado com sucesso!', 'success')

  } catch (error: any) {
    if (error.response?.data?.errors) {
      Object.assign(errors, error.response.data.errors)
    } else {
      showNotification(error.response?.data?.message || 'Erro ao atualizar perfil', 'error')
    }
  } finally {
    isLoading.value = false
  }
}

const validatePasswordForm = () => {
  Object.keys(errors).forEach(key => (errors as any)[key] = '')

  if (hasPassword.value && !passwordForm.currentPassword) {
    errors.currentPassword = 'Senha atual é obrigatória'
    return false
  }

  if (!passwordForm.newPassword) {
    errors.newPassword = 'Nova senha é obrigatória'
    return false
  }

  if (passwordForm.newPassword.length < 6) {
    errors.newPassword = 'Nova senha deve ter pelo menos 6 caracteres'
    return false
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    errors.confirmPassword = 'As senhas não coincidem'
    return false
  }

  return true
}

const updatePassword = async () => {
  if (!validatePasswordForm()) return

  isPasswordLoading.value = true
  try {
    const token = Cookies.get('token')
    const payload: any = { password: passwordForm.newPassword, password_confirmation: passwordForm.confirmPassword }

    if (hasPassword.value) {
      payload.current_password = passwordForm.currentPassword
    }

    await axios.put(`${API_URL}/profile/password`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    })

    user.value.has_password = true
    resetPasswordForm()

    showNotification(`${hasPassword.value ? 'Senha alterada' : 'Senha configurada'} com sucesso!`, 'success')
  } catch (error: any) {
    if (error.response?.data?.errors) {
      Object.assign(errors, error.response.data.errors)
    } else {
      showNotification(error.response?.data?.message || 'Erro ao atualizar senha', 'error')
    }
  } finally {
    isPasswordLoading.value = false
  }
}

const getPasswordStrength = () => {
  const pwd = passwordForm.newPassword
  if (pwd.length < 6) return 0
  if (pwd.length >= 8 && /[A-Z]/.test(pwd) && /\d/.test(pwd)) return 3
  if (pwd.length >= 6 && (/\d/.test(pwd) || /[A-Z]/.test(pwd))) return 2
  return 1
}

const getPasswordStrengthPercentage = () => {
  const strength = getPasswordStrength()
  return strength * 33 + 33
}

const getPasswordStrengthText = () => {
  const strength = getPasswordStrength()
  const texts = [
    'Senha muito fraca',
    'Senha fraca',
    'Senha boa',
    'Senha muito forte'
  ]
  return texts[strength]
}



const resetPasswordForm = () => {
  passwordForm.currentPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  Object.keys(errors).forEach(key => (errors as any)[key] = '')
}

const showNotification = (message: string, type: 'success' | 'error') => {
  const alert = document.createElement('div')
  alert.className = `alert alert-${type} alert-notification`
  alert.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>${message}`
  document.body.appendChild(alert)

  setTimeout(() => alert.remove(), 3000)
}

onMounted(() => {
  loadProfile()
})
</script>

<style scoped>
.profile-page {
  padding-top: 100px;
  background: linear-gradient(135deg, var(--soft-red) 0%, #f8f9fa 100%);
  min-height: 100vh;
}

.profile-section {
  padding: 40px 0;
}

.profile-header {
  text-align: center;
  margin-bottom: 40px;
}

.avatar-container {
  display: inline-block;
  margin-bottom: 20px;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--primary-red);
  box-shadow: 0 8px 25px rgba(211, 47, 47, 0.2);
}

.profile-name {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--dark-charcoal);
  margin: 0;
}

.profile-type {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 8px 0 0;
}

.profile-type.admin {
  color: #ffd700;
}

.profile-type.corretor {
  color: #28a745;
}

.profile-type.cliente {
  color: var(--primary-red);
}

.profile-card,
.card {
  background: var(--card-bg);
  border-radius: 16px;
  box-shadow: 0 6px 20px var(--shadow-medium);
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin-bottom: 24px;
  backdrop-filter: blur(10px);
}

.card-header {
  background: linear-gradient(135deg, var(--primary-red), #e53935);
  color: white;
  padding: 20px 24px;
}

.card-header h2,
.card-header h5 {
  margin: 0;
  font-weight: 700;
}

.card-body {
  padding: 24px;
}

.profile-form,
.password-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: var(--dark-charcoal);
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.form-control {
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: var(--card-bg);
}

.form-control:focus {
  border-color: var(--primary-red);
  box-shadow: 0 0 0 0.2rem rgba(211, 47, 47, 0.1);
}

.form-control.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 4px;
}

.password-input {
  position: relative;
}

.toggle-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--medium-gray);
  cursor: pointer;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.btn {
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  border: none;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-red), #e53935);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #b71c1c, #d32f2f);
  transform: translateY(-2px);
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}

.profile-sidebar {
  position: sticky;
  top: 120px;
}

.stats-title {
  color: var(--dark-charcoal);
  margin-bottom: 20px;
  font-size: 1.25rem;
}

.stats-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #e9ecef;
}

.stats-item:last-child {
  border-bottom: none;
}

.stats-item i {
  width: 40px;
  height: 40px;
  background: var(--soft-red);
  color: var(--primary-red);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.stats-label {
  display: block;
  color: var(--medium-gray);
  font-size: 0.9rem;
}

.stats-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--primary-red);
}

.action-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  color: var(--dark-charcoal);
  text-decoration: none;
  border-bottom: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.action-item:hover {
  color: var(--primary-red);
  padding-left: 8px;
}

.action-item i {
  width: 20px;
  text-align: center;
  font-size: 1.1rem;
}

.alert {
  border-radius: 12px;
  border: none;
  padding: 12px 16px;
}

.alert-info {
  background: linear-gradient(135deg, #0dcaf0, #31d2f2);
  color: #0c5460;
}

.alert-warning {
  background: linear-gradient(135deg, #ffc107, #ffecb3);
  color: #856404;
}

.form-text {
  font-size: 0.875rem;
}

.password-strength {
  margin-top: 16px;
}

.strength-bar {
  width: 100%;
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  transition: width 0.3s ease;
  border-radius: 3px;
}

.strength-0 {
  background: #dc3545;
}

.strength-1 {
  background: #ffc107;
}

.strength-2 {
  background: #fd7e14;
}

.strength-3 {
  background: #28a745;
}

.strength-text.text-0 {
  color: #dc3545;
}

.strength-text.text-1 {
  color: #ffc107;
}

.strength-text.text-2 {
  color: #fd7e14;
}

.strength-text.text-3 {
  color: #28a745;
}

.alert-notification {
  position: fixed;
  top: 120px;
  right: 20px;
  z-index: 9999;
  max-width: 350px;
  animation: slideInRight 0.3s ease;
}

.password-card {
  margin-top: 24px;
}

@media (max-width: 992px) {
  .profile-sidebar {
    position: static;
    margin-top: 24px;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .profile-name {
    font-size: 2rem;
  }

  .profile-avatar {
    width: 100px;
    height: 100px;
  }

  .card-body {
    padding: 20px;
  }

  .stats-item {
    justify-content: center;
  }

  .stats-item i {
    width: 32px;
    height: 32px;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>