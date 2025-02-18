import Base from './core/base.js';
import Store from './core/store.js';
import NavComponent from './components/nav_component.js';
import DashboardComponent from './components/dashboard_component.js';
import LoginComponent from './components/login_component.js';
import ChallengesComponent from './components/challenges_component.js';
import LogsComponent from './components/logs_component.js';
import ProfileComponent from './components/profile_component.js';

import { configure_router } from './app_router.js'; // Import router configuration

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
		this.router = configure_router(this); // Use the new router configuration

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

	// Helper function to render nav and content
	async render_protected_page(content_component) {
		const app_container = document.getElementById('app');
		app_container.innerHTML = '';

		// Render nav first
		const nav = new NavComponent({
			store: this.store,
			parent: app_container
		});
		await nav.mount();

		// Render content component
		const component = new content_component({
			store: this.store,
			parent: app_container
		});
		await component.mount();
	}

	async render_dashboard(router) {
		// const dashboard_component = await import('./components/dashboard_component.js');
		await this.render_protected_page(DashboardComponent);
	}

	async render_challenges(router) {
		// const challenges_component = await import('./components/challenges_component.js');
		await this.render_protected_page(ChallengesComponent);
	}

	async render_logs(router) {
		// const logs_component = await import('./components/logs_component.js');
		await this.render_protected_page(LogsComponent);
	}

	async render_profile(router) {
		// const profile_component = await import('./components/profile_component.js');
		await this.render_protected_page(ProfileComponent);
	}

	async render_login() {
		const app_container = document.getElementById('app');
		app_container.innerHTML = '';

		// const login_component = await import('./components/login_component.js');
		const login = new LoginComponent({
			store: this.store,
			router: this.router,
			parent: app_container
		});
		await login.mount(app_container);
	}

	async render_style_guide() {
		const app_container = document.getElementById('app');
		app_container.innerHTML = '';

		// Import and render the style guide component
		const StyleGuideComponent = (await import('./components/style_guide_component.js')).default; // Assuming default export
		const styleGuide = new StyleGuideComponent({
			store: this.store,
			parent: app_container
		});
		await styleGuide.mount();
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
				state.challenges[index] = { ...state.challenges[index], ...challenge_data };
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
                this.store.commit('set_user', user_data);
                
                if (window.location.pathname === '/login') {
                    this.router.navigate_to('/');
                }

            } catch (error) {
                console.error('Session restoration error:', error);
                this.router.navigate_to('/login');
            }
        } else {
            // No stored user, go to login
            this.router.navigate_to('/login');
        }
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