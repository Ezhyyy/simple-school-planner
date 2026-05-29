Task List - A Smart School Planner
This project is a modern, mobile-friendly web application for managing school assignments and tasks. It features a sleek dark mode design, real-time statistics, category-based filtering, and drag-and-drop reordering.

✨ Features
Modern UI/UX
- Dark theme with glassmorphism effects
- Custom scrollbar styling
- Responsive design for all devices

Task Management
- Add new assignments with title, subject, and due date
- Mark tasks as completed/incomplete
- Edit existing tasks
- Delete tasks permanently

Task List Features
- Smart Categories: Automatically color-codes subjects and assigns icons (Math, Science, English, etc.)
- Priority Badges: Visual indicators for Low, Medium, and High priority levels
- Date Status: Displays "Completed" or "Upcoming" with color-coded badges
- Drag & Drop: Intuitive reordering of tasks within the list

Search & Filter
- Real-time Search: Instantly filter tasks by title or subject
- Tab Filters: Switch between All, Pending, and Completed views
- Sort Options: Organize tasks by Due Date, Priority, or Creation Time

Statistics Dashboard
- Real-time Analytics: Shows current Pending, Completed, and Overall Completion Percentage
- Visual Progress: A circular progress bar animates smoothly to reflect task completion

Responsive Design
- Mobile-First: Optimized for phone screens with touch-friendly controls
- Tablet & Desktop: Adaptive layout for larger screens

Local Storage
- All data is saved locally in the browser, ensuring privacy and persistence

📋 Setup
No installation required! This is a client-side only application.

1. Open `index.html` in your web browser.
2. The app will load immediately.

📂 Project Structure
- `index.html`: The main application shell and UI structure.
- `app.js`: The core logic including state management, task operations, filtering, and DOM manipulation.
- `style.css`: All styling and visual design.

📊 Technical Details
- State Management: Tasks are stored in an array in `app.js`. Data is persisted using `window.localStorage`.
- DOM Updates: The UI updates automatically whenever the task list changes.
- Design System:
  - Fonts: Inter (Body) and Outfit (Headings)
  - Colors: Deep slate dark mode with vibrant purple/blue accents
  - Card Design: Glassmorphism effect with blur and border highlights
  - Icons: SVG icons for a lightweight and clean look