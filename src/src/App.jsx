import React, { useState, useEffect } from 'react';

// Utility functions for calculations
const calculateBMR = (gender, weightKg, heightCm, ageYears) => {
  // Mifflin-St Jeor Equation
  if (gender === 'male') {
    return (10 * weightKg) + (6.25 * heightCm) - (5 * ageYears) + 5;
  } else { // female
    return (10 * weightKg) + (6.25 * heightCm) - (5 * ageYears) - 161;
  }
};

const activityFactors = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const calculateTDEE = (bmr, activityLevel) => {
  return bmr * activityFactors[activityLevel];
};

const adjustCaloriesForGoal = (tdee, goal) => {
  switch (goal) {
    case 'lose':
      return tdee - 500; // ~1 lb/week loss
    case 'cutting':
      return tdee - 400; // Moderate deficit for cutting
    case 'gain':
    case 'bulking':
    case 'mass_gain':
      return tdee + 500; // ~1 lb/week gain, or moderate surplus for bulking/mass gain
    case 'gain_muscle':
    case 'lean_gain':
      return tdee + 200; // Smaller surplus for leaner gain
    case 'maintain':
    default:
      return tdee;
  }
};

// Mock Meal Data (expanded with dietary tags and more options)
const allMeals = [
  // Breakfast
  { id: 1, name: 'Oatmeal with Berries and Nuts', type: 'breakfast', calories: 350, description: 'Hearty oatmeal topped with fresh berries and a sprinkle of nuts.', ingredients: ['Oats', 'Milk', 'Mixed berries', 'Almonds'], dietaryTags: ['vegetarian'] },
  { id: 2, name: 'Scrambled Eggs with Whole Wheat Toast', type: 'breakfast', calories: 400, description: 'Two scrambled eggs with a slice of whole wheat toast and avocado.', ingredients: ['Eggs', 'Whole wheat bread', 'Avocado'], dietaryTags: ['eggtarian'] },
  { id: 3, name: 'Greek Yogurt with Granola and Fruit', type: 'breakfast', calories: 300, description: 'Creamy Greek yogurt with crunchy granola and a mix of seasonal fruits.', ingredients: ['Greek yogurt', 'Granola', 'Assorted fruits'], dietaryTags: ['vegetarian'] },
  { id: 14, name: 'Tofu Scramble with Spinach', type: 'breakfast', calories: 380, description: 'Savory tofu scramble seasoned with turmeric and black salt, mixed with fresh spinach.', ingredients: ['Tofu', 'Spinach', 'Onion', 'Bell pepper', 'Turmeric', 'Black salt'], dietaryTags: ['vegetarian'] },
  { id: 15, name: 'Sausage and Egg Breakfast Burrito', type: 'breakfast', calories: 550, description: 'A filling burrito with scrambled eggs, sausage, cheese, and salsa.', ingredients: ['Sausage', 'Eggs', 'Tortilla', 'Cheese', 'Salsa'], dietaryTags: ['non-vegetarian', 'eggtarian'] },

  // Lunch
  { id: 4, name: 'Chicken Salad with Quinoa', type: 'lunch', calories: 500, description: 'Grilled chicken breast served with a vibrant quinoa salad and mixed greens.', ingredients: ['Chicken breast', 'Quinoa', 'Mixed greens', 'Cherry tomatoes', 'Cucumber', 'Lemon vinaigrette'], dietaryTags: ['non-vegetarian'] },
  { id: 5, name: 'Lentil Soup with Whole Grain Bread', type: 'lunch', calories: 450, description: 'A comforting bowl of lentil soup, rich in protein and fiber, with a side of whole grain bread.', ingredients: ['Lentils', 'Vegetable broth', 'Carrots', 'Celery', 'Onion', 'Whole grain bread'], dietaryTags: ['vegetarian'] },
  { id: 6, name: 'Turkey and Veggie Wrap', type: 'lunch', calories: 400, description: 'Lean turkey slices and fresh vegetables wrapped in a whole wheat tortilla.', ingredients: ['Turkey slices', 'Whole wheat tortilla', 'Lettuce', 'Tomato', 'Bell peppers', 'Hummus'], dietaryTags: ['non-vegetarian'] },
  { id: 16, name: 'Chickpea and Veggie Curry', type: 'lunch', calories: 480, description: 'A fragrant and hearty chickpea curry with mixed vegetables, served with brown rice.', ingredients: ['Chickpeas', 'Coconut milk', 'Mixed vegetables', 'Curry paste', 'Brown rice'], dietaryTags: ['vegetarian'] },
  { id: 17, name: 'Egg Salad Sandwich', type: 'lunch', calories: 420, description: 'Classic egg salad on whole wheat bread with lettuce and tomato.', ingredients: ['Eggs', 'Mayonnaise', 'Celery', 'Whole wheat bread', 'Lettuce', 'Tomato'], dietaryTags: ['eggtarian'] },

  // Dinner
  { id: 7, name: 'Baked Salmon with Roasted Vegetables', type: 'dinner', calories: 600, description: 'Flaky baked salmon served with a medley of roasted seasonal vegetables.', ingredients: ['Salmon fillet', 'Broccoli', 'Sweet potato', 'Olive oil', 'Herbs'], dietaryTags: ['non-vegetarian'] },
  { id: 8, name: 'Brown Rice and Black Bean Bowl', type: 'dinner', calories: 550, description: 'A flavorful and filling bowl with brown rice, black beans, corn, and salsa.', ingredients: ['Brown rice', 'Black beans', 'Corn', 'Salsa', 'Avocado'], dietaryTags: ['vegetarian'] },
  { id: 9, name: 'Lean Beef Stir-fry with Brown Rice', type: 'dinner', calories: 650, description: 'Tender lean beef strips stir-fried with a variety of colorful vegetables and served over brown rice.', ingredients: ['Lean beef', 'Broccoli', 'Carrots', 'Snap peas', 'Soy sauce', 'Brown rice'], dietaryTags: ['non-vegetarian'] },
  { id: 18, name: 'Paneer Butter Masala with Naan', type: 'dinner', calories: 700, description: 'Creamy paneer butter masala, a rich Indian cheese dish, served with warm naan bread.', ingredients: ['Paneer', 'Tomato puree', 'Cream', 'Spices', 'Naan'], dietaryTags: ['vegetarian'] },
  { id: 19, name: 'Egg Curry with Rice', type: 'dinner', calories: 620, description: 'Boiled eggs cooked in a spicy onion-tomato gravy, served with steamed rice.', ingredients: ['Eggs', 'Onion', 'Tomato', 'Spices', 'Rice'], dietaryTags: ['eggtarian'] },

  // Snacks
  { id: 10, name: 'Apple Slices with Peanut Butter', type: 'snack', calories: 150, description: 'Crisp apple slices paired with a dollop of natural peanut butter.', ingredients: ['Apple', 'Peanut butter'], dietaryTags: ['vegetarian'] },
  { id: 11, name: 'Handful of Almonds', type: 'snack', calories: 180, description: 'A small portion of raw almonds, perfect for a quick energy boost.', ingredients: ['Almonds'], dietaryTags: ['vegetarian'] },
  { id: 12, name: 'Protein Shake', type: 'snack', calories: 200, description: 'A quick and easy protein shake for post-workout or a mid-day boost.', ingredients: ['Protein powder', 'Milk/Water'], dietaryTags: ['vegetarian', 'eggtarian', 'non-vegetarian'] }, // Can be customized
  { id: 13, name: 'Carrot Sticks with Hummus', type: 'snack', calories: 120, description: 'Crunchy carrot sticks served with creamy hummus.', ingredients: ['Carrots', 'Hummus'], dietaryTags: ['vegetarian'] },
  { id: 20, name: 'Boiled Egg', type: 'snack', calories: 80, description: 'A simple hard-boiled egg for a quick protein boost.', ingredients: ['Egg'], dietaryTags: ['eggtarian'] },
  { id: 21, name: 'Cottage Cheese with Pineapple', type: 'snack', calories: 160, description: 'Creamy cottage cheese paired with sweet pineapple chunks.', ingredients: ['Cottage cheese', 'Pineapple'], dietaryTags: ['vegetarian'] },
];

// Simplified meal suggestion logic
const suggestMealPlan = (calorieGoal, dietaryPreference) => {
  const plan = {
    breakfast: null,
    lunch: null,
    dinner: null,
    snacks: [],
    totalCalories: 0,
  };

  // Filter meals based on dietary preference
  const filteredMeals = allMeals.filter(meal => {
    if (dietaryPreference === 'vegetarian') {
      return meal.dietaryTags.includes('vegetarian');
    } else if (dietaryPreference === 'eggtarian') {
      return meal.dietaryTags.includes('eggtarian') || meal.dietaryTags.includes('vegetarian');
    } else { // non-vegetarian, or any other default
      return true; // All meals are available
    }
  });

  const availableMeals = {
    breakfast: filteredMeals.filter(m => m.type === 'breakfast'),
    lunch: filteredMeals.filter(m => m.type === 'lunch'),
    dinner: filteredMeals.filter(m => m.type === 'dinner'),
    snack: filteredMeals.filter(m => m.type === 'snack'),
  };

  // Try to pick one of each main meal type
  if (availableMeals.breakfast.length > 0) {
    plan.breakfast = availableMeals.breakfast[Math.floor(Math.random() * availableMeals.breakfast.length)];
    plan.totalCalories += plan.breakfast.calories;
  }
  if (availableMeals.lunch.length > 0) {
    plan.lunch = availableMeals.lunch[Math.floor(Math.random() * availableMeals.lunch.length)];
    plan.totalCalories += plan.lunch.calories;
  }
  if (availableMeals.dinner.length > 0) {
    plan.dinner = availableMeals.dinner[Math.floor(Math.random() * availableMeals.dinner.length)];
    plan.totalCalories += plan.dinner.calories;
  }

  // Add snacks to get closer to the goal
  let remainingCalories = calorieGoal - plan.totalCalories;

  // Add snacks if we are significantly below target
  // Prioritize adding snacks that don't overshoot too much
  const sortedSnacks = [...availableMeals.snack].sort((a, b) => a.calories - b.calories);

  for (const snack of sortedSnacks) {
    if (plan.totalCalories + snack.calories <= calorieGoal + 100) { // Allow slight overshoot
      plan.snacks.push(snack);
      plan.totalCalories += snack.calories;
      remainingCalories = calorieGoal - plan.totalCalories;
    } else {
      break; // Stop if adding the smallest remaining snack overshoots too much
    }
  }

  return plan;
};

// Main App Component
const App = () => {
  const [formData, setFormData] = useState({
    weight: '', // kg
    height: '', // cm
    age: '',
    gender: 'male',
    activityLevel: 'sedentary',
    goal: 'maintain',
    dietaryPreference: 'non-vegetarian', // New field
  });

  const [calculatedCalories, setCalculatedCalories] = useState(null);
  const [mealPlan, setMealPlan] = useState(null);
  const [showPlan, setShowPlan] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const { weight, height, age, gender, activityLevel, goal, dietaryPreference } = formData;

    // Basic validation
    if (!weight || !height || !age) {
      setError('Please fill in all required fields (Weight, Height, Age).');
      return;
    }
    if (isNaN(weight) || isNaN(height) || isNaN(age) || parseFloat(weight) <= 0 || parseFloat(height) <= 0 || parseInt(age) <= 0) {
      setError('Please enter valid positive numbers for Weight, Height, and Age.');
      return;
    }

    const bmr = calculateBMR(gender, parseFloat(weight), parseFloat(height), parseInt(age));
    const tdee = calculateTDEE(bmr, activityLevel);
    const finalCalories = adjustCaloriesForGoal(tdee, goal);

    setCalculatedCalories(Math.round(finalCalories));
    setMealPlan(suggestMealPlan(finalCalories, dietaryPreference));
    setShowPlan(true);
  };

  const resetForm = () => {
    setFormData({
      weight: '',
      height: '',
      age: '',
      gender: 'male',
      activityLevel: 'sedentary',
      goal: 'maintain',
      dietaryPreference: 'non-vegetarian',
    });
    setCalculatedCalories(null);
    setMealPlan(null);
    setShowPlan(false);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 font-inter">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-3xl border border-gray-200">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
          Personalized Meal Planner
        </h1>

        {!showPlan ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <p className="text-gray-600 text-center mb-6">
              Enter your details to get a personalized daily calorie goal and a sample meal plan.
            </p>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-4" role="alert">
                <strong className="font-bold">Error:</strong>
                <span className="block sm:inline ml-2">{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="e.g., 70"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                  required
                />
              </div>
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="e.g., 175"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                  required
                />
              </div>
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                  Age (years)
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="e.g., 30"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                  required
                />
              </div>
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700 mb-1">
                  Activity Level
                </label>
                <select
                  id="activityLevel"
                  name="activityLevel"
                  value={formData.activityLevel}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                >
                  <option value="sedentary">Sedentary (little or no exercise)</option>
                  <option value="light">Lightly Active (light exercise/sports 1-3 days/week)</option>
                  <option value="moderate">Moderately Active (moderate exercise/sports 3-5 days/week)</option>
                  <option value="active">Very Active (hard exercise/sports 6-7 days/week)</option>
                  <option value="very_active">Extra Active (very hard exercise/physical job)</option>
                </select>
              </div>
              <div>
                <label htmlFor="dietaryPreference" className="block text-sm font-medium text-gray-700 mb-1">
                  Dietary Preference
                </label>
                <select
                  id="dietaryPreference"
                  name="dietaryPreference"
                  value={formData.dietaryPreference}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                >
                  <option value="non-vegetarian">Non-Vegetarian</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="eggtarian">Eggtarian</option>
                </select>
              </div>
              <div className="md:col-span-2"> {/* Span two columns for better layout */}
                <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1">
                  Health/Fitness Goal
                </label>
                <select
                  id="goal"
                  name="goal"
                  value={formData.goal}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                >
                  <option value="maintain">Maintain Weight</option>
                  <option value="lose">Lose Weight</option>
                  <option value="gain">Gain Weight</option>
                  <option value="cutting">Cutting (Fat Loss)</option>
                  <option value="bulking">Bulking (Mass Gain)</option>
                  <option value="lean_gain">Lean Gain (Slow, Muscle-Focused Gain)</option>
                  <option value="gain_muscle">Gain Muscle (General Muscle Growth)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 ease-in-out transform hover:scale-105"
            >
              Generate Meal Plan
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Your Personalized Plan</h2>
            <div className="bg-indigo-50 p-6 rounded-xl shadow-inner text-center">
              <p className="text-lg text-gray-700 mb-2">
                Based on your input, your estimated daily calorie goal is:
              </p>
              <p className="text-5xl font-extrabold text-indigo-700">
                {calculatedCalories} <span className="text-3xl">calories</span>
              </p>
            </div>

            {mealPlan && (
              <div className="mt-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Sample Daily Meal Plan:</h3>
                <div className="space-y-4">
                  {mealPlan.breakfast && (
                    <MealCard meal={mealPlan.breakfast} title="Breakfast" />
                  )}
                  {mealPlan.lunch && (
                    <MealCard meal={mealPlan.lunch} title="Lunch" />
                  )}
                  {mealPlan.dinner && (
                    <MealCard meal={mealPlan.dinner} title="Dinner" />
                  )}
                  {mealPlan.snacks.length > 0 && (
                    <div className="bg-green-50 p-4 rounded-lg shadow-sm border border-green-200">
                      <h4 className="text-xl font-semibold text-green-700 mb-2">Snacks</h4>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {mealPlan.snacks.map((snack) => (
                          <li key={snack.id} className="text-base">
                            <span className="font-medium">{snack.name}</span> ({snack.calories} kcal)
                            <p className="text-sm text-gray-600 ml-4">{snack.description}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {(!mealPlan.breakfast && !mealPlan.lunch && !mealPlan.dinner && mealPlan.snacks.length === 0) && (
                    <div className="bg-red-50 p-4 rounded-lg shadow-sm border border-red-200 text-red-700">
                      <p>No suitable meals found for your selected dietary preference and calorie range. Please try adjusting your preferences or note that the meal database is limited.</p>
                    </div>
                  )}
                </div>
                <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-inner text-center text-gray-700 font-semibold">
                  Total Estimated Calories for Plan: {mealPlan.totalCalories} kcal
                </div>
              </div>
            )}

            <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200 text-yellow-800 text-sm">
              <p className="font-bold mb-2">Disclaimer:</p>
              <p>
                This meal plan is a *sample suggestion* based on general calorie calculations and predefined meal options. It is not professional medical or dietary advice. Always consult with a qualified healthcare professional or registered dietitian before making any significant changes to your diet or exercise routine. Individual nutritional needs can vary widely.
              </p>
            </div>

            <button
              onClick={resetForm}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-200 ease-in-out transform hover:scale-105"
            >
              Recalculate / Change Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable Meal Card Component
const MealCard = ({ meal, title }) => (
  <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
    <h4 className="text-xl font-semibold text-indigo-700 mb-2">{title}: {meal.name}</h4>
    <p className="text-gray-700 mb-2">{meal.description}</p>
    <p className="text-sm text-gray-600">Calories: <span className="font-semibold">{meal.calories} kcal</span></p>
    <div className="mt-2">
      <p className="text-sm font-medium text-gray-700">Ingredients:</p>
      <ul className="list-disc list-inside text-sm text-gray-600">
        {meal.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
    </div>
  </div>
);

export default App;
