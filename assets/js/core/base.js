import UICore from './ui-core.js';
class Base {
    constructor() {
        this.state = {};
        this.hooks = new Map();
        this.global_hooks = window._global_hooks || {};
        window._global_hooks = this.global_hooks;
        
        // Initialize UI core
        this.ui = new UICore();
    }

    // State management
    get_state(key) {
        return key ? this.state[key] : this.state;
    }

    set_state(key, value) {
        if (typeof key === 'object') {
            this.state = { ...this.state, ...key };
        } else {
            this.state[key] = value;
        }
        return this;
    }

    // DOM helpers
    get_element() {
        return this.get_state('el');
    }

    // Hook system
    add_hook(key, callback) {
        if (typeof callback !== 'function') return this;
        
        if (!this.hooks.has(key)) {
            this.hooks.set(key, []);
        }
        this.hooks.get(key).push(callback);
        return this;
    }

    run_hook(key, data = null) {
        if (!this.hooks.has(key)) return this;
        
        this.hooks.get(key).forEach(callback => {
            if (typeof callback === 'function') {
                callback(data);
            }
        });
        return this;
    }

    // Global hook system
    add_global_hook(key, callback) {
        if (typeof callback !== 'function') return this;
        
        if (!this.global_hooks[key]) {
            this.global_hooks[key] = [];
        }
        this.global_hooks[key].push(callback);
        return this;
    }

    run_global_hook(key, data = null) {
        if (!this.global_hooks[key]) return this;

        this.global_hooks[key].forEach(callback => {
            if (typeof callback === 'function') {
                callback(data);
            }
        });
        return this;
    }

    // Storage management
    save_to_storage(key, value) {
        localStorage.setItem(this._generate_storage_key(key), value);
        return this;
    }

    get_from_storage(key) {
        return localStorage.getItem(this._generate_storage_key(key));
    }

    clear_storage() {
        localStorage.clear();
        return this;
    }

    // DOM manipulation
    create_element(tag, options = {}) {
        const element = document.createElement(tag);
        
        if (options.class_list) {
            element.classList.add(...options.class_list);
        }
        
        if (options.dataset) {
            Object.entries(options.dataset).forEach(([key, value]) => {
                element.dataset[key] = value;
            });
        }
        
        if (options.attributes) {
            Object.entries(options.attributes).forEach(([key, value]) => {
                element.setAttribute(key, value);
            });
        }
        
        if (options.text_content) {
            element.textContent = options.text_content;
        }
        
        if (options.html) {
            element.innerHTML = options.html;
        }
        
        if (options.events) {
            Object.entries(options.events).forEach(([event, handler]) => {
                element.addEventListener(event, handler);
            });
        }
        
        if (options.children) {
            options.children.forEach(child => {
                element.appendChild(
                    child instanceof Node ? child : document.createTextNode(child)
                );
            });
        }

        return element;
    }

    // Private methods
    _generate_storage_key(key) {
        const version = this.get_state('version') || '1.0.0';
        const prefix = this.get_state('storage_prefix') || 'app';
        return `${prefix}-${version}-${key}`;
    }
}

export default Base;