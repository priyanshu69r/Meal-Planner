Personalized Meal Planner

A responsive web application built with React and Tailwind CSS that helps users calculate their daily calorie needs based on personal metrics and health goals, then suggests a sample meal plan.

✨ Features

Personalized Calorie Calculation: Calculates Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) based on weight, height, age, gender, and activity level.

Flexible Health/Fitness Goals: Adjusts calorie targets for various goals including:

Maintain Weight

Lose Weight

Gain Weight

Cutting (Fat Loss)

Bulking (Mass Gain)

Lean Gain (Slow, Muscle-Focused Gain)

Gain Muscle (General Muscle Growth)

Dietary Preferences: Filters meal suggestions based on:

Non-Vegetarian

Vegetarian

Eggtarian

Sample Meal Plan Generation: Provides a sample daily meal plan (Breakfast, Lunch, Dinner, Snacks) from a mock dataset, tailored to the calculated calorie goal and dietary preference.

Responsive Design: Optimized for seamless experience across desktop, tablet, and mobile devices.

Intuitive UI: Clean and user-friendly interface powered by Tailwind CSS.

Input Validation: Basic validation for numerical inputs.

🚀 Technologies Used

React.js: Frontend library for building user interfaces.

Vite: Fast development build tool for React projects.

Tailwind CSS: A utility-first CSS framework for rapid and consistent styling.

JavaScript (ES6+): Core programming language.

📦 Project Structurepersonalized-meal-planner/ ├── public/ │ └── vite.svg ├── src/ │ ├── App.jsx # Main React component with all logic and UI │ ├── index.css # Tailwind CSS directives and font imports │ └── main.jsx # React app entry point ├── .gitignore # Specifies intentionally untracked files to ignore ├── index.html # Main HTML file ├── package.json # Project metadata and dependencies ├── postcss.config.js # PostCSS configuration for Tailwind ├── README.md # This file └── tailwind.config.js # Tailwind CSS configuration 
🛠️ Installation and Setup

To get a local copy up and running, follow these simple steps.

Clone the repository (or create the files manually):

git clone https://github.com/YOUR_USERNAME/personalized-meal-planner.git cd personalized-meal-planner 

Install dependencies:

npm install # or yarn install 

Run the development server:

npm run start # or yarn start 

The application will open in your browser at http://localhost:5173 (or another port if 5173 is in use).

💡 Future Enhancements

