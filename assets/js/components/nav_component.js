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
            { 
                path: '/', 
                label: 'Dashboard',
                icon: '<svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>'
            },
            { 
                path: '/challenges', 
                label: 'Challenges',
                icon: '<svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>'
            },
            { 
                path: '/achievements', 
                label: 'Achievements',
                icon: '<svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 1L9 9l-8 1 6 5.5L5 23l7-4 7 4-2-7.5L23 10l-8-1z"/></svg>'
            },
            { 
                path: '/leaderboard', 
                label: 'Leaderboard',
                icon: '<svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7.5 21H2V9h5.5v12zm7.25-18h-5.5v18h5.5V3zM22 11h-5.5v10H22V11z"/></svg>'
            }
        ];

        const nav_list = this.create_element('ul', {
            class_list: ['nav-list']
        });

        // Add logo section
        const logo_section = this.create_element('div', {
            class_list: ['nav-logo'],
            children: [
                this.create_element('h1', {
                    text_content: 'YourProjectName',
                    class_list: ['logo-text']
                })
            ]
        });

        this.element.appendChild(logo_section);

        // Create navigation items
        nav_items.forEach(item => {
            const nav_item = this.create_element('li', {
                class_list: ['nav-item'],
                children: [
                    this.create_element('a', {
                        class_list: ['nav-link'],
                        innerHTML: `
                            ${item.icon}
                            <span class="nav-label">${item.label}</span>
                        `,
                        attributes: {
                            href: item.path
                        }
                    })
                ]
            });

            nav_list.appendChild(nav_item);
        });

        // Add sections
        const sections = [
            {
                title: 'SOCIAL',
                items: [
                    { label: 'Community', icon: '<!-- community icon svg -->' },
                    { label: 'Following', icon: '<!-- following icon svg -->' },
                    { label: 'Messages', icon: '<!-- messages icon svg -->' }
                ]
            },
            {
                title: 'SETTINGS',
                items: [
                    { label: 'Profile', icon: '<!-- profile icon svg -->' },
                    { label: 'Settings', icon: '<!-- settings icon svg -->' }
                ]
            }
        ];

        sections.forEach(section => {
            const section_element = this.create_element('div', {
                class_list: ['nav-section'],
                children: [
                    this.create_element('h3', {
                        class_list: ['section-title'],
                        text_content: section.title
                    })
                ]
            });
            
            // Add section items
            const section_list = this.create_element('ul', {
                class_list: ['section-list']
            });

            section.items.forEach(item => {
                section_list.appendChild(
                    this.create_element('li', {
                        class_list: ['section-item'],
                        innerHTML: `
                            ${item.icon}
                            <span>${item.label}</span>
                        `
                    })
                );
            });

            section_element.appendChild(section_list);
            nav_list.appendChild(section_element);
        });

        this.element.appendChild(nav_list);
        return this;
    }
}

export default NavComponent;