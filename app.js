// State Management
let assignments = [];
let currentFilter = 'all';
let searchQuery = '';
let currentSort = 'dueDateAsc';

// DOM Cache
const currentDateDisplay = document.getElementById('currentDateDisplay');
const openAddModalBtn = document.getElementById('openAddModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelModalBtn = document.getElementById('cancelModalBtn');
const assignmentModal = document.getElementById('assignmentModal');
const assignmentForm = document.getElementById('assignmentForm');
const modalTitle = document.getElementById('modalTitle');

// Form inputs
const assignmentIdInput = document.getElementById('assignmentId');
const titleInput = document.getElementById('title');
const subjectSelect = document.getElementById('subject');
const prioritySelect = document.getElementById('priority');
const dueDateInput = document.getElementById('dueDate');
const notesInput = document.getElementById('notes');

// Error message elements
const titleError = document.getElementById('titleError');
const subjectError = document.getElementById('subjectError');
const dueDateError = document.getElementById('dueDateError');

// Stats elements
const statsPending = document.getElementById('statsPending');
const statsCompleted = document.getElementById('statsCompleted');
const progressCircle = document.getElementById('progressCircle');
const progressPercentageText = document.getElementById('progressPercentageText');
const progressRating = document.getElementById('progressRating');

// Filters & search
const searchInput = document.getElementById('searchInput');
const tabButtons = document.querySelectorAll('.tab-btn');
const sortSelect = document.getElementById('sortSelect');
const taskList = document.getElementById('taskList');

// Toast Notification
const toastNotification = document.getElementById('toastNotification');
const toastMessage = document.getElementById('toastMessage');

// Subject colors mapped to CSS subject variables
const subjectClasses = {
    'Mathematics': 'sub-math',
    'Science': 'sub-science',
    'English': 'sub-english',
    'History': 'sub-history',
    'ComputerScience': 'sub-cs',
    'Languages': 'sub-languages',
    'Arts': 'sub-arts',
    'Other': 'sub-other'
};

// Initial Setup
document.addEventListener('DOMContentLoaded', () => {
    initDateDisplay();
    loadAssignments();
    setupEventListeners();
    render();
});

// Set current date in header
function initDateDisplay() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDateDisplay.textContent = new Date().toLocaleDateString('en-US', options);
    
    // Set default date input minimum to today (optional, but school assignments can be in the past, so we won't limit the datepicker min date)
}

// Load tasks from localStorage or set placeholders
function loadAssignments() {
    const stored = localStorage.getItem('eduplan_assignments');
    if (stored) {
        assignments = JSON.parse(stored);
    } else {
        // Load some high-quality sample assignments
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        
        const inThreeDays = new Date(today);
        inThreeDays.setDate(today.getDate() + 3);

        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        assignments = [
            {
                id: 'sample-1',
                title: 'Calculus Problem Set 4',
                subject: 'Mathematics',
                priority: 'high',
                dueDate: tomorrow.toISOString().split('T')[0],
                notes: 'Complete exercises 1 to 15 on page 243. Show all work and steps for final grades.',
                completed: false
            },
            {
                id: 'sample-2',
                title: 'Chemistry Lab Report: Electrolysis',
                subject: 'Science',
                priority: 'medium',
                dueDate: inThreeDays.toISOString().split('T')[0],
                notes: 'Write the introduction, hypothesis, experimental procedure, and results section. Don\'t forget to attach the Excel graphs.',
                completed: false
            },
            {
                id: 'sample-3',
                title: 'Read "To Kill a Mockingbird" Chapters 10-12',
                subject: 'English',
                priority: 'low',
                dueDate: inThreeDays.toISOString().split('T')[0],
                notes: 'Focus on the character development of Atticus and Jem. Prepare 3 questions for class seminar.',
                completed: false
            },
            {
                id: 'sample-4',
                title: 'World War II Timeline Outline',
                subject: 'History',
                priority: 'high',
                dueDate: yesterday.toISOString().split('T')[0],
                notes: 'Outline key turning point events between 1939 and 1945 on a landscape paper or slide.',
                completed: true
            }
        ];
        saveAssignments();
    }
}

// Save back to local storage
function saveAssignments() {
    localStorage.setItem('eduplan_assignments', JSON.stringify(assignments));
}

// Setup all DOM interaction events
function setupEventListeners() {
    // Modal controls
    openAddModalBtn.addEventListener('click', () => openModal());
    closeModalBtn.addEventListener('click', closeModal);
    cancelModalBtn.addEventListener('click', closeModal);
    
    // Close modal by clicking outside
    assignmentModal.addEventListener('click', (e) => {
        if (e.target === assignmentModal) closeModal();
    });

    // Form submission
    assignmentForm.addEventListener('submit', handleFormSubmit);

    // Search and filters
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        render();
    });

    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            e.target.classList.add('active');
            e.target.setAttribute('aria-selected', 'true');
            currentFilter = e.target.dataset.filter;
            render();
        });
    });

    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        render();
    });
}

// Modal open helper (handles Add or Edit)
function openModal(assignment = null) {
    // Reset any previous validation states
    clearErrors();
    
    if (assignment) {
        modalTitle.textContent = 'Edit Assignment';
        assignmentIdInput.value = assignment.id;
        titleInput.value = assignment.title;
        subjectSelect.value = assignment.subject;
        prioritySelect.value = assignment.priority;
        dueDateInput.value = assignment.dueDate;
        notesInput.value = assignment.notes;
    } else {
        modalTitle.textContent = 'Add New Assignment';
        assignmentForm.reset();
        assignmentIdInput.value = '';
        
        // Auto-select tomorrow as default date for convenience
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dueDateInput.value = tomorrow.toISOString().split('T')[0];
    }
    
    assignmentModal.classList.add('active');
    assignmentModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Lock background scroll
    titleInput.focus();
}

// Close Modal helper
function closeModal() {
    assignmentModal.classList.remove('active');
    assignmentModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

// Clear form input error highlights
function clearErrors() {
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('has-error');
    });
}

// Handle assignment form validation & submit
function handleFormSubmit(e) {
    e.preventDefault();
    clearErrors();
    
    let isValid = true;
    
    // Check validation fields
    if (!titleInput.value.trim()) {
        titleInput.parentElement.classList.add('has-error');
        isValid = false;
    }
    
    if (!subjectSelect.value) {
        subjectSelect.parentElement.classList.add('has-error');
        isValid = false;
    }
    
    if (!dueDateInput.value) {
        dueDateInput.parentElement.classList.add('has-error');
        isValid = false;
    }

    if (!isValid) return;

    const id = assignmentIdInput.value;
    const assignmentData = {
        title: titleInput.value.trim(),
        subject: subjectSelect.value,
        priority: prioritySelect.value,
        dueDate: dueDateInput.value,
        notes: notesInput.value.trim()
    };

    if (id) {
        // Edit Mode
        const index = assignments.findIndex(item => item.id === id);
        if (index !== -1) {
            assignments[index] = { ...assignments[index], ...assignmentData };
            showToast('Assignment updated successfully!');
        }
    } else {
        // Add Mode
        const newAssignment = {
            id: 'task-' + Date.now(),
            ...assignmentData,
            completed: false
        };
        assignments.unshift(newAssignment); // Put new tasks on top initially
        showToast('New assignment added!');
    }

    saveAssignments();
    closeModal();
    render();
}

// Calculate days difference and display text
function getDueInfo(dueDateStr, isCompleted) {
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const parts = dueDateStr.split('-');
    const dueDate = new Date(parts[0], parts[1] - 1, parts[2]);
    dueDate.setHours(0,0,0,0);
    
    const timeDiff = dueDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (isCompleted) {
        const formattedDate = dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return {
            text: `Due ${formattedDate}`,
            class: 'completed-badge'
        };
    }
    
    if (daysDiff < 0) {
        const absDays = Math.abs(daysDiff);
        return {
            text: absDays === 1 ? 'Overdue (Yesterday)' : `Overdue (${absDays} days ago)`,
            class: 'overdue'
        };
    } else if (daysDiff === 0) {
        return {
            text: 'Due Today',
            class: 'today'
        };
    } else if (daysDiff === 1) {
        return {
            text: 'Due Tomorrow',
            class: 'today' // sharing yellow style
        };
    } else if (daysDiff <= 3) {
        return {
            text: `${daysDiff} days left`,
            class: 'upcoming'
        };
    } else {
        const formattedDate = dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return {
            text: `Due ${formattedDate}`,
            class: 'upcoming'
        };
    }
}

// Deletes an assignment with small timeout to allow card deletion animations if any
function deleteAssignment(id) {
    const index = assignments.findIndex(item => item.id === id);
    if (index !== -1) {
        assignments.splice(index, 1);
        saveAssignments();
        showToast('Assignment deleted.');
        render();
    }
}

// Toggle assignment completion state
function toggleComplete(id, isCompleted) {
    const index = assignments.findIndex(item => item.id === id);
    if (index !== -1) {
        assignments[index].completed = isCompleted;
        saveAssignments();
        showToast(isCompleted ? 'Assignment completed! 🎉' : 'Assignment marked pending.');
        
        // Timeout rendering slightly so users can see the checkbox animation fill up
        setTimeout(() => {
            render();
        }, 300);
    }
}

// Recalculate stats values and progress ring
function updateStats() {
    const total = assignments.length;
    const pending = assignments.filter(item => !item.completed).length;
    const completed = total - pending;
    
    statsPending.textContent = pending;
    statsCompleted.textContent = completed;
    
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    progressPercentageText.textContent = `${percentage}%`;
    
    // Progress Ring SVG details
    // r = 24 -> C = 2 * PI * 24 = 150.796
    const circumference = 150.796;
    const offset = circumference - (percentage / 100) * circumference;
    progressCircle.style.strokeDashoffset = offset;
    
    // Motivation rating text
    if (total === 0) {
        progressRating.textContent = 'No assignments yet';
    } else if (percentage === 100) {
        progressRating.textContent = 'All caught up! 🎉';
    } else if (percentage >= 75) {
        progressRating.textContent = 'Almost done! Keep going!';
    } else if (percentage >= 50) {
        progressRating.textContent = 'Halfway there! Keep it up!';
    } else if (percentage >= 25) {
        progressRating.textContent = 'Making steady progress.';
    } else {
        progressRating.textContent = 'Ready to tackle the list!';
    }
}

// Show standard toast notifications
let toastTimeout;
function showToast(message) {
    toastMessage.textContent = message;
    toastNotification.classList.add('show');
    
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toastNotification.classList.remove('show');
    }, 2500);
}

// Render dynamic elements
function render() {
    // 1. Process tasks filters
    let filtered = [...assignments];
    
    // Filter type tabs
    if (currentFilter === 'pending') {
        filtered = filtered.filter(item => !item.completed);
    } else if (currentFilter === 'completed') {
        filtered = filtered.filter(item => item.completed);
    }
    
    // Search filter
    if (searchQuery) {
        filtered = filtered.filter(item => 
            item.title.toLowerCase().includes(searchQuery) || 
            item.subject.toLowerCase().includes(searchQuery) ||
            (item.notes && item.notes.toLowerCase().includes(searchQuery))
        );
    }
    
    // Sort logic
    filtered.sort((a, b) => {
        const dateA = new Date(a.dueDate);
        const dateB = new Date(b.dueDate);
        
        // Priority weight mapping
        const priorityWeight = { 'low': 1, 'medium': 2, 'high': 3 };
        
        switch (currentSort) {
            case 'dueDateAsc':
                return dateA - dateB;
            case 'dueDateDesc':
                return dateB - dateA;
            case 'priorityDesc':
                if (priorityWeight[b.priority] !== priorityWeight[a.priority]) {
                    return priorityWeight[b.priority] - priorityWeight[a.priority];
                }
                return dateA - dateB; // Secondary tie-breaker by due date
            case 'priorityAsc':
                if (priorityWeight[a.priority] !== priorityWeight[b.priority]) {
                    return priorityWeight[a.priority] - priorityWeight[b.priority];
                }
                return dateA - dateB;
            case 'titleAsc':
                return a.title.localeCompare(b.title);
            default:
                return 0;
        }
    });

    // 2. Render container UI
    taskList.innerHTML = '';
    
    if (filtered.length === 0) {
        // Display empty state
        let emptyEmoji = '📚';
        let emptyTitle = 'No assignments found';
        let emptyText = 'Get a head start by adding a new task!';
        
        if (currentFilter === 'completed') {
            emptyEmoji = '🏆';
            emptyTitle = 'No completed assignments';
            emptyText = 'Finish assignments to see them documented here.';
        } else if (currentFilter === 'pending') {
            emptyEmoji = '✨';
            emptyTitle = 'All assignments complete';
            emptyText = 'You have zero pending tasks. Great job!';
        } else if (searchQuery) {
            emptyEmoji = '🔍';
            emptyTitle = 'No search results';
            emptyText = 'Try checking spelling or writing a broader search query.';
        }
        
        taskList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-illustration">${emptyEmoji}</div>
                <h3>${emptyTitle}</h3>
                <p>${emptyText}</p>
                ${currentFilter === 'pending' || searchQuery ? '' : `
                    <button class="btn btn-primary" onclick="openModal()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="btn-icon"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        <span>New Assignment</span>
                    </button>
                `}
            </div>
        `;
    } else {
        filtered.forEach(task => {
            const card = document.createElement('div');
            card.className = `task-card ${task.completed ? 'completed' : ''}`;
            card.dataset.id = task.id;
            
            const dueInfo = getDueInfo(task.dueDate, task.completed);
            const subjectClass = subjectClasses[task.subject] || 'sub-other';
            
            // Build task card layout
            card.innerHTML = `
                <div class="task-card-main">
                    <label class="checkbox-container" aria-label="Toggle completed status">
                        <input type="checkbox" ${task.completed ? 'checked' : ''}>
                        <span class="checkmark"></span>
                    </label>
                    
                    <div class="task-content-wrapper">
                        <h3 class="task-title">${escapeHTML(task.title)}</h3>
                        <div class="task-meta-row">
                            <span class="badge subject-badge">
                                <span class="subject-dot" style="background-color: var(--${subjectClass})"></span>
                                ${escapeHTML(task.subject)}
                            </span>
                            <span class="badge due-badge ${dueInfo.class}">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                <span>${dueInfo.text}</span>
                            </span>
                            <span class="badge priority-badge ${task.priority}">
                                ${task.priority} Priority
                            </span>
                        </div>
                    </div>

                    <div class="task-actions">
                        <button class="action-btn btn-edit" aria-label="Edit assignment">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button class="action-btn btn-delete" aria-label="Delete assignment">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                    </div>
                </div>
                ${task.notes ? `
                    <div class="task-notes-wrapper">
                        <div class="task-notes">${escapeHTML(task.notes)}</div>
                    </div>
                ` : ''}
            `;

            // EVENT LISTENERS FOR THE CARD

            // Expand/collapse note detail clicking card (excluding actions & checkboxes)
            card.addEventListener('click', (e) => {
                // If clicked input, edit button, or delete button, ignore expand toggle
                if (e.target.closest('.checkbox-container') || e.target.closest('.task-actions') || e.target.closest('.action-btn')) {
                    return;
                }
                
                if (task.notes) {
                    card.classList.toggle('expanded');
                }
            });

            // Toggle checkbox change event
            const checkbox = card.querySelector('.checkbox-container input');
            checkbox.addEventListener('change', (e) => {
                toggleComplete(task.id, e.target.checked);
            });

            // Edit button click event
            const editBtn = card.querySelector('.btn-edit');
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openModal(task);
            });

            // Delete button click event
            const deleteBtn = card.querySelector('.btn-delete');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
                    deleteAssignment(task.id);
                }
            });

            taskList.appendChild(card);
        });
    }

    // 3. Update dashboard stats
    updateStats();
}

// Simple HTML escaping helper for security
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

// Expose modal trigger globally so inline SVG elements or empty state button can call it easily
window.openModal = () => openModal();
