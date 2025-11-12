<template>
    <div class="min-vh-100 bg-light-custom">

        <NavbarDashComponent title="Meu Perfil" />

        <main class="main-content p-4 mt-5">

            <section class="row g-4">
                <div class="col-lg-6 col-md-6">
                    <div class="card shadow-sm h-100">
                        <div class="card-body">
                            <h3 class="card-title h6 mb-3 text-dark">Informações do Perfil</h3>
                            <form @submit.prevent="saveProfile">
                                <div class="mb-3">
                                    <label for="name" class="form-label">Nome</label>
                                    <input v-model="userNow.name" type="text" id="name" class="form-control" required />
                                </div>
                                <div class="mb-3">
                                    <label for="email" class="form-label">E-mail</label>
                                    <input v-model="userNow.email" type="email" id="email" class="form-control"
                                        required />
                                </div>
                                <div class="mb-3">
                                    <label for="phone" class="form-label">Telefone</label>
                                    <input v-model="userNow.phone" type="number" id="phone" class="form-control"
                                        required />
                                </div>
                                <button type="submit" class="btn btn-primary w-100">Salvar Alterações</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 col-md-6">
                    <div class="card shadow-sm h-100">
                        <div class="card-body">
                            <h3 class="card-title h6 mb-3 text-dark">Configurações Avançadas</h3>

                            <div class="mb-3">
                                <label class="form-label d-block">Mudar Senha</label>

                                <form @submit.prevent="saveProfile">
                                    <div class="row g-2">

                                        <div class="col">
                                            <input type="password" class="form-control" placeholder="Nova Senha"
                                                v-model="userNow.newPassword" />
                                        </div>
                                        <div class="col">
                                            <input type="password" class="form-control"
                                                placeholder="Confirmar Nova Senha"
                                                v-model="userNow.confirmNewPassword" />
                                        </div>
                                    </div>
                                    <button class="btn btn-primary w-100 mt-2">Salvar </button>
                                </form>
                            </div>

                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="emailNotifications" checked />
                                <label class="form-check-label" for="emailNotifications">Notificações por E-mail</label>
                            </div>

                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="smsNotifications" />
                                <label class="form-check-label" for="smsNotifications">Notificações por SMS</label>
                            </div>


                            <div class="mb-3">
                                <label for="languageSelect" class="form-label">Idioma da Interface</label>
                                <select id="languageSelect" class="form-select" disabled>
                                    <option value="pt">Português</option>
                                    <option value="en">Inglês</option>
                                    <option value="es">Espanhol</option>
                                    <option value="fr">Francês</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <!-- Notification -->
            <div v-if="notification.message" class="position-fixed top-0 end-0 m-3 alert alert-sm"
                :class="notification.type === 'success' ? 'alert-success' : 'alert-info'">
                <i :class="`fas fa-${notification.type === 'success' ? 'check-circle' : 'info-circle'} me-2`"></i>
                {{ notification.message }}
            </div>
        </main>
    </div>
</template>


<script setup lang="ts">

import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Chart from 'chart.js/auto';
import NavbarDashComponent from '@/components/NavbarDashComponent.vue';
import axios from 'axios';
import Cookies from 'js-cookie';

const route = useRoute();
const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

interface User {
    id?: string;
    name: string;
    email: string;
    phone: string;
    about: string;
    createdAt?: string;
    photo?: string;
    newPassword?: string;
    confirmNewPassword?: string;
}


let userNow: User;
if (typeof route.params.user === 'string') {
    userNow = { id: route.params.user, name: '', phone: '', email: '', about: '', createdAt: '', photo: '' };
} else if (Array.isArray(route.params.user)) {
    userNow = { id: route.params.user[0], name: '', phone: '', email: '', about: '', createdAt: '', photo: '' };
} else {
    userNow = route.params.user || { id: '', name: '', phone: '', email: '', about: '', createdAt: '', photo: '' };
}




const saveProfile = async () => {

    const formData = new FormData();
    formData.append('name', userNow.name);
    formData.append('email', userNow.email);
    formData.append('phone', userNow.phone);

    if (userNow.newPassword && userNow.confirmNewPassword) {
        if (userNow.newPassword === userNow.confirmNewPassword) {
            formData.append('currentPassword', userNow.confirmNewPassword);
            formData.append('newPassword', userNow.newPassword);
        } else {
            showNotification('A nova senha e a confirmação não coincidem.', 'info');
            return;
        }
    }

    try {
        const token = Cookies.get('token');
        const response = await axios.post(
            `${apiBase}/user/update/${userNow.id}`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.status === 200) {
            userNow = { ...userNow, ...response.data };
            // limpa form
            userNow.newPassword = '';
            userNow.confirmNewPassword = '';

            
            showNotification('Perfil atualizado com sucesso!', 'success');
        }
    } catch (error) {
        showNotification('Erro ao atualizar perfil.', 'info');
    }
};

interface Notification {
    message: string;
    type: 'success' | 'info';
}

const router = useRouter();
const notification = ref<Notification>({ message: '', type: 'info' });
const activityChart = ref<HTMLCanvasElement | null>(null);



const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(price);
};

const showNotification = (message: string, type: 'success' | 'info') => {
    notification.value = { message, type };
    setTimeout(() => {
        notification.value = { message: '', type: 'info' };
    }, 2000);
};




onMounted(() => {
    if (activityChart.value) {
        new Chart(activityChart.value, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                datasets: [{
                    label: 'Atividade',
                    data: [50, 80, 120, 200, 150, 250],
                    borderColor: '#e63946',
                    backgroundColor: 'rgba(230, 57, 70, 0.2)',
                    fill: true,
                    tension: 0.4,
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, max: 300 },
                    x: { grid: { display: false } },
                },
            },
        });
    }
});
</script>

<style scoped>
:root {
    --primary-red: #e63946;
    --soft-red: rgba(230, 57, 70, 0.1);
    --secondary-red: #c92c39;
    --light-bg: #f1faee;
    --primary-dark: #2d3748;
}

.bg-light-custom {
    background-color: var(--light-bg);
}

body {
    font-family: 'Inter', sans-serif;
}

.main-content {
    margin-left: 250px;
}

@media (max-width: 991px) {
    .main-content {
        margin-left: 0;
    }
}

.card {
    background: rgba(255, 255, 255, 0.95);
    border: none;
    border-radius: 0.75rem;
    box-shadow: 0 4px 15px rgba(29, 53, 87, 0.15);
    backdrop-filter: blur(5px);
    transition: transform 0.3s ease;
}

.card:hover {
    transform: translateY(-3px);
}

.chart-container {
    position: relative;
    width: 100%;
    height: 200px;
}

.form-control,
.form-select {
    background: rgba(255, 255, 255, 0.9);
    border-color: var(--soft-red);
    border-radius: 0.375rem;
    font-size: 0.9rem;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-control:focus,
.form-select:focus {
    border-color: var(--primary-red);
    box-shadow: 0 0 6px rgba(230, 57, 70, 0.3);
}

.form-label {
    color: var(--primary-red);
    font-size: 0.85rem;
}

.btn-primary {
    background-color: var(--primary-red);
    border-color: var(--primary-red);
    font-size: 0.9rem;
    padding: 0.5rem 1.25rem;
    border-radius: 0.375rem;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn-primary:hover {
    /* background-color: var(--secondary-red); */
    border-color: var(--secondary-red);
    transform: translateY(-2px);
}

.btn-outline-primary,
.btn-outline-danger {
    color: var(--primary-red);
    border-color: var(--primary-red);
    font-size: 0.85rem;
    padding: 0.25rem 0.5rem;
}

.btn-outline-primary:hover,
.btn-outline-danger:hover {
    background-color: var(--primary-red);
    color: rgb(106, 106, 106);
}

.alert {
    z-index: 9999;
    font-size: 0.9rem;
    padding: 0.75rem 1.25rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 10px rgba(29, 53, 87, 0.2);
    animation: fadeIn 0.3s ease-in-out;
}

.text-primary {
    color: var(--primary-red);
}

.text-dark {
    color: var(--primary-dark);
}

.table {
    font-size: 0.9rem;
}

.table th {
    color: var(--primary-red);
    font-weight: 600;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 576px) {
    .card-title {
        font-size: 1rem;
    }

    .btn-sm,
    .form-control,
    .form-select,
    .form-label,
    .table {
        font-size: 0.85rem;
    }

    .btn-primary {
        padding: 0.4rem 1rem;
    }

    .display-6 {
        font-size: 2rem;
    }

    .chart-container {
        height: 150px;
    }
}
</style>