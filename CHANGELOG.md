# Changelog

All notable changes to the Vueni financial platform will be documented in this file.

## [Unreleased]

### Fixed

- **Back Navigation**: Fixed back navigation to properly pop from browser history instead of hard-routing to home. Users can now navigate naturally from Dashboard → Accounts → Account Detail with proper back button behavior. Added fallback navigation for deep links with no history.

### Added

- **AccountsListPage**: Created dedicated accounts list page to serve as parent route for account detail navigation
- **BackButton Component**: Added reusable BackButton component with history-aware navigation and customizable fallback paths
- **Navigation Tests**: Comprehensive Playwright tests for back navigation flows including deep links, browser back button, and error states

### Changed

- **Route Structure**: Updated routing to support proper `/accounts` parent and `/accounts/:id` child relationship
- **Error Handling**: Improved error state navigation to use appropriate fallback paths

## [Previous Version]

// ... existing changelog content ...
