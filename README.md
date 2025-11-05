# AI Chatbot Backend

A comprehensive AI-powered chatbot backend system that integrates with OpenAI and Gemini APIs, manages user conversations, stores chat history, and provides admin functionality for monitoring and analytics.

## 🚀 Features

- **AI Integration**: Support for both OpenAI GPT and Google Gemini APIs with automatic fallback
- **User Management**: Complete authentication system with JWT tokens
- **Chat History**: Persistent storage of user conversations and messages
- **Real-time Chat**: Socket.IO implementation for real-time messaging
- **Admin Panel**: Comprehensive admin dashboard with analytics and user management
- **Query Logging**: Detailed logging of all AI interactions for monitoring
- **Rate Limiting**: Built-in protection against API abuse
- **Security**: Helmet.js security headers and input validation

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- OpenAI API Key
- Google Gemini API Key

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-chatbot-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Copy `.env` file and update the following variables:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ai-chatbot
   JWT_SECRET=your-super-secret-jwt-key-here
   OPENAI_API_KEY=your-openai-api-key-here
   GEMINI_API_KEY=your-gemini-api-key-here
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=admin123
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <jwt-token>
```

### Chat Endpoints

#### Send Message
```http
POST /api/chat/message
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "message": "Hello, how are you?",
  "conversationId": "optional-conversation-id",
  "aiProvider": "openai" // or "gemini"
}
```

#### Get Conversations
```http
GET /api/chat/conversations?page=1&limit=20
Authorization: Bearer <jwt-token>
```

#### Get Specific Conversation
```http
GET /api/chat/conversations/:id
Authorization: Bearer <jwt-token>
```

#### Update Conversation
```http
PUT /api/chat/conversations/:id
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "New conversation title"
}
```

#### Delete Conversation
```http
DELETE /api/chat/conversations/:id
Authorization: Bearer <jwt-token>
```

### Admin Endpoints (Admin Role Required)

#### Dashboard Stats
```http
GET /api/admin/dashboard
Authorization: Bearer <admin-jwt-token>
```

#### Query Logs
```http
GET /api/admin/logs?page=1&limit=50&status=success&provider=openai
Authorization: Bearer <admin-jwt-token>
```

#### Get Users
```http
GET /api/admin/users?page=1&limit=20&search=john
Authorization: Bearer <admin-jwt-token>
```

#### User Activity
```http
GET /api/admin/users/:userId/activity?days=30
Authorization: Bearer <admin-jwt-token>
```

#### System Health
```http
GET /api/admin/health
Authorization: Bearer <admin-jwt-token>
```

#### Toggle User Status
```http
PATCH /api/admin/users/:userId/toggle
Authorization: Bearer <admin-jwt-token>
```

## 🔌 Socket.IO Events

### Client to Server Events

- `send_message`: Send a chat message
- `join_conversation`: Join a conversation room
- `leave_conversation`: Leave a conversation room

### Server to Client Events

- `message_received`: New message received
- `ai_typing`: AI is generating response
- `ai_typing_stop`: AI finished generating response
- `error`: Error occurred

### Example Socket.IO Usage

```javascript
const socket = io('http://localhost:5000', {
  auth: {
    token: 'your-jwt-token'
  }
});

// Send message
socket.emit('send_message', {
  message: 'Hello!',
  conversationId: 'conversation-id',
  aiProvider: 'openai'
});

// Listen for responses
socket.on('message_received', (data) => {
  console.log('New message:', data);
});

socket.on('ai_typing', (data) => {
  console.log('AI is typing...');
});
```

## 🗄️ Database Schema

### User Collection
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  role: String (user/admin),
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Conversation Collection
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
  isActive: Boolean,
  totalTokens: Number,
  aiProvider: String,
  createdAt: Date,
  updatedAt: Date
}
```

### QueryLog Collection
```javascript
{
  userId: ObjectId,
  conversationId: ObjectId,
  userQuery: String,
  aiResponse: String,
  aiProvider: String,
  responseTime: Number,
  tokens: Number,
  cost: Number,
  status: String (success/error),
  errorMessage: String,
  ipAddress: String,
  userAgent: String,
  createdAt: Date
}
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/ai-chatbot |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | JWT expiration time | 7d |
| `OPENAI_API_KEY` | OpenAI API key | - |
| `GEMINI_API_KEY` | Google Gemini API key | - |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | 900000 (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |

## 🚦 Health Check

The application provides a health check endpoint:

```http
GET /health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 📊 Monitoring

The application includes comprehensive logging using Winston. Logs are stored in:
- `logs/error.log` - Error logs only
- `logs/combined.log` - All logs

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- Input validation with Joi
- Security headers with Helmet.js
- CORS protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.