// challenges_component.js
import Component from '../core/component.js';
import ChallengeItemComponent from './challenge_item_component.js';

class ChallengesComponent extends Component {
    constructor(options = {}) {
        super({
            ...options,
            tag: 'div',
            class_name: 'challenges-container page-content'
        });

        this.store = options.store;
        this.router = options.router;
    }

    get_progress_class(progress) {
        if (progress < 20) return 'progress-danger';
        if (progress < 50) return 'progress-warning';
        if (progress < 80) return 'progress-info';
        return 'progress-success';
    }

    async create_challenge_item(challenge) {
        const challenge_item = new ChallengeItemComponent({
            challenge,
            router: this.router,
            onView: (challenge) => this.view_challenge(challenge.id),
            onEdit: (challenge) => this.edit_challenge(challenge.id),
            onDelete: (challenge) => this.delete_challenge(challenge.id)
        });
        
        await challenge_item.mount();
        return challenge_item.element;
    }

    edit_challenge(id) {
        console.log('Edit challenge:', id);
        // TODO: Implement edit functionality
    }

    delete_challenge(id) {
        console.log('Delete challenge:', id);
        // TODO: Implement delete functionality
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
        const challenges = this.store.get_state('challenges');

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
                    text_content: '+ Create Challenge',
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

            for (const challenge of challenges) {
                const itemElement = await this.create_challenge_item(challenge);
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