# Contributing to allonsh.js

First off, thank you for considering contributing to allonsh.js! We welcome improvements, bug fixes, documentation updates, and ideas.

## How to Contribute

1. Fork the repository and create your branch from `main`.
2. Make your changes in a descriptive, focused way.
3. Test your changes locally.
4. Commit your changes following the Conventional Commits style.
5. Push your branch to your fork.
6. Open a Pull Request describing your changes clearly.

---

## Code Style & Commit Messages

We encourage following Conventional Commits to keep commit history clear and support changelog generation.

Here are the common commit types and examples:

- **feat:** A new feature  
  Example: feat(drag-drop): add support for touch devices

- **fix:** A bug fix  
  Example: fix(allonsh): prevent drag event from firing twice

- **docs:** Documentation only changes  
  Example: docs(readme): update installation instructions

- **style:** Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)  
  Example: style: format all files with Prettier

- **refactor:** A code change that neither fixes a bug nor adds a feature  
  Example: refactor: simplify drag and drop logic

- **perf:** A code change that improves performance  
  Example: perf(allonsh): optimize event handler performance

- **test:** Adding missing tests or correcting existing tests  
  Example: test: add tests for drag and drop edge cases

- **chore:** Changes to the build process or auxiliary tools and libraries such as documentation generation  
  Example: chore: update dependencies

Please write clear, concise commit messages.

---

## Code Formatting

This project uses [Prettier](https://prettier.io/) to ensure consistent code style.

Before committing, format your code by running:

```bash
npm run format
```

This will automatically format all files based on the project’s Prettier configuration.

---

## Testing

- Run tests locally with: npm test
- Add tests for new features or bug fixes.
- Ensure all tests pass before submitting a PR.

---

## Issues and Feature Requests

- Use GitHub Issues to report bugs or request features.
- Check existing issues before creating new ones.
- Provide clear, descriptive titles and steps to reproduce.

---

## Code of Conduct

Be respectful and courteous. We aim for an inclusive and welcoming community.

---

Thank you for contributing to allonsh.js!
