import Base from './base.js';

class Store extends Base {
    constructor(options = {}) {
        super();
        
        // Initial state
        this.state = options.state || {};
        
        // Store modules
        this.modules = new Map();
        
        // Registered mutations
        this.mutations = new Map();
        
        // Registered actions 
        this.actions = new Map();
        
        // State subscribers
        this.subscribers = new Set();
        
        // Store configuration
        this.config = {
            persist: options.persist || false,
            storage_key: options.storage_key || 'app_store',
            debug: options.debug || false
        };

        // Initialize store
        this._init();
    }

    // Get state or state property
    get_state(path = null) {
        if (!path) return this.state;
        
        return path.split('.').reduce((obj, key) => {
            return obj && obj[key];
        }, this.state);
    }

    // Register mutation
    register_mutation(name, handler) {
        this.mutations.set(name, handler);
        return this;
    }

    // Register action
    register_action(name, handler) {
        this.actions.set(name, handler);
        return this;
    }

    // Commit mutation
    commit(name, payload = null) {
        const mutation = this.mutations.get(name);
        if (!mutation) {
            throw new Error(`Unknown mutation: ${name}`);
        }

        // Debug logging
        if (this.config.debug) {
            console.log(`[Store] Commit mutation: ${name}`, payload);
        }

        // Create state backup for rollback
        const state_backup = JSON.stringify(this.state);

        try {
            // Execute mutation
            mutation(this.state, payload);
            
            // Notify subscribers
            this._notify_subscribers({
                type: 'mutation',
                name,
                payload
            });

            // Persist state if enabled
            if (this.config.persist) {
                this._persist_state();
            }

        } catch (error) {
            // Rollback state on error
            this.state = JSON.parse(state_backup);
            throw error;
        }

        return this;
    }

    // Dispatch action
    async dispatch(name, payload = null) {
        const action = this.actions.get(name);
        if (!action) {
            throw new Error(`Unknown action: ${name}`);
        }

        // Debug logging
        if (this.config.debug) {
            console.log(`[Store] Dispatch action: ${name}`, payload);
        }

        try {
            // Execute action
            await action(this, payload);
            
            // Notify subscribers
            this._notify_subscribers({
                type: 'action',
                name,
                payload
            });

        } catch (error) {
            console.error(`Action error (${name}):`, error);
            throw error;
        }

        return this;
    }

    // Subscribe to state changes
    subscribe(callback) {
        if (typeof callback === 'function') {
            this.subscribers.add(callback);
        }
        return () => this.subscribers.delete(callback);
    }

    // Register store module
    register_module(name, module) {
        if (this.modules.has(name)) {
            throw new Error(`Module already exists: ${name}`);
        }

        // Initialize module
        const module_instance = module(this);
        this.modules.set(name, module_instance);

        // Set initial module state
        if (module_instance.state) {
            this.state[name] = module_instance.state;
        }

        // Register module mutations
        if (module_instance.mutations) {
            Object.entries(module_instance.mutations).forEach(([key, handler]) => {
                this.register_mutation(`${name}/${key}`, handler);
            });
        }

        // Register module actions
        if (module_instance.actions) {
            Object.entries(module_instance.actions).forEach(([key, handler]) => {
                this.register_action(`${name}/${key}`, handler);
            });
        }

        return this;
    }

    // Reset store state
    reset() {
        this.state = {};
        this._notify_subscribers({
            type: 'reset'
        });
        
        if (this.config.persist) {
            this._persist_state();
        }
        return this;
    }

    // Private methods
    _init() {
        // Load persisted state
        if (this.config.persist) {
            const persisted_state = this._load_persisted_state();
            if (persisted_state) {
                this.state = {...this.state, ...persisted_state};
            }
        }

        // Register hook for state changes
        this.add_hook('state:change', (data) => {
            this._notify_subscribers(data);
        });
    }

    _notify_subscribers(event) {
        this.subscribers.forEach(callback => {
            callback(this.state, event);
        });
    }

    _persist_state() {
        if (!this.config.persist) return;
        
        try {
            localStorage.setItem(
                this.config.storage_key,
                JSON.stringify(this.state)
            );
        } catch (error) {
            console.error('Failed to persist store state:', error);
        }
    }

    _load_persisted_state() {
        try {
            const data = localStorage.getItem(this.config.storage_key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Failed to load persisted store state:', error);
            return null;
        }
    }
}

export default Store;