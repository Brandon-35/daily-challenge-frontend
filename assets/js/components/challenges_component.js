import Component from '../core/component.js';

class ChallengesComponent extends Component {
    constructor(options = {}) {
        super({
            ...options,
            tag: 'div',
            class_name: 'challenges-container page-content'
        });

        this.store = options.store;
        this.router = options.router; // Thêm router vào constructor
    }

    create_challenge_item(challenge) {
        return this.create_element('li', {
            class_list: ['challenge-item'],
            dataset: {
                id: challenge.id
            },
            children: [
                this.create_element('div', {
                    class_list: ['challenge-info'],
                    children: [
                        this.create_element('span', {
                            class_list: ['challenge-name'], 
                            text_content: challenge.title
                        }),
                        this.create_element('span', {
                            class_list: ['challenge-description'],
                            text_content: challenge.description
                        })
                    ]
                }),
                this.create_element('div', {
                    class_list: ['challenge-progress'],
                    children: [
                        this.create_element('div', {
                            class_list: ['progress-bar'],
                            attributes: {
                                style: `width: ${challenge.progress}%;`
                            }
                        }),
                        this.create_element('span', {
                            class_list: ['progress-value'], 
                            text_content: `${challenge.progress}%`
                        })
                    ]
                })
            ],
            events: {
                click: () => this.view_challenge(challenge.id)
            }
        });
    }

    create_empty_state() {
        return this.create_element('div', {
            class_list: ['empty-state'],
            children: [
                this.create_element('p', {
                    text_content: 'No challenges yet. Create your first challenge!'
                })
            ]
        });
    }

    async render() {
        // Clear previous content
        this.ui.clear_container(this.element);

        // Get challenges from store
        const challenges = this.store.get_state('challenges') || [];

        const wrappers = this.create_element('div', {
            class_list: ['challenges-wrapper']
        });
        // Create header section
        const header = this.create_element('header', {
            class_list: ['challenges-header'],
            children: [
                this.create_element('h1', {
                    text_content: 'Your Challenges'
                }),
                this.create_element('button', {
                    class_list: ['btn', 'btn--primary', 'create-challenge-btn'],
                    text_content: 'Create Challenge',
                    events: {
                        click: this.open_create_popup.bind(this)
                    }
                })
            ]
        });
        
        wrappers.appendChild(header);

        // Create challenges list or empty state
        if (challenges.length > 0) {
            const list = this.create_element('ul', {
                class_list: ['challenges-list']
            });

            challenges.forEach(challenge => {
                list.appendChild(this.create_challenge_item(challenge));
            });

            wrappers.appendChild(list);
        } else {
            wrappers.appendChild(this.create_empty_state());
        }

        this.element.appendChild(wrappers);

        return this;
    }

    async mounted() {
        // Add event listeners or initialize other features
        this.add_event('click', '.challenge-item', this.handle_challenge_click);
    }

    handle_challenge_click(event, target) {
        const challenge_id = target.dataset.id;
        this.view_challenge(challenge_id);
    }

    view_challenge(id) {
        if (this.router) {
            this.router.navigate_to(`/challenges/${id}`);
        } else {
            console.error('Router not initialized');
        }
    }

    open_create_popup() {
        // TODO: Open create challenge popup
        console.log('Open create challenge popup');
    }
}

export default ChallengesComponent;