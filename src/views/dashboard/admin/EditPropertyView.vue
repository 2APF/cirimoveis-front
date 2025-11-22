<template>
  <div class="min-vh-100 bg-light-custom">
    <NavbarDashComponent title="Editar Propriedade" class="mb-7" />

    <main class="main-content p-4 mt-5">
       
      <div v-if="loading" class="text-center py-5">
        <i class="fas fa-spinner fa-spin fa-3x text-danger"></i>
        <p class="text-muted mt-3">Carregando dados da propriedade...</p>
      </div>

      <!-- Form -->
      <section v-else class="card shadow-sm mt-5">
        <div class="card-body p-5">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="card-title h5 mb-0 text-dark fw-bold">
              <i class="fas fa-edit me-2 text-danger"></i>
              Editar Propriedade
            </h3>
            <div class="bg-light rounded-pill px-3 py-1 small text-muted">
              
          <RouterLink :to="{ name: 'app.dash.properties' }" class="btn btn-outline-secondary">
            <i class="fas fa-arrow-left me-2"></i>
            Voltar
          </RouterLink>
            </div>
          </div>

          <form @submit.prevent="updateProperty" ref="propertyForm">
            <div class="row g-4">

              
              <div class="col-12 col-md-12">
                <p><strong>Autor: </strong> {{ form.name_user }}</p>
                <p><strong>Telefone: </strong> {{ form.phone ? form.phone : 'N/A' }}</p>
                <p><strong>Email: </strong> {{ form.email }}</p>
                <!-- <p><strong>Tipo de usuário: </strong> {{ form.user_type }}</p> -->
              </div>


              <div class="col-12 col-md-6">
                <label class="form-label small fw-medium">Nome *</label>
                <input v-model="form.name" type="text" class="form-control" placeholder="Ex: Moradia T4 no Talatona" required />
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label small fw-medium">Endereço *</label>
                <input v-model="form.address" type="text" class="form-control" placeholder="Ex: Rua Principal, 123" required />
              </div>

              <!-- Preço, Quartos, Banheiros -->
              <div class="col-12 col-md-4">
                <label class="form-label small fw-medium">Preço (AOA) *</label>
                <div class="input-group">
                  <span class="input-group-text bg-white border-end-0">AOA</span>
                  <input v-model.number="form.price" type="number" class="form-control border-start-0" placeholder="0" min="0" required />
                </div>
              </div>
              <div class="col-12 col-md-4">
                <label class="form-label small fw-medium">Quartos *</label>
                <select v-model.number="form.bedrooms" class="form-select" required>
                  <option value="" disabled>Selecione</option>
                  <option v-for="n in 20" :key="n" :value="n">{{ n }}</option>
                </select>
              </div>
              <div class="col-12 col-md-4">
                <label class="form-label small fw-medium">Banheiros *</label>
                <select v-model.number="form.bathrooms" class="form-select" required>
                  <option value="" disabled>Selecione</option>
                  <option v-for="n in 15" :key="n" :value="n">{{ n }}</option>
                </select>
              </div>

              <!-- Área, Tipo, Categoria -->
              <div class="col-12 col-md-4">
                <label class="form-label small fw-medium">Área (m²) *</label>
                <div class="input-group">
                  <input v-model.number="form.area" type="number" class="form-control" placeholder="0" min="0" required />
                  <span class="input-group-text bg-white">m²</span>
                </div>
              </div>
              <div class="col-12 col-md-4">
                <label class="form-label small fw-medium">Tipo *</label>
                <select v-model="form.type" class="form-select" required>
                  <option value="" disabled>Selecione</option>
                  <option value="0">Venda</option>
                  <option value="1">Aluguel</option>
                </select>
              </div>
              <div class="col-12 col-md-4">
                <label class="form-label small fw-medium">Categoria *</label>
                <select v-model="form.category_id" class="form-select" required>
                  <option value="" disabled>Selecione</option>
                  <option value="1">Casa</option>
                  <option value="2">Apartamento</option>
                  <option value="3">Terreno</option>
                  <option value="4">Comercial</option>
                </select>
              </div>

              <!-- Ano, Condição, Disponibilidade -->
              <div class="col-12 col-md-4">
                <label class="form-label small fw-medium">Ano Construção</label>
                <input v-model.number="form.year_built" type="number" class="form-control" placeholder="2023" min="1900" max="2025" />
              </div>
              <div class="col-12 col-md-4">
                <label class="form-label small fw-medium">Condição</label>
                <select v-model="form.condition" class="form-select">
                  <option value="">Selecione</option>
                  <option value="0">Novo</option>
                  <option value="1">Usado</option>
                  <option value="2">Reformado</option>
                </select>
              </div>
              <div class="col-12 col-md-4">
                <label class="form-label small fw-medium">Disponibilidade</label>
                <select v-model="form.availability" class="form-select">
                  <option value="" disabled>Selecione</option>
                  <option value="0">Imediata</option>
                  <option value="1">15 dias</option>
                  <option value="2">30 dias</option>
                </select>
              </div>

              <!-- Status do Anúncio -->
              <div class="col-12 col-md-6">
                <label class="form-label small fw-medium">Status do Anúncio</label>
                <div class="d-flex gap-3">
                  <div class="form-check">
                    <input class="form-check-input" type="radio" id="active" value="1" v-model="form.status">
                    <label class="form-check-label" for="active">Activo</label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="radio" id="paused" value="2" v-model="form.status">
                    <label class="form-check-label" for="paused">Pausado</label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="radio" id="pending" value="0" v-model="form.status">
                    <label class="form-check-label" for="pending">Pendente</label>
                  </div>
                </div>
              </div>

              <!-- Características -->
              <div class="col-12">
                <h4 class="h6 mt-4 mb-4 text-dark fw-bold border-bottom pb-2">
                  <i class="fas fa-list me-2 text-danger"></i>
                  Características
                </h4>
                <div class="row g-3">
                  <div class="col-6 col-md-3">
                    <div class="form-check feature-card p-3 rounded-3 border">
                      <input id="garages" v-model="form.garages" type="checkbox" class="form-check-input" />
                      <label for="garages" class="form-check-label d-flex align-items-center">
                        <i class="fas fa-car me-2 text-danger"></i> Garagem
                      </label>
                    </div>
                  </div>
                  <div class="col-6 col-md-3">
                    <div class="form-check feature-card p-3 rounded-3 border">
                      <input id="swimming_pool" v-model="form.swimming_pool" type="checkbox" class="form-check-input" />
                      <label for="swimming_pool" class="form-check-label d-flex align-items-center">
                        <i class="fas fa-swimming-pool me-2 text-danger"></i> Piscina
                      </label>
                    </div>
                  </div>
                  <div class="col-6 col-md-3">
                    <div class="form-check feature-card p-3 rounded-3 border">
                      <input id="garden" v-model="form.garden" type="checkbox" class="form-check-input" />
                      <label for="garden" class="form-check-label d-flex align-items-center">
                        <i class="fas fa-seedling me-2 text-danger"></i> Jardim
                      </label>
                    </div>
                  </div>
                  <div class="col-6 col-md-3">
                    <div class="form-check feature-card p-3 rounded-3 border">
                      <input id="air_conditioning" v-model="form.air_conditioning" type="checkbox" class="form-check-input" />
                      <label for="air_conditioning" class="form-check-label d-flex align-items-center">
                        <i class="fas fa-fan me-2 text-danger"></i> A.C
                      </label>
                    </div>
                  </div>
                  <div class="col-6 col-md-3">
                    <div class="form-check feature-card p-3 rounded-3 border">
                      <input id="verification" v-model="form.verification" type="checkbox" class="form-check-input" />
                      <label for="verification" class="form-check-label d-flex align-items-center">
                        <i class="fas fa-check-circle me-2 text-warning"></i>

                        Verficada
                      </label>
                    </div>
                  </div>
                  <div class="col-6 col-md-3">
                    <div class="form-check feature-card p-3 rounded-3 border">
                      <input id="emphasis" v-model="form.emphasis" type="checkbox" class="form-check-input" />
                      <label for="emphasis" class="form-check-label d-flex align-items-center">
                        <i class="fas fa-crown me-2 text-warning"></i> Destaque
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Descrição -->
              <div class="col-12">
                <label class="form-label small fw-medium">Descrição *</label>
                <textarea v-model="form.description" class="form-control" rows="5" placeholder="Descreva a propriedade em detalhes..." required></textarea>
              </div>

              <!-- Imagens -->
              <div class="col-12">
                <h4 class="h6 mt-4 mb-4 text-dark fw-bold border-bottom pb-2">
                  <i class="fas fa-images me-2 text-danger"></i>
                  Imagens (máx. 10)
                </h4>

                <div class="dropzone border-dashed rounded-3 p-4 text-center mb-3"
                     @dragover.prevent @drop="handleImageUploadDrop"
                     @dragenter="onDragEnter" @dragleave="onDragLeave">
                  <i class="fas fa-cloud-upload-alt fa-3x text-muted mb-3"></i>
                  <br>
                  <input type="file" class="form-control d-none" multiple accept="image/*"
                         @change="handleImageUpload" ref="fileInput" />
                  <label for="photos" class="btn btn-outline-primary mb-2" @click.prevent="fileInput?.click()">
                    <i class="fas fa-plus me-2"></i>Selecionar Imagens
                  </label>
                  <p class="text-muted small">JPG, PNG • Máx: 5MB por imagem</p>
                  <p v-if="newPhotos.length" class="text-success fw-bold">
                    {{ newPhotos.length }} nova(s) selecionada(s)
                  </p>
                </div>

                <!-- Fotos existentes + novas -->
                <div v-if="currentPhotos.length || newPhotos.length" class="row g-2">
                  <div v-for="(img, i) in currentPhotos" :key="'existing-' + i" class="col-6 col-md-3">
                    <div class="position-relative">
                      <img :src="img.url.url" class="img-fluid rounded img-framed h-100" style="height: 120px;" />
                      <button type="button" class="btn btn-danger btn-sm position-absolute top-0 end-0 rounded-circle"
                              style="width: 24px; height: 24px;" @click="removeExisting(i)">
                        <i class="fas fa-times fa-xs"></i>
                      </button>
                    </div>
                  </div>
                  <div v-for="(img, i) in newPhotos" :key="'new-' + i" class="col-6 col-md-3">
                    <div class="position-relative">
                      <img :src="img.url" class="img-fluid rounded img-framed h-100" style="height: 120px;" />
                      <button type="button" class="btn btn-danger btn-sm position-absolute top-0 end-0 rounded-circle"
                              style="width: 24px; height: 24px;" @click="removeNew(i)">
                        <i class="fas fa-times fa-xs"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Ações -->
              <div class="col-12 mt-5 pt-4 border-top">
                <div class="d-flex gap-3 justify-content-end">
                  <button type="button" class="btn btn-outline-secondary px-4" @click="previewProperty">
                    <i class="fas fa-eye me-2"></i> Pré-visualizar
                  </button>
                  <button type="submit" class="btn btn-danger px-4" :disabled="isSubmitting">
                    <i v-show="isSubmitting" class="fas fa-spinner fa-spin me-2"></i>
                    <i v-show="!isSubmitting" class="fas fa-save me-2"></i>
                    {{ isSubmitting ? 'Salvando...' : 'Salvar Alterações' }}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>

      <!-- Modal de Pré-visualização -->
      <div v-if="showPreview" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-xl">
          <div class="modal-content rounded-4">
            <div class="modal-header bg-danger text-white rounded-top-4">
              <h5 class="modal-title mb-0">
                <i class="fas fa-eye me-2"></i> Pré-visualização
              </h5>
              <button type="button" class="btn-close btn-close-white" @click="showPreview = false"></button>
            </div>
            <div class="modal-body p-4">
              <div class="row g-4">
                <div class="col-12 col-md-6">
                  <h2 class="h4 fw-bold text-dark mb-2">{{ form.name || 'Sem título' }}</h2>
                  <p class="text-muted mb-3">
                    <i class="fas fa-map-marker-alt me-2 text-danger"></i>
                    {{ form.address || 'Não especificado' }}
                  </p>
                  <h3 class="h3 fw-bold text-danger mb-3">{{ formatPrice(form.price) }}</h3>
                  <div class="row g-2 mb-3">
                    <div class="col-6"><span class="badge bg-danger">{{ form.type === '0' ? 'Venda' : 'Aluguel' }}</span></div>
                    <div class="col-6"><span class="badge bg-success">{{ form.bedrooms }}Q / {{ form.bathrooms }}B</span></div>
                  </div>
                  <div class="badge" :class="statusBadge(form.status)">
                    {{ statusLabel(form.status) }}
                  </div>
                </div>

                <div class="col-12 col-md-6">
                  <div v-if="allPhotos.length" class="carousel slide shadow-sm rounded-3 overflow-hidden" id="editCarousel" data-bs-ride="carousel">
                    <div class="carousel-inner">
                      <div v-for="(img, i) in allPhotos" :key="i" class="carousel-item" :class="{ active: i === 0 }">
                        <img :src="img.url" class="d-block w-100" style="height: 300px; object-fit: cover;" />
                      </div>
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#editCarousel" data-bs-slide="prev">
                      <span class="carousel-control-prev-icon"></span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#editCarousel" data-bs-slide="next">
                      <span class="carousel-control-next-icon"></span>
                    </button>
                  </div>
                  <div v-else class="bg-light rounded-3 text-center py-5">
                    <i class="fas fa-image fa-3x text-muted mb-2"></i>
                    <p class="text-muted">Nenhuma imagem</p>
                  </div>
                </div>

                <div class="col-12">
                  <h4 class="h5 mt-4 mb-3 text-dark">
                    <i class="fas fa-info-circle me-2 text-danger"></i> Detalhes
                  </h4>
                  <div class="row g-3">
                    <div class="col-md-3"><i class="fas fa-bed me-2 text-danger"></i>{{ form.bedrooms }} Quartos</div>
                    <div class="col-md-3"><i class="fas fa-bath me-2 text-danger"></i>{{ form.bathrooms }} Banheiros</div>
                    <div class="col-md-3"><i class="fas fa-ruler-combined me-2 text-danger"></i>{{ form.area }} m²</div>
                    <div class="col-md-3"><i class="fas fa-calendar me-2 text-danger"></i>{{ form.year_built || 'N/D' }}</div>
                    <div class="col-md-3"><i class="fas fa-car me-2 text-danger"></i>{{ form.garages ? 'Garagem' : '—' }}</div>
                    <div class="col-md-3"><i class="fas fa-swimming-pool me-2 text-danger"></i>{{ form.swimming_pool ? 'Piscina' : '—' }}</div>
                    <div class="col-md-3"><i class="fas fa-seedling me-2 text-danger"></i>{{ form.garden ? 'Jardim' : '—' }}</div>
                    <div class="col-md-3"><i class="fas fa-fan me-2 text-danger"></i>{{ form.air_conditioning ? 'Ar' : '—' }}</div>
                  </div>
                </div>

                <div class="col-12">
                  <h4 class="h5 mt-4 mb-3 text-dark">
                    <i class="fas fa-align-left me-2 text-danger"></i> Descrição
                  </h4>
                  <div class="bg-light p-4 rounded-3">
                    <p class="mb-0">{{ form.description || 'Nenhuma descrição' }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer border-0 bg-light rounded-bottom-4">
              <button type="button" class="btn btn-outline-secondary" @click="showPreview = false">
                <i class="fas fa-times me-2"></i> Fechar
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
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavbarDashComponent from '@/components/NavbarDashComponent.vue'
import Cookies from 'js-cookie'

const route = useRoute()
const router = useRouter()
const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cirimoveis.com/api/v1'

interface Photo { file?: File; url: any }
interface PropertyForm {
  slug?: string;
  name: string; description: string; price: number | null; address: string; type: string;
  bedrooms: number | string; bathrooms: number | string; area: number | string; category_id: string;
  year_built: number | string; condition: string; availability: string; status: string;
  garages: boolean; swimming_pool: boolean; garden: boolean; air_conditioning: boolean; featured: boolean;
emphasis: boolean; verification: boolean;
  name_user?: string; phone?: string; email?: string; user_type?: string; id: any;
}

const form = reactive<PropertyForm>({
  slug: '',
  name: '', description: '', price: null, address: '', type: '', bedrooms: '', bathrooms: '',
  area: '', category_id: '', year_built: '', condition: '', availability: '', status: '1',
  garages: false, swimming_pool: false, garden: false, air_conditioning: false, featured: false,
  emphasis: false, verification: false,
  name_user: '', phone: '', email: '', user_type: '', id: null
})

const currentPhotos = ref<Photo[]>([])
const newPhotos = ref<Photo[]>([])
const loading = ref(true)
const isSubmitting = ref(false)
const showPreview = ref(false)
const propertyForm = ref<HTMLFormElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const dragActive = ref(false)
const notification = ref({ message: '', type: 'success' as 'success' | 'danger' })

const onDragEnter = () => dragActive.value = true
const onDragLeave = () => dragActive.value = false

const propertySlug = route.params.slug as string

// Carregar dados
onMounted(async () => {
  const token = Cookies.get('token')
  if (!token) return router.push('/login')

  try {
    const res = await fetch(`${API_URL}/product/show/${propertySlug}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    const p = data.product
    const user = data.user

    Object.assign(form, {
      id: p.id,
      name: p.name, description: p.description, price: p.price, address: p.address,
      type: p.type, bedrooms: p.bedrooms, bathrooms: p.bathrooms,
      area: p.area, category_id: p.category_id, year_built: p.year_built, condition: p.condition,
      availability: p.availability, status: p.status,
      garages: !!p.garages, swimming_pool: !!p.swimming_pool, garden: !!p.garden,
      air_conditioning: !!p.air_conditioning, featured: !!p.featured, emphasis: !!p.emphasis, verification: !!p.verification,

      slug: p.slug,
      name_user: user.name, phone: user.phone, email: user.email, user_type: user.user_type
    })
 
    if (p.photos) {
      currentPhotos.value = parsePhotos(p.photos)
    }

  } catch (err) {
    showNotification('Erro ao carregar propriedade', 'danger')
    // router.push('/admin/properties')
  } finally {
    loading.value = false
  }
})

const parsePhotos = (photosString: string): Photo[] => {
  try {
    const cleaned = photosString.replace(/\\\//g, '/')
    const parsed = JSON.parse(cleaned)
    return Array.isArray(parsed) ? parsed.map((url: string) => ({ url })) : []
  } catch {
    return []
  }
}

// Upload
const handleImageUpload = (e: Event) => {
  const files = Array.from((e.target as HTMLInputElement).files || [])
  files.forEach(addPhoto)
  ;(e.target as HTMLInputElement).value = ''
}
const handleImageUploadDrop = (e: DragEvent) => {
  e.preventDefault(); dragActive.value = false
  Array.from(e.dataTransfer?.files || []).forEach(addPhoto)
}
const addPhoto = (file: File) => {
  if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) return showNotification('Imagem inválida ou muito grande', 'danger')
  if (currentPhotos.value.length + newPhotos.value.length >= 10) return showNotification('Máximo 10 fotos', 'danger')
  const url = URL.createObjectURL(file)
  newPhotos.value.push({ file, url })
}
const removeExisting = (i: number) => currentPhotos.value.splice(i, 1)
const removeNew = (i: number) => { URL.revokeObjectURL(newPhotos.value[i].url); newPhotos.value.splice(i, 1) }

// Submit
const updateProperty = async () => {
  if (!propertyForm.value?.checkValidity()) return propertyForm.value?.reportValidity()
  isSubmitting.value = true

  const formData = new FormData()
  Object.entries(form).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== '') {
      formData.append(k, typeof v === 'boolean' ? (v ? '1' : '0') : String(v))
    }
  })
  newPhotos.value.forEach((p, i) => p.file && formData.append(`photos[${i}]`, p.file))

  // Envia apenas índices das fotos que ficam
  currentPhotos.value.forEach((_, i) => formData.append('keep_photos[]', String(i)))


  const idPro = form.id
  try {
    const token = Cookies.get('token')
    const response = await fetch(`${API_URL}/product/update/${form.id}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    })

    if (!response.ok) throw new Error('Erro ao atualizar')

    showNotification('Propriedade atualizada com sucesso!', 'success')
    // router.push('/admin/properties')
  } catch {
    showNotification('Erro ao salvar alterações', 'danger')
  } finally {
    isSubmitting.value = false
  }
}

const allPhotos = computed(() => [...currentPhotos.value, ...newPhotos.value])
const formatPrice = (p: number | null) => p ? new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 }).format(p) : 'AOA 0'
const statusLabel = (s: string) => s === '1' ? 'Ativa' : s === '2' ? 'Pendente' : 'Pausada'
const statusBadge = (s: string) => s === '1' ? 'bg-success' : s === '2' ? 'bg-warning text-dark' : 'bg-secondary'

const previewProperty = () => { if (propertyForm.value?.checkValidity()) showPreview.value = true }
const showNotification = (m: string, t: 'success' | 'danger') => {
  notification.value = { message: m, type: t }
  setTimeout(() => notification.value = { message: '', type: 'success' }, 4000)
}
</script>

<style scoped>
/* MESMO ESTILO DO CADASTRO */
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

.card { background: #ffffff; border: none; border-radius: 16px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08); overflow: hidden; }
.card:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12); }

.form-label { color: var(--primary-red); font-size: 0.85rem; font-weight: 600; margin-bottom: 0.5rem; }
.form-control, .form-select { border: 2px solid var(--soft-red); border-radius: 10px; font-size: 0.95rem; padding: 0.75rem 1rem; background: #fafbfc; }
.form-control:focus, .form-select:focus { border-color: var(--primary-red); box-shadow: 0 0 0 4px rgba(230, 57, 70, 0.15); background: #fff; }

.form-check-input:checked { background-color: var(--primary-red); border-color: var(--primary-red); }
.feature-card { background: #fafbfc; border: 2px solid var(--soft-red) !important; cursor: pointer; }
.feature-card:hover { border-color: var(--primary-red) !important; background: #fff; }

.dropzone { border: 3px dashed var(--soft-red); background: linear-gradient(135deg, #fafbfc 0%, #f0f4f8 100%); }
.dropzone.drag-active { border-color: var(--primary-red); background: linear-gradient(135deg, rgba(230,57,70,0.05) 0%, rgba(230,57,70,0.02) 100%); }

.btn-danger { background: var(--primary-red); border: none; font-weight: 600; }
.btn-danger:hover { transform: translateY(-2px); }

.img-framed { border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
.alert { z-index: 1050; font-size: 0.9rem; padding: 1rem 1.5rem; border-radius: 10px; animation: slideInRight 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); }

.modal-content { border-radius: 16px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2); border: none; }

@media (max-width: 768px) {
  .main-content { margin-left: 0; padding: 1rem; }
  .row.g-4 > * { flex: 0 0 100%; max-width: 100%; }
}
@keyframes slideInRight { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
</style>