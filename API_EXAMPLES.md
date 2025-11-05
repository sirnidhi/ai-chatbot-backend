# API Usage Examples

## Authentication Examples

### 1. Register a New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 2. Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## Chat Examples

### 3. Send a Chat Message
```bash
curl -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "message": "Hello, how can you help me today?",
    "aiProvider": "openai"
  }'
```

### 4. Get User Conversations
```bash
curl -X GET "http://localhost:5000/api/chat/conversations?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 5. Get Specific Conversation
```bash
curl -X GET http://localhost:5000/api/chat/conversations/CONVERSATION_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Admin Examples (Requires Admin Role)

### 6. Get Dashboard Statistics
```bash
curl -X GET http://localhost:5000/api/admin/dashboard \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

### 7. Get Query Logs
```bash
curl -X GET "http://localhost:5000/api/admin/logs?page=1&limit=50&status=success" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

### 8. Get System Health
```bash
curl -X GET http://localhost:5000/api/admin/health \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

## Socket.IO Examples

### JavaScript Client Example
```javascript
const io = require('socket.io-client');

const socket = io('http://localhost:5000', {
  auth: {
    token: 'YOUR_JWT_TOKEN'
  }
});

// Send message
socket.emit('send_message', {
  message: 'Hello AI!',
  aiProvider: 'openai'
});

// Listen for responses
socket.on('message_received', (data) => {
  console.log('Message:', data);
});

socket.on('ai_typing', () => {
  console.log('AI is typing...');
});

socket.on('ai_typing_stop', () => {
  console.log('AI finished typing');
});
```

## Response Examples

### Successful Login Response
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Chat Message Response
```json
{
  "conversationId": "60f7b3b3b3b3b3b3b3b3b3b4",
  "message": "Hello! I'm here to help you with any questions you have.",
  "provider": "openai",
  "tokens": 25,
  "responseTime": 1250,
  "fallback": false
}
```

### Dashboard Stats Response
```json
{
  "stats": {
    "totalUsers": 150,
    "activeUsers": 142,
    "totalConversations": 1250,
    "totalQueries": 5420,
    "todayQueries": 89,
    "providerStats": [
      {
        "_id": "openai",
        "count": 3200,
        "totalTokens": 125000,
        "avgResponseTime": 1150
      },
      {
        "_id": "gemini",
        "count": 2220,
        "totalTokens": 98000,
        "avgResponseTime": 950
      }
    ]
  }
}
```