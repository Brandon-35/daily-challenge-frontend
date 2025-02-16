import Component from '../core/component.js';

class DashboardComponent extends Component {
    constructor(options = {}) {
        super({
            ...options,
            tag: 'div',
            class_name: 'dashboard-container page-content'
        });
    }

    _create_section_header(title, icon_path) {
        return this.create_element('div', {
            class_list: ['section-header'],
            children: [
                this.create_element('svg', {
                    attributes: {
                        xmlns: 'http://www.w3.org/2000/svg',
                        viewBox: '0 0 24 24',
                        class: 'section-icon'
                    },
                    children: [
                        this.create_element('path', {
                            attributes: { d: icon_path }
                        })
                    ]
                }),
                this.create_element('h2', { 
                    text_content: title 
                })
            ]
        });
    }

    _create_challenges_section(challenges) {
        const section = this.create_element('section', {
            class_list: ['dashboard-section', 'daily-challenges']
        });

        // Challenges header with icon
        section.appendChild(this._create_section_header(
            'Today\'s Challenges', 
            'M13 12h7v1.5c0 3-2 4.5-5 4.5h-4v-2h4c1.5 0 2.5-.5 2.5-2v-1h-6c-1.5 0-2.5-1-2.5-2.5V8c0-1.5 1-2.5 2.5-2.5h3V4h1.5v2h2v1.5h-2v1h2v1.5h-2v1c0 .5.5 1 1 1h1c.5 0 1-.5 1-1V9h1.5v2.5c0 1.5-1 2.5-2.5 2.5z'
        ));

        const content = this.create_element('div', {
            class_list: ['section-content']
        });

        if (!challenges || challenges.length === 0) {
            content.appendChild(
                this.create_element('p', { 
                    text_content: 'No challenges today. Create a new challenge!',
                    class_list: ['empty-state']
                })
            );

            const create_button = this.create_element('button', {
                text_content: '+ Create Challenge',
                class_list: ['btn', 'btn--primary', 'create-challenge-btn']
            });
            content.appendChild(create_button);
        } else {
            const challengesList = this.create_element('ul', {
                class_list: ['challenges-list']
            });

            challenges.forEach(challenge => {
                const challengeItem = this.create_element('li', {
                    dataset: { 'challenge-id': challenge.id },
                    children: [
                        this.create_element('span', { 
                            class_list: ['challenge-name'],
                            text_content: challenge.title 
                        }),
                        this.create_element('div', { 
                            class_list: ['challenge-progress-wrapper'],
                            children: [
                                this.create_element('div', {
                                    class_list: ['challenge-progress-bar'],
                                    attributes: {
                                        style: `width: ${challenge.progress}%`
                                    }
                                }),
                                this.create_element('span', { 
                                    class_list: ['challenge-progress-text'],
                                    text_content: `${challenge.progress}%` 
                                })
                            ]
                        })
                    ]
                });

                challengesList.appendChild(challengeItem);
            });

            content.appendChild(challengesList);
        }

        section.appendChild(content);
        return section;
    }

    _create_logs_section(logs) {
        const section = this.create_element('section', {
            class_list: ['dashboard-section', 'recent-logs']
        });

        // Logs header with icon
        section.appendChild(this._create_section_header(
            'Recent Activity', 
            'M13 4h-2v7l4.4 2.8l.8-1.2l-3.2-2V4M2 19h1c.6 0 1-.4 1-1v-5c0-.6-.4-1-1-1H2v7m4 0h1c.6 0 1-.4 1-1v-5c0-.6-.4-1-1-1H6v7m-3-8h7v-2H3v2m12 8h1c.6 0 1-.4 1-1v-5c0-.6-.4-1-1-1h-1v7m-2 0h1l1-3v-4h-5v4l1 3h1'
        ));

        const content = this.create_element('div', {
            class_list: ['section-content']
        });

        if (!logs || logs.length === 0) {
            content.appendChild(
                this.create_element('p', { 
                    text_content: 'No recent activity.',
                    class_list: ['empty-state']
                })
            );
        } else {
            const logsList = this.create_element('ul', {
                class_list: ['logs-list']
            });

            logs.slice(0, 5).forEach(log => {
                const logItem = this.create_element('li', {
                    children: [
                        this.create_element('span', { 
                            class_list: ['log-date'],
                            text_content: log.date 
                        }),
                        this.create_element('span', { 
                            class_list: ['log-description'],
                            text_content: log.description 
                        })
                    ]
                });

                logsList.appendChild(logItem);
            });

            content.appendChild(logsList);
        }

        section.appendChild(content);
        return section;
    }

    _create_achievements_section(achievements) {
        const section = this.create_element('section', {
            class_list: ['dashboard-section', 'achievements']
        });

        // Achievements header with icon
        section.appendChild(this._create_section_header(
            'Achievements', 
            'M12 1L9 9l-8 1 6 5.5L5 23l7-4 7 4l-2-7.5L23 10l-8-1z'
        ));

        const content = this.create_element('div', {
            class_list: ['section-content']
        });

        if (!achievements || achievements.length === 0) {
            content.appendChild(
                this.create_element('p', { 
                    text_content: 'No achievements yet. Keep challenging yourself!',
                    class_list: ['empty-state']
                })
            );
        } else {
            const achievementsList = this.create_element('ul', {
                class_list: ['achievements-list']
            });

            achievements.forEach(achievement => {
                const achievementItem = this.create_element('li', {
                    children: [
                        this.create_element('span', { 
                            class_list: ['achievement-name'],
                            text_content: achievement.title 
                        }),
                        this.create_element('span', { 
                            class_list: ['achievement-date'],
                            text_content: achievement.date 
                        })
                    ]
                });

                achievementsList.appendChild(achievementItem);
            });

            content.appendChild(achievementsList);
        }

        section.appendChild(content);
        return section;
    }

    async render() {
        // Get user information from store
        const state = this.store ? this.store.get_state() : {};
        const user = state.user || {};
    
        // Clear previous content
        this.ui.clear_container(this.element);
    
        // Create dashboard content
        const dashboard = this.create_element('div', {
            class_list: ['dashboard'],
            children: [
                this.create_element('header', {
                    class_list: ['dashboard-header'],
                    children: [
                        this.create_element('h1', { 
                            text_content: `Welcome, ${user.name || 'User'}!`,
                            class_list: ['welcome-title']
                        }),
                        this.create_element('button', {
                            text_content: 'Logout',
                            class_list: ['btn', 'btn--secondary', 'logout-btn'],
                            events: {
                                click: () => {
                                    this.store.dispatch('logout');
                                }
                            }
                        })
                    ]
                }),
                this._create_challenges_section(state.challenges),
                this._create_logs_section(state.logs),
                this._create_achievements_section(state.achievements)
            ]
        });
    
        // Append dashboard to component's element
        this.element.appendChild(dashboard);
    
        return this;
    }

    async mounted() {
        // Add event listeners
        this.add_event('click', '.challenges-list li', this._handle_challenge_click);
    }

    _handle_challenge_click(event, target) {
        const challengeId = target.dataset.challengeId;
        console.log(`Clicked challenge with ID: ${challengeId}`);
        // Implement navigation or detailed view
    }
}

export default DashboardComponent;