/* ==========================================================
   PlaceNix.ai — Backend Data Persistence Service
   localStorage-backed, swappable to a real DB later.
   ========================================================== */

const BackendService = (() => {

    /* ══════ STORAGE KEYS ══════ */
    const KEYS = {
        DATABASES: 'placenix_databases',
        ACTIVITY:  'placenix_activity_log',
        USERS:     'placenix_users'
    };

    /* ══════ SEED DATA ══════ */
    const DEFAULT_DATABASES = [
        { id: 1, name: 'PostgreSQL', category: 'Core',        icon: '🐘', color: 'bg-blue',   desc: 'User profiles, auth tokens, session data',                enabled: true,  lastSynced: Date.now() - 120000 },
        { id: 2, name: 'MongoDB',    category: 'Core',        icon: '🍃', color: 'bg-green',  desc: 'Uploaded resumes, parsed JSON, version history',          enabled: true,  lastSynced: Date.now() - 300000 },
        { id: 3, name: 'Pinecone',   category: 'AI',          icon: '🌲', color: 'bg-pink',   desc: 'Resume and JD embeddings for similarity search',          enabled: true,  lastSynced: Date.now() - 60000  },
        { id: 4, name: 'Redis',      category: 'Performance', icon: '⚡', color: 'bg-red',    desc: 'Session caching, rate limiting, real-time leaderboards',  enabled: true,  lastSynced: Date.now() - 5000   },
        { id: 5, name: 'AWS S3',     category: 'Storage',     icon: '☁️', color: 'bg-amber',  desc: 'Raw PDF/DOC resume files and profile media',              enabled: true,  lastSynced: Date.now() - 600000 },
        { id: 6, name: 'ChromaDB',   category: 'AI',          icon: '🧠', color: 'bg-purple', desc: 'Company-wise interview questions as embeddings',           enabled: false, lastSynced: Date.now() - 172800000 },
        { id: 7, name: 'ClickHouse', category: 'Analytics',   icon: '📊', color: 'bg-teal',   desc: 'Student progress, performance metrics, events',           enabled: false, lastSynced: Date.now() - 604800000 },
        { id: 8, name: 'Firebase',   category: 'Messaging',   icon: '🔥', color: 'bg-amber',  desc: 'Push notifications, real-time alerts to students',        enabled: true,  lastSynced: Date.now() - 1000, syncing: true }
    ];

    const DEFAULT_LOG = [
        { id: 1, timestamp: Date.now() - 3600000,  admin: 'superadmin', action: 'ENABLED',       database: 'ChromaDB',   status: 'success' },
        { id: 2, timestamp: Date.now() - 7200000,  admin: 'superadmin', action: 'SYNC',          database: 'Pinecone',   status: 'success' },
        { id: 3, timestamp: Date.now() - 86400000,  admin: 'superadmin', action: 'DISABLED',      database: 'Firebase',   status: 'warning' },
        { id: 4, timestamp: Date.now() - 90000000,  admin: 'john_doe',   action: 'CONFIG_UPDATE', database: 'PostgreSQL', status: 'success' },
        { id: 5, timestamp: Date.now() - 604800000, admin: 'superadmin', action: 'ENABLED',       database: 'Redis',      status: 'success' }
    ];

    const DEFAULT_USERS = [
        { id: 1, name: 'Admin User',   email: 'admin@placenix.ai',  role: 'Super Admin', lastLogin: Date.now() - 60000,    status: 'online'  },
        { id: 2, name: 'John Doe',     email: 'john@placenix.ai',   role: 'Editor',      lastLogin: Date.now() - 3600000,  status: 'online'  },
        { id: 3, name: 'Jane Smith',   email: 'jane@university.edu',role: 'Student',     lastLogin: Date.now() - 86400000, status: 'offline' },
        { id: 4, name: 'Raj Kumar',    email: 'raj@university.edu', role: 'Student',     lastLogin: Date.now() - 7200000,  status: 'online'  }
    ];

    /* ══════ HELPERS ══════ */
    function _load(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch { return fallback; }
    }

    function _save(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    function _nextId(arr) {
        return arr.length > 0 ? Math.max(...arr.map(i => i.id)) + 1 : 1;
    }

    function _init() {
        if (!localStorage.getItem(KEYS.DATABASES)) _save(KEYS.DATABASES, DEFAULT_DATABASES);
        if (!localStorage.getItem(KEYS.ACTIVITY))  _save(KEYS.ACTIVITY, DEFAULT_LOG);
        if (!localStorage.getItem(KEYS.USERS))     _save(KEYS.USERS, DEFAULT_USERS);
    }

    _init();

    /* ══════ TIME FORMATTER ══════ */
    function timeAgo(ts) {
        const seconds = Math.floor((Date.now() - ts) / 1000);
        if (seconds < 10)    return 'Just now';
        if (seconds < 60)    return seconds + 's ago';
        if (seconds < 3600)  return Math.floor(seconds / 60) + 'm ago';
        if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
        if (seconds < 604800) return Math.floor(seconds / 86400) + 'd ago';
        return new Date(ts).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    function formatTimestamp(ts) {
        const d = new Date(ts);
        const now = new Date();
        const diffDays = Math.floor((now - d) / 86400000);
        const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (diffDays === 0) return `Today ${time}`;
        if (diffDays === 1) return `Yesterday ${time}`;
        return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    /* ══════ DATABASE CRUD ══════ */
    return {
        /* — Get all databases — */
        getAllDatabases() {
            return _load(KEYS.DATABASES, DEFAULT_DATABASES);
        },

        /* — Get single — */
        getDatabase(id) {
            return this.getAllDatabases().find(d => d.id === id) || null;
        },

        /* — Add new database — */
        addDatabase({ name, category, desc, icon, color, enabled }) {
            const dbs = this.getAllDatabases();
            const newDb = {
                id: _nextId(dbs),
                name, category,
                icon: icon || '🛢️',
                color: color || 'bg-blue',
                desc: desc || '',
                enabled: enabled !== false,
                lastSynced: Date.now()
            };
            dbs.push(newDb);
            _save(KEYS.DATABASES, dbs);
            this.addLog('ADD', name, 'success');
            return newDb;
        },

        /* — Toggle enable/disable — */
        toggleDatabase(id) {
            const dbs = this.getAllDatabases();
            const db = dbs.find(d => d.id === id);
            if (!db) return null;
            db.enabled = !db.enabled;
            db.syncing = false;
            _save(KEYS.DATABASES, dbs);
            this.addLog(db.enabled ? 'ENABLED' : 'DISABLED', db.name, 'success');
            return db;
        },

        /* — Delete — */
        deleteDatabase(id) {
            let dbs = this.getAllDatabases();
            const db = dbs.find(d => d.id === id);
            if (!db) return false;
            dbs = dbs.filter(d => d.id !== id);
            _save(KEYS.DATABASES, dbs);
            this.addLog('DELETED', db.name, 'warning');
            return true;
        },

        /* — Update config — */
        updateDatabase(id, updates) {
            const dbs = this.getAllDatabases();
            const db = dbs.find(d => d.id === id);
            if (!db) return null;
            Object.assign(db, updates);
            _save(KEYS.DATABASES, dbs);
            this.addLog('CONFIG_UPDATE', db.name, 'success');
            return db;
        },

        /* — Sync single — */
        syncDatabase(id) {
            const dbs = this.getAllDatabases();
            const db = dbs.find(d => d.id === id);
            if (!db) return null;
            db.lastSynced = Date.now();
            db.syncing = false;
            _save(KEYS.DATABASES, dbs);
            this.addLog('SYNC', db.name, 'success');
            return db;
        },

        /* — Sync all enabled — */
        syncAll() {
            const dbs = this.getAllDatabases();
            let count = 0;
            dbs.forEach(db => {
                if (db.enabled) {
                    db.lastSynced = Date.now();
                    db.syncing = false;
                    count++;
                }
            });
            _save(KEYS.DATABASES, dbs);
            this.addLog('SYNC_ALL', `${count} databases`, 'success');
            return count;
        },

        /* — Stats — */
        getStats() {
            const dbs = this.getAllDatabases();
            return {
                total:    dbs.length,
                active:   dbs.filter(d => d.enabled && !d.syncing).length,
                inactive: dbs.filter(d => !d.enabled).length,
                syncing:  dbs.filter(d => d.syncing).length
            };
        },

        /* ══════ ACTIVITY LOG ══════ */
        getActivityLog(limit = 20) {
            const log = _load(KEYS.ACTIVITY, DEFAULT_LOG);
            return log.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);
        },

        addLog(action, database, status = 'success') {
            const log = _load(KEYS.ACTIVITY, []);
            const user = JSON.parse(localStorage.getItem('placenix_user') || '{}');
            log.push({
                id: _nextId(log),
                timestamp: Date.now(),
                admin: user.name || 'superadmin',
                action,
                database,
                status
            });
            _save(KEYS.ACTIVITY, log);
        },

        clearLog() {
            _save(KEYS.ACTIVITY, []);
        },

        /* ══════ USER MANAGEMENT ══════ */
        getAllUsers() {
            return _load(KEYS.USERS, DEFAULT_USERS);
        },

        addUser({ name, email, role }) {
            const users = this.getAllUsers();
            const newUser = {
                id: _nextId(users),
                name, email,
                role: role || 'Student',
                lastLogin: Date.now(),
                status: 'offline'
            };
            users.push(newUser);
            _save(KEYS.USERS, users);
            return newUser;
        },

        updateUserRole(id, role) {
            const users = this.getAllUsers();
            const user = users.find(u => u.id === id);
            if (!user) return null;
            user.role = role;
            _save(KEYS.USERS, users);
            this.addLog('ROLE_CHANGE', `${user.name} → ${role}`, 'success');
            return user;
        },

        deleteUser(id) {
            let users = this.getAllUsers();
            users = users.filter(u => u.id !== id);
            _save(KEYS.USERS, users);
            return true;
        },

        /* ══════ UTILITIES ══════ */
        timeAgo,
        formatTimestamp,

        /* — Reset to factory (for debugging) — */
        resetAll() {
            localStorage.removeItem(KEYS.DATABASES);
            localStorage.removeItem(KEYS.ACTIVITY);
            localStorage.removeItem(KEYS.USERS);
            _init();
        }
    };

})();

// Expose globally for vanilla JS pages
window.BackendService = BackendService;
