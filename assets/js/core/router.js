import Base from './base.js';

class Router extends Base {
    constructor(options = {}) {
        super();
        this.routes = new Map();
        this.middlewares = [];
        this.current_route = null;
        this.params = {};
        this.query = {};
        
        // Router configuration
        this.config = {
            mode: options.mode || 'history',
            root: options.root || '/',
            not_found_handler: options.not_found_handler || this._default_not_found_handler.bind(this)
        };

        // Initialize router
        this._init();
    }

    // Add route
    add_route(path, handler, middleware = []) {
        const route_pattern = this._path_to_regex(path);
        this.routes.set(route_pattern, { handler, middleware });
        return this;
    }

    // Add global middleware
    add_middleware(middleware) {
        if (typeof middleware === 'function') {
            this.middlewares.push(middleware);
        }
        return this;
    }

    // Navigate to path
    navigate_to(path, data = {}) {
        const url = this._create_url(path);
        
        if (this.config.mode === 'history') {
            window.history.pushState(data, '', url);
            return this._handle_route();
        }
        
        window.location.href = url;
        return this;
    }

    // Initialize router
    _init() {
        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this._handle_route();
        });

        // Handle initial route
        window.addEventListener('load', () => {
            this._handle_route();
        });
        
        // Intercept link clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;

            const href = link.getAttribute('href');
            if (!href || href.startsWith('http') || href.startsWith('//')) return;

            e.preventDefault();
            this.navigate_to(href);
        });
    }

    // Handle current route
    async _handle_route() {
        const path = this._get_current_path();
        let matched_route = null;
        let params = {};

        for (const [pattern, route] of this.routes) {
            const match = path.match(pattern);
            if (match) {
                matched_route = route;
                params = this._extract_params(pattern, match);
                break;
            }
        }

        if (!matched_route) {
            return this.config.not_found_handler();
        }

        this.current_route = matched_route;
        this.params = params;
        this.query = this._extract_query();

        try {
            const app_container = document.getElementById('app');
            app_container.innerHTML = '';

            for (const middleware of this.middlewares) {
                await middleware(this);
            }

            for (const middleware of matched_route.middleware) {
                await middleware(this);
            }

            await matched_route.handler(this);
            
            this.run_hook('route:change', {
                path,
                params: this.params,
                query: this.query
            });

        } catch (error) {
            console.error('Route handling error:', error);
            this.run_hook('route:error', error);
        }
    }

    async _update_active_nav(path) {
        const nav_links = document.querySelectorAll('.nav-link');
        nav_links.forEach(link => {
            if (link.getAttribute('href') === path) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // Convert path to regex pattern
    _path_to_regex(path) {
        return new RegExp(
            '^' + path
                .replace(/\//g, '\\/') 
                .replace(/:\w+/g, '([^/]+)')
                .replace(/\*\w+/g, '(.*)') + 
            '$'
        );
    }

    // Extract params from path
    _extract_params(pattern, match) {
        const params = {};
        const param_names = pattern.toString()
            .match(/:\w+/g) || [];

        param_names.forEach((name, index) => {
            params[name.substring(1)] = match[index + 1];
        });

        return params;
    }

    // Extract query parameters
    _extract_query() {
        const query = {};
        const search_params = new URLSearchParams(window.location.search);
        
        for (const [key, value] of search_params) {
            query[key] = value;
        }
        
        return query;
    }

    // Get current path
    _get_current_path() {
        let path = '';
        
        if (this.config.mode === 'history') {
            path = window.location.pathname + window.location.search;
            if (this.config.root !== '/') {
                path = path.replace(this.config.root, '');
            }
        } else {
            const match = window.location.href.match(/#(.*)$/);
            path = match ? match[1] : '/';
        }

        return path || '/';
    }

    // Create URL with root path
    _create_url(path) {
        if (this.config.mode === 'history') {
            return this.config.root + path.replace(/^\/+/, '');
        }
        return '#' + path;
    }

    // Default 404 handler
    _default_not_found_handler() {
        console.error('Route not found');
        this.run_hook('route:not_found');
    }
}

export default Router;