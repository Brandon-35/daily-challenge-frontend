// nav_component.js
import Component from '../core/component.js';

class NavComponent extends Component {
    constructor(options = {}) {
        super({
            ...options,
            tag: 'nav',
            class_name: 'app-nav'
        });
    }

    async render() {
        const nav_items = [
            { path: '/', label: 'Dashboard' },
            { path: '/challenges', label: 'Challenges' },
            { path: '/logs', label: 'Logs' },
            { path: '/profile', label: 'Profile' }
        ];

        const nav_list = this.create_element('ul', {
            class_list: ['nav-list']
        });

        nav_items.forEach(item => {
            const nav_item = this.create_element('li', {
                class_list: ['nav-item'],
                children: [
                    this.create_element('a', {
                        class_list: ['nav-link'],
                        text_content: item.label,
                        attributes: {
                            href: item.path
                        }
                    })
                ]
            });

            nav_list.appendChild(nav_item);
        });

        this.element.appendChild(nav_list);
        return this;
    }
}

export default NavComponent;