import Base from './core/base.js';
import Router from './core/router.js';
import Store from './core/store.js';
import NavComponent from './components/nav_component.js';
class challenge_tracker_app extends Base {
    constructor() {
        super();
        
        // App version and storage configuration
        this.set_state({
            version: '1.0.0',
            storage_prefix: 'challenge_tracker'
        });

        // Initialize application store
        this.store = new Store({
            persist: true,
            state: {
                user: null,
                challenges: [],
                logs: [],
                achievements: [],
                app_settings: {
                    theme: 'light',
                    notifications: true
                }
            }
        });

        // Initialize router
        this.router = new Router({
            mode: 'history',
            root: '/'
        });

        // Add routes
        this.router.add_route('/', this.render_dashboard.bind(this));
        this.router.add_route('/login', this.render_login.bind(this));
        this.router.add_route('/challenges', this.render_challenges.bind(this));
        this.router.add_route('/logs', this.render_logs.bind(this));
        this.router.add_route('/profile', this.render_profile.bind(this));

        // Register global application hooks
        this.register_global_hooks();

        // Initialize application
        this.init();
    }

    
    // Register global application hooks
    register_global_hooks() {
        // User authentication hook
        this.add_global_hook('user:authenticate', this.handle_authentication.bind(this));
        
        // Logging hook
        this.add_global_hook('log:create', this.handle_log_creation.bind(this));
        
        // Challenge update hook
        this.add_global_hook('challenge:update', this.handle_challenge_update.bind(this));
    }

    // Authentication middleware
    async auth_middleware(router) {
        const user = this.store.get_state('user');
        if (!user) {
            router.navigate_to('/login');
            return false;
        }
        return true;
    }

    // Handle user authentication
    async handle_authentication(user_data) {
        // Save user data to store
        this.store.commit('set_user', user_data);
        
        // Save to local storage
        this.save_to_storage('user', JSON.stringify(user_data));
        
        // Navigate to dashboard
        this.router.navigate_to('/');
    }

    // Handle log creation
    async handle_log_creation(log_data) {
        // Add log to store
        this.store.commit('add_log', log_data);
        
        // Send log to backend (commented out for now)
        // await this.send_log_to_backend(log_data);
    }

    // Handle challenge update
    async handle_challenge_update(challenge_data) {
        // Update challenge in store
        this.store.commit('update_challenge', challenge_data);
        
        // Check and update achievements
        await this.check_achievements(challenge_data);
    }

    // Render methods for different routes
    async render_dashboard(router) {
        // Clear previous components
        const app_container = document.getElementById('app');
        app_container.innerHTML = ''; 
    
        // Import and initialize dashboard component
        const dashboard_component = await import('./components/dashboard_component.js');
        const dashboard = new dashboard_component.default({
            store: this.store,
            parent: app_container
        });
        
        // Mount dashboard to container
        await dashboard.mount(app_container);
    }

    async render_login() {
        const login_component = await import('./components/login_component.js');
        const login = new login_component.default({
            store: this.store,
            router: this.router
        });
        await login.mount(document.getElementById('app'));
    }

    async render_challenges(router) {
        const challenges_component = await import('./components/challenges_component.js');
        const challenges = new challenges_component.default({
            store: this.store
        });
        await challenges.mount(document.getElementById('app'));
    }

    async render_logs(router) {
        const logs_component = await import('./components/logs_component.js');
        const logs = new logs_component.default({
            store: this.store
        });
        await logs.mount(document.getElementById('app'));
    }

    async render_profile(router) {
        const profile_component = await import('./components/profile_component.js');
        const profile = new profile_component.default({
            store: this.store
        });
        await profile.mount(document.getElementById('app'));
    }

    // Initialize application
    async init() {
        // Register store mutations
        this.store.register_mutation('set_user', (state, user_data) => {
            state.user = user_data;
        });

        this.store.register_mutation('add_log', (state, log_data) => {
            state.logs.push(log_data);
        });

        this.store.register_mutation('update_challenge', (state, challenge_data) => {
            const index = state.challenges.findIndex(c => c.id === challenge_data.id);
            if (index !== -1) {
                state.challenges[index] = {...state.challenges[index], ...challenge_data};
            } else {
                state.challenges.push(challenge_data);
            }
        });

        this.store.register_action('logout', async (store) => {
            // Remove user from store
            store.commit('set_user', null);
            
            // Clear stored data
            localStorage.removeItem(`${this.get_state('storage_prefix')}-1.0.0-user`);
            
            // Navigate to login page
            this.router.navigate_to('/login');
        });

        // Check for existing user session
        const stored_user = this.get_from_storage('user');
        
        if (stored_user) {
            try {
                const user_data = JSON.parse(stored_user);
                // In mock version, directly set user
                this.store.commit('set_user', user_data);
                this.router.navigate_to('/');
            } catch (error) {
                console.error('Session restoration error:', error);
                this.router.navigate_to('/login');
            }
        } else {
            // No stored user, go to login
            this.router.navigate_to('/login');
        }
        
        const nav_component = new NavComponent();
        await nav_component.mount(document.getElementById('app'));

    }

    // Placeholder for future implementation
    async check_achievements(challenge_data) {
        // TODO: Implement achievement logic
        console.log('Checking achievements for:', challenge_data);
    }
}

// Initialize and run the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new challenge_tracker_app();
});