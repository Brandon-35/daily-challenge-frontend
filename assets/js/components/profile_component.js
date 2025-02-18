import Component from '../core/component.js';

class ProfileComponent extends Component {
    constructor(options = {}) {
        super({
            ...options,
            tag: 'div',
            class_name: 'profile-container page-content'
        });

        this.store = options.store;
        this.router = options.router;
    }

    async render() {
        // Clear previous content
        this.ui.clear_container(this.element);

        // Get user profile data from store
        const userProfile = this.store.get_state('userProfile');

        const profileWrapper = this.create_element('div', {
            class_list: ['profile-wrapper']
        });

        // Create header section
        const header = this.create_element('header', {
            class_list: ['profile-header'],
            children: [
                this.create_element('h1', {
                    text_content: 'User Profile'
                })
            ]
        });

        profileWrapper.appendChild(header);

        // Create profile details
        const details = this.create_element('div', {
            class_list: ['profile-details'],
            children: [
                this.create_element('p', {
                    text_content: `Name: ${userProfile.name}`
                }),
                this.create_element('p', {
                    text_content: `Email: ${userProfile.email}`
                }),
                // Add more fields as necessary
            ]
        });

        profileWrapper.appendChild(details);
        this.element.appendChild(profileWrapper);

        return this;
    }

    async mounted() {
        // Add event listeners or initialize other features if needed
    }
}

export default ProfileComponent; 