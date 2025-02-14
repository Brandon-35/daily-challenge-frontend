import Component from '../core/component.js';

class DashboardComponent extends Component {
    constructor(options = {}) {
        super({
            ...options,
            tag: 'div',
            class_name: 'dashboard-container'
        });
    }

    _create_challenges_section(challenges) {
        const section = this.create_element('section', {
            class_list: ['daily-challenges'],
            children: [
                this.create_element('h2', { 
                    text_content: 'Today\'s Challenges' 
                })
            ]
        });

        if (!challenges || challenges.length === 0) {
            section.appendChild(
                this.create_element('p', { 
                    text_content: 'No challenges today. Create a new challenge!' 
                })
            );
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
                        this.create_element('span', { 
                            class_list: ['challenge-progress'],
                            text_content: `${challenge.progress}%` 
                        })
                    ]
                });

                challengesList.appendChild(challengeItem);
            });

            section.appendChild(challengesList);
        }

        return section;
    }

    _create_logs_section(logs) {
        const section = this.create_element('section', {
            class_list: ['recent-logs'],
            children: [
                this.create_element('h2', { 
                    text_content: 'Recent Activity' 
                })
            ]
        });

        if (!logs || logs.length === 0) {
            section.appendChild(
                this.create_element('p', { 
                    text_content: 'No recent activity.' 
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

            section.appendChild(logsList);
        }

        return section;
    }

    _create_achievements_section(achievements) {
        const section = this.create_element('section', {
            class_list: ['achievements'],
            children: [
                this.create_element('h2', { 
                    text_content: 'Achievements' 
                })
            ]
        });

        if (!achievements || achievements.length === 0) {
            section.appendChild(
                this.create_element('p', { 
                    text_content: 'No achievements yet. Keep challenging yourself!' 
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

            section.appendChild(achievementsList);
        }

        return section;
    }

    async render() {
        // Clear previous content
        this.ui.clear_container(this.element);

        // Create dashboard content
        const state = this.store ? this.store.get_state() : {};
        const dashboard = this.create_element('div', {
            class_list: ['dashboard'],
            children: [
                this.create_element('h1', { 
                    text_content: `Welcome, ${state.user ? state.user.name : 'User'}!` 
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