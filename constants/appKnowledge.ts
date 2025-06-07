// This file contains knowledge about the app that the AI assistant can use to answer questions

export const appKnowledge = {
  // System prompt for the AI assistant
  systemPrompt: `
As the fitness app assistant, I have detailed knowledge about all app features:

GOALS:
- Users can set daily, weekly, and monthly fitness goals
- Goal categories include weight, workout, nutrition, water, steps, and health
- Goals can have milestones for tracking progress
- The app automatically tracks progress for many goal types
- Users can set reminders for goals

WORKOUTS:
- Users can log workouts with exercises, sets, reps, and weight
- The app has pre-defined workouts and exercises
- Users can create custom workouts
- Rest timers help track breaks between sets
- Workout history is available for progress tracking
- Users can schedule workouts for future dates

NUTRITION:
- The app tracks macros (protein, carbs, fat) and calories
- Users can log meals and food items
- Daily nutrition targets are calculated based on user profile
- Water intake tracking is available with customizable bottle sizes
- Food photos can be captured for visual food journaling

HEALTH TRACKING:
- Step counting tracks daily activity
- Weight logging shows progress over time
- Users can connect health devices for more data
- The app provides health insights based on tracked data

ACHIEVEMENTS & GAMIFICATION:
- Users earn badges for completing fitness milestones
- Streak tracking encourages consistent app usage
- Daily quests provide short-term goals
- Challenges offer longer-term fitness goals
- Personal records (PRs) are celebrated with animations

PROFILE & SETTINGS:
- Users can customize their profile with personal details
- Theme settings allow customization of app appearance
- Notification preferences control app alerts
- Privacy settings manage data sharing and storage

I'll provide helpful, accurate information about these features and how to use them effectively.
`,

  // Suggested questions that users might want to ask
  suggestions: [
    "How do I set up a weekly goal?",
    "How do achievements work?",
    "How do I track my water intake?",
    "How do I create a custom workout?",
    "How do I log my weight?",
    "What are daily quests?",
    "How do I track my nutrition?",
    "How do I view my progress?",
    "How do I earn badges?",
    "How do I schedule a workout?",
  ],

  // Specific knowledge about goals
  goals: {
    types: ["daily", "weekly", "monthly"],
    categories: ["weight", "workout", "nutrition", "water", "steps", "health"],
    features: [
      "Automatic progress tracking",
      "Custom milestones",
      "Reminders",
      "Progress visualization",
    ],
    setup: `
To set up a goal:
1. Go to the Goals tab
2. Tap "Add Goal"
3. Select goal category and timeframe
4. Enter goal details
5. Optionally add milestones
6. Set reminders if needed
7. Save your goal
    `,
  },

  // Knowledge about workouts
  workouts: {
    features: [
      "Pre-defined workouts",
      "Custom workouts",
      "Exercise library",
      "Rest timers",
      "Workout history",
      "Scheduling",
    ],
    tracking: `
To track a workout:
1. Go to Workouts tab
2. Select a workout
3. Tap "Start Workout"
4. Log sets, reps, and weights
5. Use rest timer between sets
6. Add notes if needed
7. Complete workout
    `,
    creation: `
To create a custom workout:
1. Go to Workouts tab
2. Tap "Create Workout"
3. Add workout name and category
4. Add exercises from library
5. Set default sets, reps, and weights
6. Save your workout
    `,
  },

  // Knowledge about nutrition tracking
  nutrition: {
    features: [
      "Macro tracking",
      "Calorie tracking",
      "Water intake",
      "Food logging",
      "Food photos",
    ],
    macros: `
The app tracks three main macronutrients:
- Protein: Important for muscle repair and growth
- Carbohydrates: Primary energy source
- Fat: Essential for hormone production and nutrient absorption

Your targets are calculated based on your profile information.
    `,
    logging: `
To log food:
1. Go to Nutrition tab
2. Tap "Log Food"
3. Search for food item
4. Enter portion size
5. Save to your food diary
    `,
  },

  // Knowledge about health tracking
  health: {
    features: [
      "Step counting",
      "Weight tracking",
      "Health device integration",
      "Health insights",
    ],
    weightTracking: `
To log your weight:
1. Go to Health tab
2. Tap "Log Weight"
3. Enter your current weight
4. Optionally add notes
5. Save your entry
    `,
  },

  // Knowledge about achievements and gamification
  achievements: {
    features: [
      "Badges",
      "Streaks",
      "Daily quests",
      "Challenges",
      "Personal records",
    ],
    badges: `
Badges are earned by reaching fitness milestones, such as:
- Completing a certain number of workouts
- Reaching step goals
- Maintaining streaks
- Logging nutrition consistently
    `,
    quests: `
Daily quests are small tasks that refresh each day, such as:
- Complete a workout
- Log all meals
- Reach step goal
- Track water intake
    `,
  },
};