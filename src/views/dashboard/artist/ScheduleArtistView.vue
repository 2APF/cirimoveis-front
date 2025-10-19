<template>
    <main class="main" id="top">
        <NavbarAccessedArtistComponent />
        <section id="schedule-request" class="schedule-request-section">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-10 col-md-12">
                        <h2 class="text-center mb-4 mt-6 animate-slide-up">Solicitar Agendamento</h2>
                        <p class="text-center mb-4 animate-fade-in">
                            Escolha o motivo do agendamento primeiro. Para Contrato, apenas quartas e quintas (9h às 12h). Para outros, de segunda a sexta (10h às 14h).
                        </p>
                        <div class="request-card mb-4 animate-scale-in">
                            <h3 class="mb-3">Novo Agendamento</h3>
                            <div class="row g-3">
                                <div class="col-md-4 col-12">
                                    <label for="requestIntention" class="form-label">Motivo</label>
                                    <select v-model="requestIntention"  class="form-control custom-select-bg text-white" style="background-color: #222; color: #fff;" id="requestIntention" :disabled="isLoading" @change="resetForm">
                                        <option value="" disabled>Selecione o motivo</option>
                                        <option value="0">Contrato</option>
                                        <option value="1">Geral</option>
                                    </select>
                                </div>
                                <div class="col-md-4 col-12">
                                    <label for="requestDate" class="form-label">Data</label>
                                    <input v-model="selectedDate" type="date" class="form-control" id="requestDate"
                                        :min="minDate" :max="maxDate" :disabled="!requestIntention || isLoading"
                                        @change="fetchAvailableSlots" @click="restrictDays" />
                                </div>
                                <div class="col-md-4 col-12">
                                    <label for="requestTime" class="form-label">Horário</label>
                                    <select v-model="selectedTime" class="form-control" id="requestTime" :disabled="!availableSlots.length || isLoading">
                                        <option value="" disabled>Selecione um horário</option>
                                        <option v-for="slot in availableSlots" :key="slot" :value="slot">{{ formatTime(slot) }}</option>
                                    </select>
                                    <small v-if="!availableSlots.length && !isLoading && requestIntention" class="text-warning">
                                        Nenhum horário disponível. Tente outra semana.
                                    </small>
                                </div>
                                <div class="col-12 d-flex justify-content-end mt-3 flex-column flex-md-row gap-2 gap-md-0">
                                    <button class="btn btn-hero" :disabled="!isFormValid || isLoading" @click="submitScheduleRequest">
                                        <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                                        Solicitar
                                    </button>
                                    <button class="btn btn-secondary ms-md-2" @click="nextWeek" :disabled="!requestIntention || isLoading">
                                        Próxima Semana
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="schedules-card animate-stagger">
                            <h3 class="mb-3">Histórico de Agendamentos</h3>
                            <div class="table-responsive">
                                <table class="table table-dark table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Data</th>
                                            <th scope="col">Horário</th>
                                            <th scope="col">Motivo</th>
                                            <th scope="col">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(schedule, index) in paginatedSchedules" :key="schedule.id" class="animate-row">
                                            <td>{{ index + 1 }}</td> 
                                            <td>{{ formatDate(schedule.date) }}</td> 
                                            <td>{{ formatTime(schedule.time) }}</td>
                                            <td>{{ formatIntention(schedule.intention) }}</td>
                                            <td>
                                                <span :class="{
                                                    'badge': true,
                                                    'bg-warning': schedule.status === '1',
                                                    'bg-success': schedule.status === '0',
                                                    'bg-danger': schedule.status === '2'
                                                }">
                                                    {{ schedule.status === '1' ? 'Pendente' : schedule.status === '0' ? 'Confirmado' : 'Cancelado' }}
                                                </span>
                                            </td>
                                        </tr>
                                        <tr v-if="paginatedSchedules.length === 0">
                                            <td colspan="5" class="text-center">Nenhum agendamento encontrado.</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div v-if="hasMoreSchedules" class="text-center my-3">
                                    <button class="btn btn-hero" @click="loadMoreSchedules">Carregar Mais</button>
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
import { ref, computed, onMounted } from 'vue';
import { toast } from 'vue3-toastify';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import NavbarAccessedArtistComponent from '@/components/NavbarAccessedUserComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import 'vue3-toastify/dist/index.css';

gsap.registerPlugin(ScrollTrigger);

interface Schedule {
    id: number;
    date: string;
    time: string;
    intention: '0' | '1' | '2';
    status: '0' | '1' | '2';
}

const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';
const requestIntention = ref<string>('');
const selectedDate = ref<string>('');
const selectedTime = ref<string>('');
const availableSlots = ref<string[]>([]);
const schedules = ref<Schedule[]>([]);
const pageSize = ref(10);
const currentPage = ref(1);
const totalPages = ref(1);
const isLoading = ref(false);




const router = useRouter();
const route = useRoute();


interface ProfileData {
    id?: string | number;
    phone?: string;
    name: string;
    email: string;
    style: string;
    address?: string;
    about?: string | any;
    description?: string;
    photo?: string;
    password?: string;
    percentage?: number | string;
    confirmPassword?: string;
    createdAt?: string;
    partnershipDate?: string;
}

var user: ProfileData;
if (typeof route.params.user === 'string') {
    user = { id: route.params.user, name: '', phone: '', email: '', style: '', percentage: 0, about: '', createdAt: '', partnershipDate: '', photo: '', address: '', password: '', confirmPassword: '' };
} else if (Array.isArray(route.params.user)) {
    user = { id: route.params.user[0], name: '', phone: '', email: '', style: '', percentage: 0, about: '', createdAt: '', partnershipDate: '', photo: '', address: '', password: '', confirmPassword: '' };
} else {
    user = route.params.user || { id: '', name: '', phone: '', email: '', style: '', percentage: 0, about: '', createdAt: '', partnershipDate: '', photo: '', address: '', password: '', confirmPassword: '' };
}



const minDate = computed(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
});

const maxDate = computed(() => {
    const date = new Date();
    date.setDate(date.getDate() + 28); // 4 weeks ahead
    return date.toISOString().split('T')[0];
});

const isFormValid = computed(() => {
    return requestIntention.value && selectedDate.value && selectedTime.value && !isLoading.value;
});

const paginatedSchedules = computed(() => {
    const start = 0;
    const end = currentPage.value * pageSize.value;
    return schedules.value.slice(start, end);
});

const hasMoreSchedules = computed(() => currentPage.value < totalPages.value);

const resetForm = () => {
    selectedDate.value = '';
    selectedTime.value = '';
    availableSlots.value = [];
};

const restrictDays = () => {
    if (!requestIntention.value) return;
    const dateInput = document.getElementById('requestDate') as HTMLInputElement;
    if (dateInput) {
        dateInput.addEventListener('click', () => {
            const calendar = dateInput;
            const isContract = requestIntention.value === '0';
            calendar.setAttribute('type', 'date');
            // Browser date picker relies on min/max and frontend validation
        });
    }
};

const fetchAvailableSlots = async () => {
    if (!selectedDate.value || !requestIntention.value) return;
    isLoading.value = true;
    availableSlots.value = [];
    selectedTime.value = '';

    try {
        const date = new Date(selectedDate.value);
        const isContract = requestIntention.value === '0';
        const validDays = isContract ? [3, 4] : [1, 2, 3, 4, 5]; // Wed/Thu or Mon-Fri
        if (!validDays.includes(date.getDay())) {
            toast.warning(`Por favor, selecione ${isContract ? 'uma quarta ou quinta-feira' : 'um dia de segunda a sexta.'}`, {
                autoClose: 2000,
                position: 'top-right',
                theme: 'colored',
                transition: 'slide'
            });
            return;
        }

        const response = await axios.get(`${apiBase}/artist/schedule/slots`, {
            params: {
                id: user.id,
                date: selectedDate.value,
                time: selectedTime.value,
                intention: requestIntention.value
            }
        });

        console.log(response.data)
        availableSlots.value = response.data.data;
        if (!availableSlots.value.length) {
            toast.warning('Nenhum horário disponível para esta data. Tente outra semana.', {
                autoClose: 2000,
                position: 'top-right',
                theme: 'colored',
                transition: 'slide'
            });
        }
    } catch (error: any) {
        console.error('Erro ao buscar horários:', error);
        toast.error(error.response?.data?.error || 'Erro ao carregar horários.', {
            autoClose: 2000,
            position: 'top-right',
            theme: 'colored',
            transition: 'slide'
        });
    } finally {
        isLoading.value = false;
    }
};

const submitScheduleRequest = async () => {
    isLoading.value = true;
    try {
        const response = await axios.post(`${apiBase}/artist/schedule/request`, {
            user_id: user.id,
            date: selectedDate.value,
            time: selectedTime.value,
            intention: requestIntention.value
        });
        toast.success('Agendamento solicitado com sucesso!', {
            autoClose: 1500,
            position: 'top-right',
            theme: 'colored',
            transition: 'slide'
        });
        resetForm();
        await fetchSchedules();
    } catch (error: any) {
        console.error('Erro ao enviar solicitação:', error);
        toast.error(error.response?.data?.error || 'Erro ao enviar solicitação.', {
            autoClose: 2000,
            position: 'top-right',
            theme: 'colored',
            transition: 'slide'
        });
    } finally {
        isLoading.value = false;
    }
};

const nextWeek = () => {
    const current = new Date(selectedDate.value || Date.now());
    current.setDate(current.getDate() + 7);
    const isContract = requestIntention.value === '0';
    const targetDay = isContract ? 3 : 1; // Wednesday for contract, Monday for others
    const nextValidDay = new Date(current);
    nextValidDay.setDate(current.getDate() + (targetDay - current.getDay() + 7) % 7);
    selectedDate.value = nextValidDay.toISOString().split('T')[0];
    fetchAvailableSlots();
};

const fetchSchedules = async () => {
    try {
        const response = await axios.get(`${apiBase}/artist/schedules`, {
            params: {
                user_id: user.id,
                page: currentPage.value,
                per_page: pageSize.value
            }
        });
        schedules.value = response.data.data;
        totalPages.value = response.data.last_page || 1;
    } catch (error: any) {
        console.error('Erro ao buscar agendamentos:', error);
        toast.error(error.response?.data?.error || 'Erro ao carregar agendamentos.', {
            autoClose: 2000,
            position: 'top-right',
            theme: 'colored',
            transition: 'slide'
        });
        schedules.value = [];
    }
};

const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('pt-PT', { dateStyle: 'medium' }).format(new Date(date));
};

const formatTime = (time: string) => {
    return new Intl.DateTimeFormat('pt-PT', { timeStyle: 'short' }).format(new Date(`1970-01-01T${time}`));
};

const formatIntention = (intention: string) => {
    const intentions: { [key: string]: string } = {
        0: 'Contrato',
        1: 'Assuntos variados'
    };
    return intentions[intention] || intention;
};

const loadMoreSchedules = () => {
    if (hasMoreSchedules.value) {
        currentPage.value++;
        fetchSchedules();
        gsap.from('.animate-row', { opacity: 0, y: 20, duration: 0.5, stagger: 0.1 });
    }
};

onMounted(async () => {
    await fetchSchedules();
    gsap.from('.animate-slide-up', { opacity: 0, y: 50, duration: 1, ease: 'power3.out' });
    gsap.from('.animate-fade-in', { opacity: 0, duration: 1, delay: 0.2, ease: 'power3.out' });
    gsap.from('.animate-scale-in', { opacity: 0, scale: 0.95, duration: 1, delay: 0.4, ease: 'back.out(1.7)' });
    gsap.from('.animate-stagger', {
        opacity: 0,
        y: 20,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.schedules-card', start: 'top 80%' }
    });
});
</script>

<style scoped>
.schedule-request-section {
    padding: 80px 0;
    background: linear-gradient(135deg, #1a1a1a, #000);
    min-height: 100vh;
}

.schedule-request-section h2 {
    color: #ffeb3b;
    font-size: 2.8rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.schedule-request-section p {
    font-size: 1.2rem;
    color: #ccc;
}

.request-card,
.schedules-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 235, 59, 0.2);
    border-radius: 20px;
    padding: 24px;
    backdrop-filter: blur(12px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.request-card:hover,
.schedules-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(255, 235, 59, 0.2);
}

.form-label {
    color: #ffeb3b;
    font-weight: 500;
    font-size: 0.9rem;
    margin-bottom: 8px;
}

.form-control, .custom-select-bg {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 235, 59, 0.2);
    color: #fff;
    border-radius: 10px;
    padding: 12px;
    font-size: 0.95rem;
    transition: all 0.3s ease;
}

.form-control:focus, .custom-select-bg:focus {
    background: rgba(255, 255, 255, 0.08);
    border-color: #ffeb3b;
    box-shadow: 0 0 10px rgba(255, 235, 59, 0.3);
    outline: none;
}

.form-control::placeholder {
    color: rgba(255, 255, 255, 0.4);
}

.text-warning {
    font-size: 0.8rem;
    margin-top: 4px;
    display: block;
}

.btn-hero {
    background: #ffeb3b;
    color: #000;
    font-weight: 600;
    padding: 12px 28px;
    border-radius: 14px;
    border: none;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.btn-hero:hover:not(:disabled) {
    background: #fbc02d;
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(255, 235, 59, 0.4);
}

.btn-hero:disabled,
.btn-secondary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-secondary {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid #ffeb3b;
    color: #ffeb3b;
    padding: 12px 28px;
    border-radius: 14px;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.btn-secondary:hover:not(:disabled) {
    background: rgba(255, 235, 59, 0.2);
    transform: translateY(-3px);
}

.table-responsive {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
}

.table-dark {
    background: transparent;
    color: #ddd;
    min-width: 600px;
}

.table-dark th {
    color: #ffeb3b;
    font-weight: 600;
    font-size: 0.9rem;
    border-bottom: 2px solid rgba(255, 235, 59, 0.3);
    padding: 12px 8px;
}

.table-dark td {
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    font-size: 0.85rem;
    padding: 12px 8px;
}

.table-dark tr:hover {
    background: rgba(255, 235, 59, 0.1);
}

.badge {
    font-size: 0.75rem;
    padding: 6px 12px;
    border-radius: 12px;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
    from { opacity: 0; scale: 0.95; }
    to { opacity: 1; scale: 1; }
}

@media (max-width: 768px) {
    .schedule-request-section h2 {
        font-size: 2.2rem;
    }
    .schedule-request-section p {
        font-size: 1.1rem;
    }
    .form-control, .custom-select-bg {
        font-size: 0.9rem;
        padding: 10px;
    }
    .form-label {
        font-size: 0.85rem;
    }
    .btn-hero, .btn-secondary {
        padding: 10px 20px;
        font-size: 0.95rem;
    }
    .table-dark th,
    .table-dark td {
        font-size: 0.8rem;
        padding: 10px 6px;
    }
}

@media (max-width: 576px) {
    .schedule-request-section {
        padding: 40px 0;
    }
    .btn-hero, .btn-secondary {
        padding: 10px;
        font-size: 0.9rem;
        width: 100%;
    }
    .table-dark th,
    .table-dark td {
        font-size: 0.75rem;
        padding: 8px 4px;
    }
}
</style>