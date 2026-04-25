# Requirements Document

## Introduction

A personal dashboard web app built with HTML, CSS, and Vanilla JavaScript that runs entirely in the browser with no backend. It provides a greeting with live clock, a focus timer, a to-do list, and quick-access links — all persisted via the browser's Local Storage API. The app must work as a standalone web page or browser extension across modern browsers (Chrome, Firefox, Edge, Safari).

## Glossary

- **Dashboard**: The single-page web application described in this document.
- **Local_Storage**: The browser's `localStorage` API used for all client-side data persistence.
- **Greeting_Card**: The UI section that displays the user's name, a time-based greeting, the live clock, and the current date.
- **Focus_Timer**: The countdown timer widget with configurable duration, start, stop, and reset controls.
- **Todo_List**: The task management widget that allows adding, editing, completing, and deleting tasks.
- **Quick_Links**: The widget that displays user-saved shortcut buttons that open favourite websites.
- **Modal**: An overlay dialog used for data entry (name change, add/edit task, add link).
- **Toast**: A brief non-blocking notification shown at the bottom of the screen after user actions.
- **Theme**: The visual colour scheme of the Dashboard, either dark or light.

---

## Requirements

### Requirement 1: Live Greeting and Clock

**User Story:** As a user, I want to see the current time, date, and a personalised greeting, so that I have an at-a-glance overview when I open the dashboard.

#### Acceptance Criteria

1. THE Greeting_Card SHALL display the current time in HH:MM:SS format, updated every second.
2. THE Greeting_Card SHALL display the current date in a human-readable format (e.g., Monday, 14 July 2025).
3. WHEN the current local time is between 05:00 and 11:59, THE Greeting_Card SHALL display a morning greeting message.
4. WHEN the current local time is between 12:00 and 17:59, THE Greeting_Card SHALL display an afternoon greeting message.
5. WHEN the current local time is between 18:00 and 20:59, THE Greeting_Card SHALL display an evening greeting message.
6. WHEN the current local time is between 21:00 and 04:59, THE Greeting_Card SHALL display a night greeting message.
7. THE Greeting_Card SHALL display the user's saved name retrieved from Local_Storage.
8. WHEN no name has been saved, THE Greeting_Card SHALL display a default placeholder name.
9. WHEN the user submits a new name via the name Modal, THE Dashboard SHALL save the name to Local_Storage and update the Greeting_Card immediately.
10. IF the user submits an empty name in the name Modal, THEN THE Dashboard SHALL retain the previously saved name without modification.

---

### Requirement 2: Focus Timer

**User Story:** As a user, I want a configurable countdown timer with start, stop, and reset controls, so that I can manage focused work sessions.

#### Acceptance Criteria

1. THE Focus_Timer SHALL display a countdown in MM:SS format.
2. WHEN the Focus_Timer is in the idle state, THE Focus_Timer SHALL display the configured duration as the initial countdown value.
3. WHEN the user activates the start control, THE Focus_Timer SHALL begin counting down one second per real-world second.
4. WHEN the Focus_Timer is running, THE Focus_Timer SHALL disable the start control and enable the stop control.
5. WHEN the user activates the stop control, THE Focus_Timer SHALL pause the countdown and retain the remaining time.
6. WHEN the Focus_Timer is paused, THE Focus_Timer SHALL enable the start control to allow resuming.
7. WHEN the user activates the reset control, THE Focus_Timer SHALL stop the countdown and restore the display to the configured duration.
8. WHEN the countdown reaches 00:00, THE Focus_Timer SHALL stop automatically and display a session-complete notification to the user.
9. WHEN the user changes the duration input, THE Focus_Timer SHALL accept integer values between 1 and 120 (minutes) inclusive.
10. IF the user enters a duration value outside the range 1–120, THEN THE Focus_Timer SHALL clamp the value to the nearest valid boundary (1 or 120).

---

### Requirement 3: To-Do List

**User Story:** As a user, I want to manage a list of tasks with add, edit, complete, and delete operations, so that I can track what I need to do.

#### Acceptance Criteria

1. WHEN the user submits a non-empty task name via the task input, THE Todo_List SHALL add the task and persist the updated list to Local_Storage.
2. IF the user submits an empty task name, THEN THE Todo_List SHALL not add a task and SHALL display a validation message.
3. THE Todo_List SHALL display all persisted tasks retrieved from Local_Storage on page load.
4. WHEN the user marks a task as complete, THE Todo_List SHALL apply a visual completed style to that task and persist the updated state to Local_Storage.
5. WHEN the user unmarks a completed task, THE Todo_List SHALL remove the completed style and persist the updated state to Local_Storage.
6. WHEN the user activates the edit control for a task, THE Dashboard SHALL open the edit Modal pre-populated with the task's current name.
7. WHEN the user saves an edited task name that is non-empty, THE Todo_List SHALL update the task text and persist the change to Local_Storage.
8. IF the user saves an empty task name in the edit Modal, THEN THE Todo_List SHALL retain the original task name without modification.
9. WHEN the user activates the delete control for a task, THE Todo_List SHALL remove the task and persist the updated list to Local_Storage.
10. WHEN the active filter is "All", THE Todo_List SHALL display all tasks.
11. WHEN the active filter is "Active", THE Todo_List SHALL display only tasks that are not marked complete.
12. WHEN the active filter is "Done", THE Todo_List SHALL display only tasks that are marked complete.
13. WHEN the Todo_List contains no tasks matching the active filter, THE Todo_List SHALL display an empty-state message.

---

### Requirement 4: Quick Links

**User Story:** As a user, I want to save and access shortcut buttons for my favourite websites, so that I can open them with a single click.

#### Acceptance Criteria

1. THE Quick_Links SHALL display all saved links retrieved from Local_Storage on page load.
2. WHEN the user activates the add-link control, THE Dashboard SHALL open the add-link Modal with empty label and URL fields.
3. WHEN the user saves a new link with a non-empty label and a valid URL, THE Quick_Links SHALL add the link button and persist the updated list to Local_Storage.
4. IF the user saves a link with an empty label or an invalid URL, THEN THE Dashboard SHALL display a validation error and SHALL NOT add the link.
5. WHEN the user activates a link button, THE Dashboard SHALL open the corresponding URL in a new browser tab.
6. WHEN the user activates the remove control on a link button, THE Quick_Links SHALL remove that link and persist the updated list to Local_Storage.
7. WHEN the Quick_Links widget contains no saved links, THE Quick_Links SHALL display an empty-state message.

---

### Requirement 5: Theme Toggle

**User Story:** As a user, I want to switch between dark and light themes, so that I can use the dashboard comfortably in different lighting conditions.

#### Acceptance Criteria

1. THE Dashboard SHALL support a dark theme and a light theme.
2. WHEN the user activates the theme toggle control, THE Dashboard SHALL switch to the opposite theme and persist the selected theme to Local_Storage.
3. WHEN the Dashboard loads, THE Dashboard SHALL apply the theme saved in Local_Storage.
4. WHEN no theme has been saved, THE Dashboard SHALL apply the dark theme by default.

---

### Requirement 6: Data Persistence

**User Story:** As a user, I want all my data to be saved automatically, so that my tasks, links, name, and preferences are still available after I close and reopen the browser.

#### Acceptance Criteria

1. THE Dashboard SHALL use Local_Storage as the sole persistence mechanism for all user data.
2. WHEN the Dashboard loads, THE Dashboard SHALL read all user data from Local_Storage and restore the UI to the last saved state.
3. WHEN any user data changes (task added, edited, deleted, completed; link added or removed; name changed; theme changed), THE Dashboard SHALL write the updated data to Local_Storage before the next user interaction.
4. IF Local_Storage is unavailable or throws an error on write, THEN THE Dashboard SHALL display a Toast notification informing the user that data could not be saved.

---

### Requirement 7: Responsive Layout and Visual Design

**User Story:** As a user, I want the dashboard to look clean and work well on different screen sizes, so that I can use it on both desktop and mobile browsers.

#### Acceptance Criteria

1. THE Dashboard SHALL use a two-column grid layout on viewports wider than 700 px.
2. WHEN the viewport width is 700 px or narrower, THE Dashboard SHALL switch to a single-column stacked layout.
3. THE Dashboard SHALL load and render the initial view within 2 seconds on a standard broadband connection.
4. WHEN the user interacts with any control (button click, input focus), THE Dashboard SHALL reflect the interaction visually within 100 ms.
5. THE Dashboard SHALL use a single CSS file located at `css/style.css` and a single JavaScript file located at `js/script.js`.
