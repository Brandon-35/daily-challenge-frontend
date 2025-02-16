import Component from '../core/component.js';

class ChallengesComponent extends Component {
    constructor(options = {}) {
        
        super({
            ...options,
            tag: 'div',
            class_name: 'challenges-container'
        });

        this.store = options.store;
    }

    async render() {
        console.log(this.store);
        
        // Get challenges from store
        const challenges = this.store.get_state('challenges') || [];

        // Clear previous content
        this.ui.clear_container(this.element);
        
        // Create challenges list
        const list = this.create_element('ul', {
            class_list: ['challenges-list']
        });

        challenges.forEach(challenge => {
            const item = this.create_element('li', {
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

            list.appendChild(item);
        });

        this.element.appendChild(list);

        // Create challenge button  
        const create_button = this.create_element('button', {
            class_list: ['btn', 'btn--primary', 'create-challenge-btn'],
            text_content: '+ Create Challenge',
            events: {
                click: this.open_create_popup.bind(this)
            }
        });

        this.element.appendChild(create_button);

        return this;
    }

    view_challenge(id) {
        // Navigate to challenge detail page
        this.router.navigate_to(`/challenges/${id}`); 
    }

    open_create_popup() {
        // TODO: Open create challenge popup
        console.log('Open create challenge popup');
    }
}

export default ChallengesComponent;