// challenge_item_component.js
import Component from '../core/component.js';

class ChallengeItemComponent extends Component {
    constructor(options = {}) {
        super({
            ...options,
            tag: 'li',
            class_name: 'challenge-item'
        });

        this.challenge = options.challenge;
        this.router = options.router;
        this.onView = options.onView;
        this.onEdit = options.onEdit;
        this.onDelete = options.onDelete;
    }

    get_progress_class(progress) {
        if (progress < 20) return 'progress-danger';
        if (progress < 50) return 'progress-warning';
        if (progress < 80) return 'progress-info';
        return 'progress-success';
    }

    format_date(dateString) {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    get_remaining_days(endDate) {
        const today = new Date();
        const end = new Date(endDate);
        const diffTime = end - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

    async render() {
        const { id, title, description, progress, category, startDate, endDate } = this.challenge;
        
        this.element.dataset.id = id;

        const remainingDays = this.get_remaining_days(endDate);
        const statusClass = remainingDays < 3 ? 'status-urgent' : 'status-normal';

        const content = this.create_element('div', {
            class_list: ['challenge-content'],
            children: [
                // Header section with title and category
                this.create_element('div', {
                    class_list: ['challenge-header'],
                    children: [
                        this.create_element('h3', {
                            class_list: ['challenge-name'],
                            text_content: title
                        }),
                        this.create_element('span', {
                            class_list: ['challenge-category'],
                            text_content: category
                        })
                    ]
                }),

                // Description section
                this.create_element('p', {
                    class_list: ['challenge-description'],
                    text_content: description
                }),

                // Progress section
                this.create_element('div', {
                    class_list: ['challenge-progress'],
                    children: [
                        this.create_element('div', {
                            class_list: ['progress-bar', this.get_progress_class(progress)],
                            attributes: {
                                style: `width: ${progress}%;`
                            }
                        }),
                        this.create_element('span', {
                            class_list: ['progress-value'],
                            text_content: `${progress}%`
                        })
                    ]
                }),

                // Footer with dates and actions
                this.create_element('div', {
                    class_list: ['challenge-footer'],
                    children: [
                        this.create_element('div', {
                            class_list: ['challenge-dates'],
                            children: [
                                this.create_element('span', {
                                    class_list: ['date-label'],
                                    text_content: `${this.format_date(startDate)} - ${this.format_date(endDate)}`
                                }),
                                this.create_element('span', {
                                    class_list: ['remaining-days', statusClass],
                                    text_content: `${remainingDays} days left`
                                })
                            ]
                        }),
                        this.create_element('div', {
                            class_list: ['challenge-actions'],
                            children: [
                                this.create_element('button', {
                                    class_list: ['action-btn', 'view-btn'],
                                    attributes: {
                                        'data-tooltip': 'View Details'
                                    },
                                    innerHTML: `
                                        <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                            <path d="M12 4v.01M17.66 7.93v.01M20.66 12v.01M17.66 16.06v.01M12 19.99v.01M6.34 16.06v.01M3.34 12v.01M6.34 7.93v.01"/>
                                        </svg>
                                    `,
                                    events: {
                                        click: (e) => {
                                            e.stopPropagation();
                                            this.handle_view();
                                        }
                                    }
                                }),
                                this.create_element('button', {
                                    class_list: ['action-btn', 'edit-btn'],
                                    attributes: {
                                        'data-tooltip': 'Edit Challenge'
                                    },
                                    innerHTML: `
                                        <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z"/>
                                        </svg>
                                    `,
                                    events: {
                                        click: (e) => {
                                            e.stopPropagation();
                                            this.handle_edit();
                                        }
                                    }
                                }),
                                this.create_element('button', {
                                    class_list: ['action-btn', 'delete-btn'],
                                    attributes: {
                                        'data-tooltip': 'Delete Challenge'
                                    },
                                    innerHTML: `
                                        <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M3 6h18"/>
                                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                                            <line x1="10" y1="11" x2="10" y2="17"/>
                                            <line x1="14" y1="11" x2="14" y2="17"/>
                                        </svg>
                                    `,
                                    events: {
                                        click: (e) => {
                                            e.stopPropagation();
                                            this.handle_delete();
                                        }
                                    }
                                })
                            ]
                        })
                    ]
                })
            ]
        });

        this.element.appendChild(content);
        return this;
    }

    handle_view() {
        if (this.onView) {
            this.onView(this.challenge);
        } else if (this.router) {
            this.router.navigate_to(`/challenges/${this.challenge.id}`);
        }
    }

    handle_edit() {
        if (this.onEdit) {
            this.onEdit(this.challenge);
        }
    }

    handle_delete() {
        if (this.onDelete) {
            this.onDelete(this.challenge);
        }
    }

    async mounted() {
        // Add any additional event listeners if needed
    }
}

export default ChallengeItemComponent;