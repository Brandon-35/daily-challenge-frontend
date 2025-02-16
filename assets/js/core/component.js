import Base from './base.js';

class Component extends Base {
    constructor(options = {}) {
        super();
        
        this.element = null;
        this.template = '';
        this.events = {};
        this.children = new Map();
        
        // Component configuration
        this.config = {
            tag: options.tag || 'div',
            class_name: options.class_name || '',
            template: options.template || '',
            parent: options.parent || document.body,
            state: options.state || {},
            events: options.events || {},
            attributes: options.attributes || {}
        };

        // Initialize component state
        this.set_state(this.config.state);
        
        // Bind events to maintain context
        this._bind_class_methods();
    }

    // Lifecycle hooks
    async before_mount() {}
    async mounted() {}
    async before_update() {}
    async updated() {}
    async before_destroy() {}
    async destroyed() {}

    // Mount component to DOM
    async mount() {
        await this.before_mount();
        
        // Create root element if not exists
        if (!this.element) {
            this.element = document.createElement(this.config.tag);
            this.set_state('el', this.element);
        }

        // Add class name if specified
        if (this.config.class_name) {
            this.element.className = this.config.class_name;
        }

        // Add custom attributes
        Object.entries(this.config.attributes).forEach(([key, value]) => {
            this.element.setAttribute(key, value);
        });

        // Set initial template
        await this.render();

        // Attach events
        this._bind_events();

        // Mount to parent
        if (this.config.parent && !this.element.parentNode) {
            this.config.parent.appendChild(this.element);
        }

        await this.mounted();
        return this;
    }

    // Update component
    async update(new_state = {}) {
        await this.before_update();
        
        // Update state
        this.set_state(new_state);
        
        // Re-render template
        await this.render();
        
        await this.updated();
        return this;
    }

    // Destroy component
    async destroy() {
        await this.before_destroy();

        // Remove event listeners
        this._unbind_events();

        // Destroy child components
        for (const child of this.children.values()) {
            await child.destroy();
        }
        this.children.clear();

        // Remove from DOM
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }

        await this.destroyed();
        return this;
    }

    // Render template
    async render() {
        if (!this.element) return this;

        // Get template string
        let template = typeof this.config.template === 'function' 
            ? this.config.template(this.get_state())
            : this.config.template;

        // Process template (can be overridden for different template engines)
        template = await this._process_template(template);

        // Update DOM
        this.element.innerHTML = template;

        return this;
    }

    // Add child component
    add_child(key, component) {
        if (component instanceof Component) {
            this.children.set(key, component);
        }
        return this;
    }

    // Remove child component
    remove_child(key) {
        const child = this.children.get(key);
        if (child) {
            child.destroy();
            this.children.delete(key);
        }
        return this;
    }

    // Add event listener
    add_event(event, selector, handler) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push({ selector, handler });
        
        // Bind event if element exists
        if (this.element) {
            this._bind_event(event, selector, handler);
        }
        return this;
    }

    // Private methods
    _bind_class_methods() {
        // Get all methods from class prototype
        const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
        
        // Bind all methods except constructor and private methods
        methods.forEach(method => {
            if (method !== 'constructor' && !method.startsWith('_')) {
                this[method] = this[method].bind(this);
            }
        });
    }

    _bind_events() {
        // Bind configured events
        Object.entries(this.config.events).forEach(([event, handler]) => {
            this.add_event(event, null, handler);
        });

        // Bind events from events property
        Object.entries(this.events).forEach(([event, handlers]) => {
            handlers.forEach(({ selector, handler }) => {
                this._bind_event(event, selector, handler);
            });
        });
    }

    _bind_event(event, selector, handler) {
        const listener = (e) => {
            if (!selector) {
                handler.call(this, e);
                return;
            }

            const target = e.target.closest(selector);
            if (target && this.element.contains(target)) {
                handler.call(this, e, target);
            }
        };

        this.element.addEventListener(event, listener);
        
        // Store listener reference for cleanup
        if (!this.element._listeners) {
            this.element._listeners = new Map();
        }
        if (!this.element._listeners.has(event)) {
            this.element._listeners.set(event, new Set());
        }
        this.element._listeners.get(event).add(listener);
    }

    _unbind_events() {
        if (!this.element || !this.element._listeners) return;

        // Remove all event listeners
        this.element._listeners.forEach((listeners, event) => {
            listeners.forEach(listener => {
                this.element.removeEventListener(event, listener);
            });
        });
        
        this.element._listeners.clear();
    }

    async _process_template(template) {
        // Basic template processing
        // Override this method to use template engine
        return template.replace(/\${(.*?)}/g, (match, key) => {
            return this.get_state(key.trim()) || '';
        });
    }

    async unmount() {
        if (this.element && this.element.parentNode) {
            // Remove event listeners
            this._unbind_events();
            
            // Remove from DOM
            this.element.parentNode.removeChild(this.element);
            
            // Clear references
            this.element = null;
        }
    }
}

export default Component;