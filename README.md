# 🎮 DSA Game Platform

A gamified platform for learning Data Structures and Algorithms with an engaging, game-like interface featuring levels, points, achievements, and real-time code execution.

## ✨ Features

### 🎯 **Gamification**
- **Level System**: Progressive difficulty with locked/unlocked levels
- **Points & XP**: Earn points for solving problems and maintain streaks
- **Achievements**: Unlock badges for milestones and special accomplishments
- **Leaderboards**: Global and category-based rankings
- **Streaks**: Daily coding streaks with bonus rewards

### 💻 **Interactive Learning**
- **Code Editor**: Built-in Monaco Editor with syntax highlighting and auto-completion
- **Multi-language Support**: JavaScript, Python, Java, C++
- **Real-time Execution**: Test your code with instant feedback
- **Problem Descriptions**: Detailed explanations with examples and hints
- **Progress Tracking**: Visual progress bars and statistics

### 🎨 **Modern UI/UX**
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Themes**: Customizable interface
- **Smooth Animations**: Framer Motion for engaging interactions
- **Game-like Elements**: Visual progress indicators and achievement celebrations

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Python 3 (for code execution)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dsa-game-platform
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   cp backend/.env.example backend/.env
   ```
   Edit `backend/.env` with your MongoDB connection string and JWT secret.

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:5000`
   - Frontend development server on `http://localhost:3000`

5. **Seed the database** (optional)
   ```bash
   cd backend
   npm run seed
   ```

## 🏗️ Project Structure

```
dsa-game-platform/
├── backend/                 # Node.js/Express backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── scripts/            # Database seeding scripts
│   └── server.js           # Main server file
├── frontend/               # Next.js frontend
│   ├── app/                # Next.js 13+ app directory
│   ├── components/         # React components
│   ├── contexts/           # React contexts
│   └── styles/             # CSS and styling
└── package.json            # Root package.json
```

## 🎮 How to Play

1. **Create Account**: Sign up with username, email, and password
2. **Start Level 1**: Begin with basic array problems
3. **Solve Problems**: Write code in your preferred language
4. **Earn Points**: Get XP and points for correct solutions
5. **Unlock Levels**: Complete problems to unlock new levels
6. **Track Progress**: Monitor your stats and achievements
7. **Compete**: Climb the leaderboards and maintain streaks

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Socket.io** - Real-time features

### Frontend
- **Next.js 13+** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Monaco Editor** - Code editor
- **Zustand** - State management

### Code Execution
- **Node.js** - JavaScript execution
- **Python 3** - Python execution
- **Child processes** - Secure code execution

## 📊 Database Schema

### User Model
- Profile information (username, email, avatar)
- Game stats (level, XP, points, streaks)
- Progress tracking (completed problems, achievements)
- Preferences (theme, language, difficulty)

### Level Model
- Level metadata (number, title, description)
- Difficulty and category
- Rewards (XP, points)
- Prerequisites and problems

### Problem Model
- Problem details (title, description, examples)
- Test cases and constraints
- Starter code for multiple languages
- Solution templates

### Achievement Model
- Achievement metadata (name, description, icon)
- Unlock criteria and rewards
- Rarity and category

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Levels & Problems
- `GET /api/levels` - Get all levels
- `GET /api/levels/:id` - Get specific level
- `GET /api/levels/user/unlocked` - Get user's unlocked levels

### Progress & Submissions
- `POST /api/progress/submit` - Submit solution
- `GET /api/progress/user` - Get user progress
- `GET /api/progress/category/:category` - Get category progress

### Leaderboards
- `GET /api/leaderboard/global` - Global leaderboard
- `GET /api/leaderboard/category/:category` - Category leaderboard
- `GET /api/leaderboard/user/rank` - User's rank

### Code Execution
- `POST /api/code/run` - Execute code with test cases

## 🎨 Customization

### Adding New Problems
1. Create problem data in `backend/scripts/seedData.js`
2. Include test cases, examples, and starter code
3. Run `npm run seed` to update database

### Adding New Achievements
1. Define achievement criteria in the database
2. Update achievement checking logic in progress routes
3. Add achievement UI components

### Styling
- Modify `frontend/tailwind.config.js` for theme customization
- Update `frontend/app/globals.css` for global styles
- Customize component styles in individual files

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB
2. Configure environment variables
3. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Build the Next.js application
2. Deploy to Vercel, Netlify, or similar platforms
3. Update API URLs in environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- LeetCode for problem inspiration
- Monaco Editor for the excellent code editor
- Framer Motion for smooth animations
- The open-source community for amazing tools and libraries

---

**Happy Coding! 🎮✨**

Start your DSA learning journey today and become a coding champion!