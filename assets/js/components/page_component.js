class PageComponent extends Component {
    constructor(options = {}) {
        super({
            ...options,
            tag: 'div',
            class_name: 'page-container'
        });

        this.header = null;
        this.content = null;
    }

    async render() {
        // Create page header section
        this.header = this.create_element('header', {
            class_list: ['page-header']
        });

        // Create page content section
        this.content = this.create_element('main', {
            class_list: ['page-content']
        });

        // Create basic structure
        const structure = [
            this.header,
            this.content
        ];

        // Append all elements to page
        structure.forEach(element => {
            if (element) this.element.appendChild(element);
        });

        return this;
    }

    // Helper method to set page title
    set_page_title(title, subtitle = '') {
        if (!this.header) return;

        const title_section = this.create_element('div', {
            class_list: ['page-title-section'],
            children: [
                this.create_element('h1', {
                    class_list: ['page-title'],
                    text_content: title
                })
            ]
        });

        if (subtitle) {
            title_section.appendChild(
                this.create_element('p', {
                    class_list: ['page-subtitle'],
                    text_content: subtitle
                })
            );
        }

        this.header.appendChild(title_section);
    }

    // Helper method to add action buttons to header
    add_header_actions(actions = []) {
        if (!this.header) return;

        const action_section = this.create_element('div', {
            class_list: ['page-actions']
        });

        actions.forEach(action => {
            const button = this.create_element('button', {
                class_list: ['btn', `btn-${action.type || 'primary'}`],
                text_content: action.label,
                attributes: {
                    type: 'button'
                }
            });

            if (action.on_click) {
                button.addEventListener('click', action.on_click);
            }

            action_section.appendChild(button);
        });

        this.header.appendChild(action_section);
    }

    // Helper method to add content sections
    add_section(options = {}) {
        const section = this.create_element('section', {
            class_list: ['content-section', ...(options.class_list || [])]
        });

        if (options.title) {
            section.appendChild(
                this.create_element('h2', {
                    class_list: ['section-title'],
                    text_content: options.title
                })
            );
        }

        if (options.content) {
            section.appendChild(options.content);
        }

        this.content.appendChild(section);
        return section;
    }

    // Helper method to create card elements
    create_card(options = {}) {
        const card = this.create_element('div', {
            class_list: ['card', ...(options.class_list || [])]
        });

        if (options.title) {
            card.appendChild(
                this.create_element('h3', {
                    class_list: ['card-title'],
                    text_content: options.title
                })
            );
        }

        if (options.content) {
            const card_content = this.create_element('div', {
                class_list: ['card-content']
            });
            
            if (typeof options.content === 'string') {
                card_content.innerHTML = options.content;
            } else {
                card_content.appendChild(options.content);
            }
            
            card.appendChild(card_content);
        }

        return card;
    }

    // Helper method to create grid layouts
    create_grid(items = [], columns = 2) {
        return this.create_element('div', {
            class_list: ['grid', `grid-cols-${columns}`],
            children: items
        });
    }
} 