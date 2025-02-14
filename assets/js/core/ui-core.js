class UICore {
    constructor() {
        this.loading_template = `
            <div class='status-overlay-wrapper'>
                <div class='status-overlay-inner'>
                    <div class='s-content'>
                        <div class='s-content-inner'>
                            <span class='loading-spinner'></span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Toggle element visibility
    show(element) {
        if (!element) return;
        element.setAttribute('data-display', '1');
        return this;
    }

    hide(element) {
        if (!element) return;
        element.setAttribute('data-display', '-1');
        return this;
    }

    // Add/remove loading state
    start_loading(container) {
        if (!container) return this;

        // Don't add loading state to form elements
        const tag = container.tagName.toLowerCase();
        if (['input', 'select', 'textarea', 'button'].includes(tag)) {
            container.setAttribute('data-status', 'waiting');
            return this;
        }

        // Add loading overlay if not exists
        if (!container.querySelector('.status-overlay-wrapper')) {
            container.insertAdjacentHTML('beforeend', this.loading_template);
            container.setAttribute('data-status-ready', '1');
        }

        container.setAttribute('data-status', 'waiting');
        return this;
    }

    stop_loading(container) {
        if (!container) {
            document.body.setAttribute('data-status', 'done');
            return this;
        }

        if (!container.hasAttribute('data-status-ready')) {
            this.prep_loading_state(container);
        }

        container.setAttribute('data-status', 'done');
        return this;
    }

    // Clear container contents
    clear_container(container, callback) {
        if (!container) return this;

        const clear_recursive = () => {
            if (container.firstChild) {
                container.removeChild(container.firstChild);
                clear_recursive();
            } else if (typeof callback === 'function') {
                callback();
            }
        };

        clear_recursive();
        return this;
    }

    // Form handling
    reset_form(form) {
        if (!form) return this;

        const inputs = form.querySelectorAll('input,select,textarea');
        inputs.forEach(input => {
            // Skip hidden inputs
            if (input.type === 'hidden') return;

            // Reset value and remove status classes
            input.value = input.dataset.currentValue || '';
            input.classList.remove('has-error', 'has-success');

            // Clear error messages
            if (input.classList.contains('form-control')) {
                const error_messages = input.parentNode.querySelectorAll('.error-message');
                error_messages.forEach(msg => msg.remove());
            }
        });

        return this;
    }

    collect_form_data(form) {
        if (!form) return {};

        const data = {};
        const inputs = form.querySelectorAll('input,select,textarea');

        inputs.forEach(input => {
            if (!input.name) return;

            switch (input.type) {
                case 'checkbox':
                    if (!data[input.name]) data[input.name] = [];
                    if (input.checked) data[input.name].push(input.value);
                    break;

                case 'radio':
                    if (input.checked) data[input.name] = input.value;
                    break;

                case 'file':
                    data[input.name] = input.files;
                    break;

                default:
                    data[input.name] = input.value;
            }
        });

        return data;
    }

    // Set element modes
    set_mode(element, mode) {
        if (!element) return this;
        
        if (!mode) {
            element.removeAttribute('data-mode');
        } else {
            element.setAttribute('data-mode', mode);
        }
        return this;
    }

    // Helper to find container
    get_container(target, selector = '.js-container') {
        if (!target) return null;

        let container = target.querySelector(selector);
        if (!container) {
            container = target.querySelector('[data-type="js-container"]');
        }
        return container || target;
    }

    // Private helper to prepare loading state
    prep_loading_state(container) {
        container.insertAdjacentHTML('beforeend', this.loading_template);
        container.setAttribute('data-status-ready', '1');
        container.classList.add('status-overlay');
    }
}

export default UICore;