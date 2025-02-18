import PageComponent from './page_component.js';

class DashboardComponent extends PageComponent {
    constructor(options = {}) {
        super({
            ...options,
            class_name: 'dashboard-container'
        });
    }

    _create_stats_cards() {
        const state = this.store ? this.store.get_state() : {};
        
        return [
            this.create_card({
                title: 'Current Streak',
                content: `
                    <div class="stat-value">
                        <span class="number">${state.streak || 0}</span>
                        <span class="label">days</span>
                    </div>
                `,
                class_list: ['stat-card', 'streak-card']
            }),
            this.create_card({
                title: 'Points',
                content: `
                    <div class="stat-value">
                        <span class="number">${state.points || 0}</span>
                        <span class="label">total</span>
                    </div>
                `,
                class_list: ['stat-card', 'points-card']
            }),
            this.create_card({
                title: 'Rank',
                content: `
                    <div class="stat-value">
                        <span class="number">#${state.rank || 0}</span>
                        <span class="label">global</span>
                    </div>
                `,
                class_list: ['stat-card', 'rank-card']
            }),
            this.create_card({
                title: 'Badges',
                content: `
                    <div class="stat-value">
                        <span class="number">${state.badges?.length || 0}</span>
                        <span class="label">earned</span>
                    </div>
                `,
                class_list: ['stat-card', 'badges-card']
            })
        ];
    }

    _create_challenges_list(challenges = []) {
        if (!challenges.length) {
            return this.create_element('div', {
                class_list: ['empty-state'],
                children: [
                    this.create_element('p', {
                        text_content: 'No challenges today. Create a new challenge!'
                    }),
                    this.create_element('button', {
                        class_list: ['btn', 'btn-primary'],
                        text_content: '+ Create Challenge',
                        events: {
                            click: () => this._handle_new_challenge()
                        }
                    })
                ]
            });
        }

        return this.create_element('ul', {
            class_list: ['challenges-list'],
            children: challenges.map(challenge => 
                this.create_element('li', {
                    class_list: ['challenge-item'],
                    dataset: { 'challenge-id': challenge.id },
                    children: [
                        this.create_element('div', {
                            class_list: ['challenge-info'],
                            children: [
                                this.create_element('h4', {
                                    text_content: challenge.title,
                                    class_list: ['challenge-title']
                                }),
                                this.create_element('span', {
                                    text_content: challenge.description,
                                    class_list: ['challenge-description']
                                })
                            ]
                        }),
                        this.create_element('div', {
                            class_list: ['challenge-progress'],
                            children: [
                                this.create_element('div', {
                                    class_list: ['progress-bar'],
                                    children: [
                                        this.create_element('div', {
                                            class_list: ['progress'],
                                            attributes: {
                                                style: `width: ${challenge.progress}%`
                                            }
                                        })
                                    ]
                                }),
                                this.create_element('span', {
                                    text_content: `${challenge.progress}%`,
                                    class_list: ['progress-text']
                                })
                            ]
                        })
                    ]
                })
            )
        });
    }

    _create_activity_list(logs = []) {
        if (!logs.length) {
            return this.create_element('div', {
                class_list: ['empty-state'],
                text_content: 'No recent activity.'
            });
        }

        return this.create_element('ul', {
            class_list: ['activity-list'],
            children: logs.map(log => 
                this.create_element('li', {
                    class_list: ['activity-item'],
                    children: [
                        this.create_element('span', {
                            text_content: log.date,
                            class_list: ['activity-date']
                        }),
                        this.create_element('p', {
                            text_content: log.description,
                            class_list: ['activity-description']
                        })
                    ]
                })
            )
        });
    }

    async render() {
        await super.render();
        
        const state = this.store ? this.store.get_state() : {};
        const user = state.user || {};

        // Set page title and welcome message
        this.set_page_title(
            `Welcome back, ${user.name || 'User'}!`,
            'Your progress this week is looking great. Keep it up!'
        );

        // Add header actions
        this.add_header_actions([
            {
                label: 'New Challenge',
                type: 'primary',
                on_click: () => this._handle_new_challenge()
            },
            {
                label: 'Filter',
                type: 'secondary',
                on_click: () => this._handle_filter()
            }
        ]);

        // Add stats section
        const stats_section = this.add_section({
            title: 'Overview',
            class_list: ['stats-section']
        });
        stats_section.appendChild(
            this.create_grid(this._create_stats_cards(), 4)
        );

        // Add challenges section
        const challenges_section = this.add_section({
            title: 'Today\'s Challenges',
            class_list: ['challenges-section'],
            content: this._create_challenges_list(state.challenges)
        });

        // Add activity section
        const activity_section = this.add_section({
            title: 'Recent Activity',
            class_list: ['activity-section'],
            content: this._create_activity_list(state.logs)
        });

        return this;
    }

    _handle_new_challenge() {
        // Implement new challenge creation
        console.log('Creating new challenge...');
    }

    _handle_filter() {
        // Implement filtering
        console.log('Opening filter options...');
    }

    async mounted() {
        // Add event listeners
        this.add_event('click', '.challenge-item', this._handle_challenge_click);
    }

    _handle_challenge_click(event, target) {
        const challenge_id = target.dataset.challengeId;
        console.log(`Clicked challenge with ID: ${challenge_id}`);
        // Implement navigation or detailed view
    }
}

export default DashboardComponent;