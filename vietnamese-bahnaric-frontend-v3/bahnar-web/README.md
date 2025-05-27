# Bahnar Web Application

Frontend web application for the Bahnar language learning platform, built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- Modern, responsive user interface
- Interactive language learning tools
- Real-time translation capabilities
- User authentication and profile management
- Progressive Web App (PWA) support
- Dark/Light mode
- Multi-language support

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bahnar-web
```

2. Install dependencies:
```bash
yarn install
# or
npm install
```

3. Create a `.env` file in the root directory and configure your environment variables:
```env
REACT_APP_API_URL=your_api_url
REACT_APP_FIREBASE_CONFIG=your_firebase_config
```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
yarn start
# or
npm start
```

### Production Build
```bash
yarn build
# or
npm run build
```

### Using Docker
```bash
docker build -t bahnar-web .
docker run -p 3000:80 bahnar-web
```

## 📦 Project Structure

```
src/
├── assets/        # Static assets (images, fonts, etc.)
├── components/    # Reusable React components
├── config/        # Configuration files
├── contexts/      # React contexts
├── hooks/         # Custom React hooks
├── layouts/       # Layout components
├── pages/         # Page components
├── services/      # API services
├── styles/        # Global styles and Tailwind config
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## 🎨 Styling

This project uses Tailwind CSS for styling. The configuration can be found in `tailwind.config.js`.

## 🧪 Testing

```bash
yarn test
# or
npm test
```

## 📱 Progressive Web App

The application is configured as a Progressive Web App (PWA), providing:
- Offline functionality
- Installable on devices
- Push notifications (if configured)

## 🔧 Development Tools

- ESLint for code linting
- Prettier for code formatting
- Husky for git hooks
- TypeScript for type safety

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
