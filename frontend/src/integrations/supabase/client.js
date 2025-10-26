// In-memory mock replacing Supabase usage for JS build.

const mockDb = {
  movies: [],
  showtimes: [],
  theaters: [],
  bookings: [],
};

function seedIfEmpty() {
  if (mockDb.movies.length > 0) return;
  const movieA = { id: 'm1', title: 'The Great Adventure', description: 'An epic journey.', duration: 120, poster_url: null, trailer_url: null, release_date: new Date().toISOString().slice(0,10), status: 'now_showing', created_at: new Date().toISOString() };
  const movieB = { id: 'm2', title: 'Coming Soon: Space Odyssey', description: 'To the stars.', duration: 140, poster_url: null, trailer_url: null, release_date: new Date(Date.now()+7*864e5).toISOString().slice(0,10), status: 'coming_soon', created_at: new Date().toISOString() };
  const theater = { id: 't1', name: 'Hall 1', total_rows: 8, seats_per_row: 12, created_at: new Date().toISOString() };
  const show1 = { id: 's1', movie_id: 'm1', theater_id: 't1', price: 10, show_date: new Date().toISOString().slice(0,10), show_time: '19:30', created_at: new Date().toISOString() };
  mockDb.movies.push(movieA, movieB);
  mockDb.theaters.push(theater);
  mockDb.showtimes.push(show1);
}

seedIfEmpty();

class TableQuery {
  constructor(table) { this.table = table; this.rows = [...mockDb[table]]; this.filters = []; this.orders = []; }
  select() { return this; }
  eq(key, value) { this.filters.push(r => r[key] === value); return this; }
  gte(key, value) { this.filters.push(r => String(r[key]) >= String(value)); return this; }
  in(key, values) { this.filters.push(r => values.includes(r[key])); return this; }
  order(key, opts) { this.orders.push({ key, asc: opts.ascending }); return this; }
  single() { const res = this._apply(); return Promise.resolve({ data: res[0] ?? null, error: null }); }
  then(onfulfilled) { const res = { data: this._apply(), error: null }; return Promise.resolve(onfulfilled ? onfulfilled(res) : res); }
  insert(payload) { const row = { id: randomId(), created_at: new Date().toISOString(), ...payload }; mockDb[this.table].push(row); return Promise.resolve({ data: row, error: null }); }
  update(payload) { const res = this._apply(); res.forEach(item => Object.assign(item, payload)); return Promise.resolve({ data: res, error: null }); }
  _apply() { let res = this.rows; for (const f of this.filters) res = res.filter(f); for (const o of this.orders) { res = res.slice().sort((a,b)=>{const av=a[o.key], bv=b[o.key]; if (av===bv) return 0; return (av>bv?1:-1)*(o.asc?1:-1);}); } return res; }
}

function randomId() { return 'id_' + Math.random().toString(36).slice(2,10); }

const AUTH_STORAGE_KEY = 'mock_supabase_session';
function getStoredSession() { try { const raw=localStorage.getItem(AUTH_STORAGE_KEY); return raw?JSON.parse(raw):null; } catch { return null; } }
function setStoredSession(session) { if (!session) localStorage.removeItem(AUTH_STORAGE_KEY); else localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session)); }

const auth = {
  onAuthStateChange() { return { data: { subscription: { unsubscribe() {} } } }; },
  getSession() { return Promise.resolve({ data: { session: getStoredSession() } }); },
  getUser() { const s = getStoredSession(); return Promise.resolve({ data: { user: s?.user ?? null } }); },
  signInWithPassword({ email, password }) { if (!email || !password) return { error: { message: 'Invalid login credentials' } }; const user = { id: 'u_' + btoa(email).replace(/[^a-z0-9]/gi,'').toLowerCase(), email }; setStoredSession({ user }); return { data: { user }, error: null }; },
  signUp({ email, password, options }) { if (!email || !password) return { error: { message: 'Missing email or password' } }; const user = { id: 'u_' + btoa(email).replace(/[^a-z0-9]/gi,'').toLowerCase(), email, user_metadata: options?.data }; setStoredSession({ user }); return { data: { user }, error: null }; },
  signOut() { setStoredSession(null); return { error: null }; },
};

export const supabase = { auth, from(table) { return new TableQuery(table); } };

