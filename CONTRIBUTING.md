# Contributing to OpenWhisper

We welcome contributions to OpenWhisper! Please follow these guidelines:

## Code Conventions

- JavaScript (Node.js ES Modules)
- Clean architecture with dependency injection via `ServiceContainer`
- Write clear unit tests for new features under `test/`
- Avoid swallowing exceptions or masking errors without logging via `Pino`

## Running Tests

```bash
npm test
```

## Creating Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes with clear messages
4. Ensure all tests pass (`npm test`)
5. Open a Pull Request on GitHub
