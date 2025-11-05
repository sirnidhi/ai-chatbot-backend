# AI Chatbot Backend - Architecture Documentation

## 🏗️ Project Structure Overview

```
5.AI Chatbot Backend/
├── .github/workflows/          # GitHub Actions CI/CD
├── controllers/               # Business logic handlers
├── middleware/               # Express middleware functions
├── models/                  # MongoDB data models
├── routes/                 # API route definitions
├── services/              # External service integrations
├── sockets/              # Socket.IO real-time handlers
├── utils/               # Utility functions and helpers
├── scripts/            # Database and setup scripts
├── logs/              # Application log files
├── .env              # Environment variables
├── server.js        # Main application entry point
└── package.json    # Dependencies and scripts
```

## 📁 Detailed Folder Explanation

### 🎮 `/controllers` - Business Logic Layer
**Purpose**: Contains the core business logic for handling HTTP requests and responses.

- **`authController.js`**: Handles user authentication
  - `register()` - User registration with password hashing
  - `login()` - User authentication with JWT token generation
  - `getProfile()` - Retrieve user profile information

- **`chatController.js`**: Manages chat functionality
  - `sendMessage()` - Process user messages and get AI responses
  - `getConversations()` - Retrieve user's conversation history
  - `getConversation()` - Get specific conversation details
  - `updateConversation()` - Update conversation metadata
  - `deleteConversation()` - Soft delete conversations

- **`adminController.js`**: Admin panel functionality
  - `getDashboardStats()` - System analytics and metrics
  - `getQueryLogs()` - AI query monitoring and logs
  - `getUsers()` - User management operations
  - `getUserActivity()` - Individual user analytics
  - `getSystemHealth()` - System status monitoring
  - `toggleUserStatus()` - Enable/disable user accounts

### 🛡️ `/middleware` - Request Processing Layer
**Purpose**: Intercepts and processes requests before they reach controllers.

- **`auth.js`**: Authentication and authorization
  - `authenticate()` - Validates JWT tokens
  - `authorize()` - Role-based access control (user/admin)

### 🗄️ `/models` - Data Layer
**Purpose**: Defines database schemas and data relationships using Mongoose.

- **`User.js`**: User account management
  ```javascript
  {
    username: String,
    email: String,
    password: String (hashed),
    role: String (user/admin),
    isActive: Boolean,
    lastLogin: Date
  }
  ```

- **`Conversation.js`**: Chat conversation storage
  ```javascript
  {
    userId: ObjectId,
    title: String,
    messages: [{
      role: String (user/assistant),
      content: String,
      timestamp: Date,
      aiProvider: String,
      tokens: Number
    }],
    totalTokens: Number,
    aiProvider: String
  }
  ```

- **`QueryLog.js`**: AI interaction monitoring
  ```javascript
  {
    userId: ObjectId,
    conversationId: ObjectId,
    userQuery: String,
    aiResponse: String,
    aiProvider: String,
    responseTime: Number,
    tokens: Number,
    status: String,
    errorMessage: String
  }
  ```

### 🛣️ `/routes` - API Endpoint Layer
**Purpose**: Defines HTTP routes and connects them to controllers.

- **`auth.js`**: Authentication endpoints
  - `POST /api/auth/register` - User registration
  - `POST /api/auth/login` - User login
  - `GET /api/auth/profile` - Get user profile

- **`chat.js`**: Chat functionality endpoints
  - `POST /api/chat/message` - Send chat message
  - `GET /api/chat/conversations` - Get conversations list
  - `GET /api/chat/conversations/:id` - Get specific conversation
  - `PUT /api/chat/conversations/:id` - Update conversation
  - `DELETE /api/chat/conversations/:id` - Delete conversation

- **`admin.js`**: Admin panel endpoints
  - `GET /api/admin/dashboard` - Dashboard statistics
  - `GET /api/admin/logs` - Query logs
  - `GET /api/admin/users` - User management
  - `GET /api/admin/health` - System health

### 🤖 `/services` - External Integration Layer
**Purpose**: Handles communication with external APIs and services.

- **`aiService.js`**: Main AI service coordinator
  - Manages multiple AI providers
  - Implements fallback logic
  - Handles provider health checks

- **`openaiService.js`**: OpenAI GPT integration
  - Chat completions API
  - Token counting
  - Error handling and retries

- **`geminiService.js`**: Google Gemini integration
  - Gemini Pro model integration
  - Message format conversion
  - Token estimation

### 🔌 `/sockets` - Real-time Communication Layer
**Purpose**: Handles WebSocket connections for real-time chat.

- **`chatSocket.js`**: Socket.IO implementation
  - Real-time message handling
  - User authentication for sockets
  - Typing indicators
  - Room management for conversations

### 🔧 `/utils` - Utility Layer
**Purpose**: Reusable helper functions and configurations.

- **`logger.js`**: Application logging
  - Winston logger configuration
  - File and console logging
  - Error tracking

- **`validation.js`**: Input validation
  - Joi schema definitions
  - Request validation middleware
  - Data sanitization

### 📜 `/scripts` - Automation Layer
**Purpose**: Database setup and maintenance scripts.

- **`createAdmin.js`**: Admin user creation
  - Creates initial admin account
  - Database connection handling
  - Environment variable usage

## 🔄 Application Workflow

### 1. **User Registration/Login Flow**
```
Client Request → Route → Validation → Controller → Model → Database
                                   ↓
Client Response ← JWT Token ← Password Hash ← User Creation
```

### 2. **Chat Message Flow**
```
Client Message → Socket.IO/REST → Authentication → Controller
                                                      ↓
AI Service → OpenAI/Gemini API → Response Processing
     ↓
Database Storage → Query Logging → Client Response
```

### 3. **Admin Dashboard Flow**
```
Admin Request → Authentication → Authorization → Controller
                                                    ↓
Database Aggregation → Statistics Calculation → Response
```

## 🔐 Security Architecture

### Authentication Flow
1. User provides credentials
2. Password verified with bcrypt
3. JWT token generated with expiration
4. Token required for protected routes
5. Role-based access for admin features

### Data Protection
- Password hashing with bcrypt
- JWT token expiration
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS protection
- Security headers with Helmet.js

## 📊 Database Design

### Relationships
- **User** → **Conversation** (One-to-Many)
- **Conversation** → **QueryLog** (One-to-Many)
- **User** → **QueryLog** (One-to-Many)

### Indexing Strategy
- User email and username (unique indexes)
- Conversation userId and timestamp
- QueryLog userId, provider, and timestamp

## 🚀 Deployment Architecture

### Environment Configurations
- **Development**: Local MongoDB, console logging
- **Production**: MongoDB Atlas, file logging, rate limiting

### Scaling Considerations
- Horizontal scaling with load balancers
- Database connection pooling
- Redis for session management (future)
- CDN for static assets (future)

## 📈 Monitoring and Analytics

### Logging Strategy
- Request/response logging
- Error tracking and alerting
- Performance metrics
- AI usage analytics

### Health Monitoring
- Database connection status
- AI provider availability
- System resource usage
- API response times

This architecture ensures scalability, maintainability, and security while providing comprehensive AI chatbot functionality.