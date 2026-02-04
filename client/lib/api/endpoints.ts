//backend ko sab api endpoints yaha define garne
export const API = {
    AUTH: {
        REGISTER: "/api/auth/register",
        LOGIN: "/api/auth/login",
        UPDATE_PROFILE: (id: string) => `/api/auth/${id}`,
    },
    ADMIN: {
        USERS: "/api/admin/users",
        USER: (id: string) => `/api/admin/users/${id}`,
    },
}