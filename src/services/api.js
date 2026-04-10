// Lightweight fetch-based API client. No axios dependency required.

const API_URL =
	// 'https://site-suplimente-server.onrender.com' ||
	'http://localhost:5001/api';

const TOKEN_KEY = 'suplimente_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => {
	if (t) localStorage.setItem(TOKEN_KEY, t);
	else localStorage.removeItem(TOKEN_KEY);
};

async function request(path, { method = 'GET', body, auth = false } = {}) {
	const headers = { 'Content-Type': 'application/json' };
	if (auth) {
		const token = getToken();
		if (token) headers.Authorization = `Bearer ${token}`;
	}

	const res = await fetch(`${API_URL}${path}`, {
		method,
		headers,
		body: body ? JSON.stringify(body) : undefined,
	});

	const contentType = res.headers.get('content-type') || '';
	const data = contentType.includes('application/json')
		? await res.json()
		: null;

	if (!res.ok) {
		const message =
			(data && data.message) ||
			`Request failed with status ${res.status}`;
		throw new Error(message);
	}
	return data;
}

// ---------- Auth ----------
export const authApi = {
	login: (email, password) =>
		request('/auth/login', { method: 'POST', body: { email, password } }),
	me: () => request('/auth/me', { auth: true }),
};

// ---------- Categories ----------
export const categoryApi = {
	list: () => request('/categories'),
	tree: () => request('/categories/tree'),
	get: (id) => request(`/categories/${id}`),
	create: (data) =>
		request('/categories', { method: 'POST', body: data, auth: true }),
	update: (id, data) =>
		request(`/categories/${id}`, { method: 'PUT', body: data, auth: true }),
	remove: (id) =>
		request(`/categories/${id}`, { method: 'DELETE', auth: true }),
};

// ---------- Supplements ----------
export const supplementApi = {
	list: (params = {}) => {
		const qs = new URLSearchParams(params).toString();
		return request(`/supplements${qs ? `?${qs}` : ''}`);
	},
	popular: (limit = 8) => request(`/supplements/popular?limit=${limit}`),
	search: (q) => request(`/supplements/search?q=${encodeURIComponent(q)}`),
	get: (id) => request(`/supplements/${id}`),
	create: (data) =>
		request('/supplements', { method: 'POST', body: data, auth: true }),
	update: (id, data) =>
		request(`/supplements/${id}`, {
			method: 'PUT',
			body: data,
			auth: true,
		}),
	remove: (id) =>
		request(`/supplements/${id}`, { method: 'DELETE', auth: true }),
	trackClick: (id) => request(`/supplements/${id}/click`, { method: 'POST' }),
	trackCart: (id) => request(`/supplements/${id}/cart`, { method: 'POST' }),
};

// ---------- Diseases ----------
export const diseaseApi = {
	list: () => request('/diseases'),
	get: (id) => request(`/diseases/${id}`),
	create: (data) =>
		request('/diseases', { method: 'POST', body: data, auth: true }),
	update: (id, data) =>
		request(`/diseases/${id}`, { method: 'PUT', body: data, auth: true }),
	remove: (id) =>
		request(`/diseases/${id}`, { method: 'DELETE', auth: true }),
	addSupplement: (diseaseId, supplementId) =>
		request(`/diseases/${diseaseId}/supplements/${supplementId}`, {
			method: 'POST',
			auth: true,
		}),
	removeSupplement: (diseaseId, supplementId) =>
		request(`/diseases/${diseaseId}/supplements/${supplementId}`, {
			method: 'DELETE',
			auth: true,
		}),
};

export default { authApi, categoryApi, supplementApi, diseaseApi };
