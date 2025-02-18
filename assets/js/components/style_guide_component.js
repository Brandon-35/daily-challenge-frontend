import PageComponent from './page_component.js';

class StyleGuideComponent extends PageComponent {
    constructor(options = {}) {
        super({
            ...options,
            class_name: 'style-guide-container'
        });
    }

    _create_typography_section() {
        return this.create_element('div', {
            class_list: ['style-section'],
            children: [
                this.create_element('h1', { text_content: 'Heading 1 (28px)' }),
                this.create_element('h2', { text_content: 'Heading 2 (24px)' }),
                this.create_element('h3', { text_content: 'Heading 3 (20px)' }),
                this.create_element('p', { 
                    text_content: 'Body Text (16px) - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' 
                }),
                this.create_element('small', { 
                    text_content: 'Small Text (14px) - Used for captions and supporting text' 
                }),
                this.create_element('code', { 
                    text_content: 'Code Block (14px) - console.log("Hello World");' 
                })
            ]
        });
    }

    _create_colors_section() {
        const colors = [
            { name: 'Primary', class: 'bg-primary' },
            { name: 'Blue', class: 'bg-blue' },
            { name: 'Green', class: 'bg-green' },
            { name: 'Red', class: 'bg-red' },
            { name: 'Yellow', class: 'bg-yellow' }
        ];

        return this.create_element('div', {
            class_list: ['color-grid'],
            children: colors.map(color => 
                this.create_element('div', {
                    class_list: ['color-item', color.class],
                    children: [
                        this.create_element('span', { 
                            text_content: color.name 
                        })
                    ]
                })
            )
        });
    }

    _create_buttons_section() {
        const buttons = [
            { label: 'Primary Button', class: 'btn-primary' },
            { label: 'Secondary Button', class: 'btn-secondary' },
            { label: 'Success Button', class: 'btn-success' },
            { label: 'Danger Button', class: 'btn-danger' },
            { label: 'Warning Button', class: 'btn-warning' }
        ];

        return this.create_element('div', {
            class_list: ['button-grid'],
            children: buttons.map(btn => 
                this.create_element('button', {
                    class_list: ['btn', btn.class],
                    text_content: btn.label
                })
            )
        });
    }

    _create_cards_section() {
        return this.create_grid([
            this.create_card({
                title: 'Basic Card',
                content: 'A simple card with title and content.'
            }),
            this.create_card({
                title: 'Card with Stats',
                content: `
                    <div class="stat-value">
                        <span class="number">42</span>
                        <span class="label">items</span>
                    </div>
                `
            }),
            this.create_card({
                title: 'Card with Progress',
                content: `
                    <div class="progress-bar">
                        <div class="progress" style="width: 75%"></div>
                    </div>
                    <span class="progress-text">75% Complete</span>
                `
            })
        ], 3);
    }

    async render() {
        await super.render();

        this.set_page_title('Style Guide', 'Visual documentation of UI components');

        // Typography
        const typography_section = this.add_section({
            title: 'Typography',
            content: this._create_typography_section()
        });

        // Colors
        const colors_section = this.add_section({
            title: 'Colors',
            content: this._create_colors_section()
        });

        // Buttons
        const buttons_section = this.add_section({
            title: 'Buttons',
            content: this._create_buttons_section()
        });

        // Cards
        const cards_section = this.add_section({
            title: 'Cards',
            content: this._create_cards_section()
        });

        return this;
    }
}

export default StyleGuideComponent; 