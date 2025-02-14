// login_component.js
import Component from '../core/component.js';

class LoginComponent extends Component {
    constructor(options = {}) {
        super({
            ...options,
            tag: 'div',
            class_name: 'login-container',
            template: () => `
                <div class="login-wrapper">
                    <div class="login-header">
                        <div class="login-logo">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" class="login-icon">
                                <circle cx="32" cy="32" r="30" fill="#3498db"/>
                                <path d="M32 18l10 10-10 10-10-10z" fill="#ffffff"/>
                                <path d="M22 38l10 10 10-10-10-10z" fill="#ffffff" opacity="0.7"/>
                            </svg>
                            <h1>Challenge Tracker</h1>
                        </div>
                        <p class="login-subtitle">Unlock Your Potential</p>
                    </div>
                    <form id="login-form" class="login-form">
                        <div class="form-group">
                            <div class="input-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="input-icon">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                                </svg>
                                <input 
                                    type="text" 
                                    id="username" 
                                    name="username" 
                                    required 
                                    placeholder="Username"
                                >
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="input-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="input-icon">
                                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                                </svg>
                                <input 
                                    type="password" 
                                    id="password" 
                                    name="password" 
                                    required 
                                    placeholder="Password"
                                >
                            </div>
                        </div>
                        <div id="login-error" class="error-message hidden"></div>
                        <button type="submit" class="btn btn--primary">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="btn-icon">
                                <path d="M11 7l-5.5 5.5 5.5 5.5V14h6v-4h-6V7zm0-5C5.48 2 2 5.48 2 10s3.48 8 8 8 8-3.48 8-8-3.48-8-8-8z"/>
                            </svg>
                            Login
                        </button>
                        <div class="login-footer">
                            <a href="#" class="forgot-password">Forgot Password?</a>
                            <span>|</span>
                            <a href="#" class="create-account">Create Account</a>
                        </div>
                    </form>
                </div>
            `
        });

        // Ensure store is set from options
        this.store = options.store;
        this.router = options.router;
    }
    async mounted() {
        this.add_event('submit', '#login-form', this._handle_login);
        this.add_event('click', '.forgot-password', this._handle_forgot_password);
        this.add_event('click', '.create-account', this._handle_create_account);
    }

    _show_error(message) {
        const existing_error = this.element.querySelector('.login-error');
        if (existing_error) {
            existing_error.remove();
        }

        const error_element = this.create_element('div', {
            class_list: ['login-error', 'error-shake'],
            text_content: message,
            attributes: {
                'role': 'alert'
            }
        });

        const form = this.element.querySelector('#login-form');
        form.insertBefore(error_element, form.querySelector('button'));

        setTimeout(() => {
            if (error_element) {
                error_element.classList.add('error-fade-out');
                setTimeout(() => error_element.remove(), 500);
            }
        }, 3000);
    }

    _hide_error() {
        const error_element = this.element.querySelector('.login-error');
        if (error_element) {
            error_element.remove();
        }
    }

    _handle_login = async (event) => {
        event.preventDefault();
        this._hide_error();

        const form = event.target;
        const username = form.querySelector('#username').value;
        const password = form.querySelector('#password').value;

        const users = {
            'demo': {
                name: 'Demo User',
                token: 'demo-token-12345',
                challenges: [
                    { id: 1, title: 'Daily Coding', progress: 50 },
                    { id: 2, title: 'Exercise', progress: 30 }
                ],
                logs: [
                    { date: '2024-02-15', description: 'Completed 2 hours coding' },
                    { date: '2024-02-14', description: 'Workout session' }
                ],
                achievements: [
                    { title: 'First Challenge', date: '2024-02-10' },
                    { title: 'Streak 5 Days', date: '2024-02-15' }
                ]
            }
        };

        if (!username || !password) {
            this._show_error('Please enter both username and password');
            return;
        }

        if (users[username] && password === 'password') {
            const user_data = users[username];

            if (this.store && this.store.commit) {
                this.store.commit('set_user', user_data);

                user_data.challenges.forEach(challenge =>
                    this.store.commit('update_challenge', challenge)
                );

                user_data.logs.forEach(log =>
                    this.store.commit('add_log', log)
                );

                this.run_global_hook('user:authenticate', user_data);

                if (this.router) {
                    this.router.navigate_to('/');
                }
            } else {
                console.error('Store or commit method is undefined');
                this._show_error('Login system error');
            }
        } else {
            this._show_error('Invalid username or password');
        }
    }

    _handle_forgot_password = (event) => {
        event.preventDefault();
        this._show_error('Forgot password functionality coming soon!');
    }

    _handle_create_account = (event) => {
        event.preventDefault();
        this._show_error('Create account functionality coming soon!');
    }

}

export default LoginComponent;