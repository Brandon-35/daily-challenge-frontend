import Component from '../core/component.js';

class LogsComponent extends Component {
    constructor(options = {}) {
        super({
            ...options,
            tag: 'div',
            class_name: 'logs-container page-content'
        });

        this.store = options.store;
        this.router = options.router;
    }

    async create_log_item(log) {
        const logItem = this.create_element('div', {
            class_list: ['log-item'],
            text_content: log.message // Giả sử log có thuộc tính message
        });

        return logItem;
    }

    create_empty_state() {
        return this.create_element('div', {
            class_list: ['empty-state'],
            children: [
                this.create_element('p', {
                    text_content: 'No logs available. Check back later!'
                })
            ]
        });
    }

    async render() {
        // Clear previous content
        this.ui.clear_container(this.element);

        // Get logs from store
        const logs = this.store.get_state('logs');

        const wrappers = this.create_element('div', {
            class_list: ['logs-wrapper']
        });

        // Create header section
        const header = this.create_element('header', {
            class_list: ['logs-header'],
            children: [
                this.create_element('h1', {
                    text_content: 'Logs'
                })
            ]
        });

        wrappers.appendChild(header);

        // Create logs list or empty state
        if (logs.length > 0) {
            const list = this.create_element('ul', {
                class_list: ['logs-list']
            });

            for (const log of logs) {
                const itemElement = await this.create_log_item(log);
                list.appendChild(itemElement);
            }

            wrappers.appendChild(list);
        } else {
            wrappers.appendChild(this.create_empty_state());
        }

        this.element.appendChild(wrappers);

        return this;
    }

    async mounted() {
        // Add event listeners or initialize other features if needed
    }
}

export default LogsComponent; 