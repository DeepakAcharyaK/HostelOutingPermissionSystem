npm install firebase react-router-dom@6
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

```tailwind.config.js```
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};

```src/index.css```
@tailwind base;
@tailwind components;
@tailwind utilities;
