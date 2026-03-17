# Contributing to YOZ-Ticaret

Thank you for your interest in contributing to YOZ-Ticaret! This document provides guidelines and information for contributors.

## Getting Started

### Prerequisites

- PHP 8.0 or higher
- MySQL 8.0 or higher
- Apache/Nginx web server
- Composer
- Node.js (for frontend development)

### Setup

1. Fork the repository
2. Clone your fork locally
3. Install dependencies: `composer install`
4. Copy `config.example.php` to `config.php` and configure your database
5. Import the database schema from `database/schema.sql`
6. Set up your web server to point to the project directory

## Development Guidelines

### Code Style

- Follow PSR-12 coding standards for PHP
- Use 4 spaces for indentation (no tabs)
- Use meaningful variable and function names
- Add appropriate comments where necessary

### Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

### Branch Naming

- `feature/feature-name` for new features
- `bugfix/bug-description` for bug fixes
- `hotfix/urgent-fix` for critical fixes
- `docs/documentation-updates` for documentation changes

## Submitting Changes

### Pull Request Process

1. Update the README.md with details of changes if applicable
2. Ensure your PR description clearly describes the problem and solution
3. Include relevant screenshots for UI changes
4. Ensure all tests pass
5. Merge the pull request after successful review

### Testing

- Write unit tests for new functionality
- Test your changes thoroughly
- Ensure existing functionality is not broken

## Bug Reports

When filing a bug report, please include:

- A descriptive title
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details (PHP version, browser, etc.)
- Screenshots if applicable

## Feature Requests

Feature requests are welcome! Please provide:

- A clear description of the feature
- Why the feature would be useful
- Any implementation ideas you have

## Security

If you discover a security vulnerability, please report it privately before creating a public issue.

## Questions?

Feel free to reach out to the project maintainers with any questions about contributing.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
