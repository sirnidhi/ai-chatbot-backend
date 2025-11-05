# Contributing to AI Chatbot Backend

## 🤝 Welcome Contributors!

Thank you for your interest in contributing to the AI Chatbot Backend project! This guide will help you get started.

## 📋 Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contribution Guidelines](#contribution-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)

## 📜 Code of Conduct

### Our Pledge
We are committed to making participation in this project a harassment-free experience for everyone.

### Our Standards
- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what is best for the community

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Git
- OpenAI API key
- Google Gemini API key

### Development Setup

1. **Fork the Repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/ai-chatbot-backend.git
   cd ai-chatbot-backend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Update .env with your API keys and database URL
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB
   # Create admin user
   node scripts/createAdmin.js
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🛠️ Development Guidelines

### Code Style
- Use ES6+ features
- Follow consistent indentation (2 spaces)
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### File Structure
```
controllers/    # Business logic
models/        # Database schemas
routes/        # API endpoints
services/      # External integrations
middleware/    # Request processing
utils/         # Helper functions
```

### Naming Conventions
- **Files**: camelCase (e.g., `authController.js`)
- **Functions**: camelCase (e.g., `getUserProfile`)
- **Variables**: camelCase (e.g., `userToken`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRY_ATTEMPTS`)
- **Classes**: PascalCase (e.g., `AIService`)

## 🔧 Contribution Types

### 🐛 Bug Fixes
- Fix existing functionality issues
- Improve error handling
- Resolve security vulnerabilities

### ✨ New Features
- Add new API endpoints
- Integrate additional AI providers
- Enhance admin dashboard
- Improve real-time chat features

### 📚 Documentation
- Update README files
- Add code comments
- Create API documentation
- Write tutorials

### 🧪 Testing
- Add unit tests
- Create integration tests
- Improve test coverage
- Add performance tests

## 📝 Pull Request Process

### Before Submitting
1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write clean, documented code
   - Follow existing patterns
   - Add tests if applicable

3. **Test Your Changes**
   ```bash
   npm test
   npm run lint
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(auth): add password reset functionality
fix(chat): resolve message ordering issue
docs(api): update endpoint documentation
```

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

## 🐛 Issue Reporting

### Bug Reports
Use the bug report template:

```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**
1. Step one
2. Step two
3. Step three

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- OS: [e.g., Windows 10]
- Node.js version: [e.g., 18.0.0]
- Browser: [e.g., Chrome 91]

**Additional Context**
Screenshots, logs, etc.
```

### Feature Requests
```markdown
**Feature Description**
Clear description of the feature

**Problem Statement**
What problem does this solve?

**Proposed Solution**
How should this work?

**Alternatives Considered**
Other solutions you've considered

**Additional Context**
Mockups, examples, etc.
```

## 🧪 Testing Guidelines

### Unit Tests
```javascript
// Example test structure
describe('AuthController', () => {
  describe('register', () => {
    it('should create new user with valid data', async () => {
      // Test implementation
    });
    
    it('should reject duplicate email', async () => {
      // Test implementation
    });
  });
});
```

### Integration Tests
```javascript
// Example API test
describe('POST /api/auth/register', () => {
  it('should return 201 for valid registration', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send(validUserData);
    
    expect(response.status).toBe(201);
  });
});
```

## 📊 Performance Guidelines

### Database Queries
- Use proper indexing
- Implement pagination
- Avoid N+1 queries
- Use aggregation pipelines

### API Responses
- Implement caching where appropriate
- Use compression
- Minimize response payload
- Add response time monitoring

### Memory Management
- Clean up event listeners
- Close database connections
- Handle memory leaks
- Monitor resource usage

## 🔒 Security Guidelines

### Authentication
- Validate all inputs
- Use secure password hashing
- Implement rate limiting
- Add CSRF protection

### Data Protection
- Sanitize user inputs
- Use parameterized queries
- Encrypt sensitive data
- Follow OWASP guidelines

## 📖 Documentation Standards

### Code Comments
```javascript
/**
 * Generates AI response for user message
 * @param {string} message - User input message
 * @param {string} provider - AI provider (openai/gemini)
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} AI response with metadata
 */
async function generateResponse(message, provider, options) {
  // Implementation
}
```

### API Documentation
- Document all endpoints
- Include request/response examples
- Specify error codes
- Add authentication requirements

## 🎯 Review Process

### Code Review Checklist
- [ ] Code follows project standards
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No security vulnerabilities
- [ ] Performance considerations addressed
- [ ] Error handling is appropriate

### Review Timeline
- Initial review: 2-3 business days
- Follow-up reviews: 1-2 business days
- Merge after approval from maintainers

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation
- Community highlights

## 📞 Getting Help

### Communication Channels
- GitHub Issues: Bug reports and feature requests
- GitHub Discussions: General questions and ideas
- Email: Direct contact for sensitive issues

### Resources
- [Project Documentation](./README.md)
- [Architecture Guide](./ARCHITECTURE.md)
- [Workflow Guide](./WORKFLOW.md)
- [API Examples](./API_EXAMPLES.md)

Thank you for contributing to the AI Chatbot Backend project! 🚀