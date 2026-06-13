import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
});

// ۱. بادیگارد ارسال: چسباندن توکن به درخواست‌ها
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ۲. بادیگارد دریافت (جدید): مدیریت انقضای توکن
api.interceptors.response.use(
    (response) => {
        return response; // اگر همه چیز اوکی بود، جواب رو بده به کامپوننت
    },
    (error) => {
        // اگر سرور جنگو ارور ۴۰۱ (عدم دسترسی / انقضای توکن) داد:
        if (error.response && error.response.status === 401) {
            console.warn("توکن منقضی شده است. هدایت به صفحه ورود...");
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            window.location.href = '/login'; // شوت کردن کاربر به صفحه لاگین
        }
        return Promise.reject(error);
    }
);

export default api;