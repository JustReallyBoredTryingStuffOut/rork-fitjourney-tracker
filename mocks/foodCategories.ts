import { FoodCategory } from "@/types";

// Food categories with default macro information
export const foodCategories: FoodCategory[] = [
  // Breakfast Categories
  {
    id: "breakfast-fruits",
    name: "Fruits",
    mealType: "breakfast",
    items: [
      {
        id: "apple",
        name: "Apple",
        calories: 95,
        protein: 0.5,
        carbs: 25,
        fat: 0.3,
        servingSize: "1 medium (182g)",
        imageUrl: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "banana",
        name: "Banana",
        calories: 105,
        protein: 1.3,
        carbs: 27,
        fat: 0.4,
        servingSize: "1 medium (118g)",
        imageUrl: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "berries-mix",
        name: "Mixed Berries",
        calories: 70,
        protein: 1,
        carbs: 17,
        fat: 0.5,
        servingSize: "1 cup (150g)",
        imageUrl: "https://images.unsplash.com/photo-1563746924237-f4471932a1a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "orange",
        name: "Orange",
        calories: 62,
        protein: 1.2,
        carbs: 15.4,
        fat: 0.2,
        servingSize: "1 medium (131g)",
        imageUrl: "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      }
    ]
  },
  {
    id: "breakfast-eggs",
    name: "Eggs",
    mealType: "breakfast",
    items: [
      {
        id: "scrambled-eggs",
        name: "Scrambled Eggs",
        calories: 140,
        protein: 12,
        carbs: 1,
        fat: 10,
        servingSize: "2 eggs",
        imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "boiled-egg",
        name: "Boiled Egg",
        calories: 78,
        protein: 6.3,
        carbs: 0.6,
        fat: 5.3,
        servingSize: "1 large egg",
        imageUrl: "https://images.unsplash.com/photo-1607690424560-35d7c9b7118e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "egg-whites",
        name: "Egg Whites",
        calories: 52,
        protein: 11,
        carbs: 0.7,
        fat: 0.2,
        servingSize: "4 egg whites",
        imageUrl: "https://images.unsplash.com/photo-1608197492882-77eff6f3c6e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "omelette",
        name: "Vegetable Omelette",
        calories: 220,
        protein: 15,
        carbs: 5,
        fat: 16,
        servingSize: "3 eggs with vegetables",
        imageUrl: "https://images.unsplash.com/photo-1510693206972-df098062cb71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      }
    ]
  },
  {
    id: "breakfast-dairy",
    name: "Dairy & Yogurt",
    mealType: "breakfast",
    items: [
      {
        id: "greek-yogurt",
        name: "Greek Yogurt",
        calories: 100,
        protein: 17,
        carbs: 6,
        fat: 0.5,
        servingSize: "6 oz (170g)",
        imageUrl: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "cottage-cheese",
        name: "Cottage Cheese",
        calories: 120,
        protein: 14,
        carbs: 3,
        fat: 5,
        servingSize: "1/2 cup (113g)",
        imageUrl: "https://images.unsplash.com/photo-1559561853-08451507cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "milk",
        name: "Milk (2%)",
        calories: 122,
        protein: 8,
        carbs: 12,
        fat: 5,
        servingSize: "1 cup (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      }
    ]
  },
  {
    id: "breakfast-cereals",
    name: "Cereals & Oats",
    mealType: "breakfast",
    items: [
      {
        id: "oatmeal",
        name: "Oatmeal",
        calories: 150,
        protein: 5,
        carbs: 27,
        fat: 2.5,
        servingSize: "1 cup cooked (234g)",
        imageUrl: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "granola",
        name: "Granola",
        calories: 220,
        protein: 6,
        carbs: 30,
        fat: 10,
        servingSize: "1/2 cup (56g)",
        imageUrl: "https://images.unsplash.com/photo-1517093157656-b9eccef91cb1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "whole-grain-cereal",
        name: "Whole Grain Cereal",
        calories: 180,
        protein: 4,
        carbs: 40,
        fat: 1,
        servingSize: "1 cup (40g)",
        imageUrl: "https://images.unsplash.com/photo-1521483451569-e33803c0330c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      }
    ]
  },
  {
    id: "breakfast-breads",
    name: "Breads & Toast",
    mealType: "breakfast",
    items: [
      {
        id: "whole-wheat-toast",
        name: "Whole Wheat Toast",
        calories: 70,
        protein: 3,
        carbs: 13,
        fat: 1,
        servingSize: "1 slice",
        imageUrl: "https://images.unsplash.com/photo-1598373182133-52452f7691ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "avocado-toast",
        name: "Avocado Toast",
        calories: 190,
        protein: 5,
        carbs: 15,
        fat: 12,
        servingSize: "1 slice with 1/4 avocado",
        imageUrl: "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "bagel",
        name: "Bagel with Cream Cheese",
        calories: 320,
        protein: 11,
        carbs: 50,
        fat: 9,
        servingSize: "1 bagel with 2 tbsp cream cheese",
        imageUrl: "https://images.unsplash.com/photo-1592845345986-1e4b1e999b56?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      }
    ]
  },

  // Lunch Categories
  {
    id: "lunch-sandwiches",
    name: "Sandwiches & Wraps",
    mealType: "lunch",
    items: [
      {
        id: "turkey-sandwich",
        name: "Turkey Sandwich",
        calories: 320,
        protein: 20,
        carbs: 40,
        fat: 9,
        servingSize: "1 sandwich",
        imageUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "chicken-wrap",
        name: "Chicken Wrap",
        calories: 350,
        protein: 25,
        carbs: 35,
        fat: 12,
        servingSize: "1 wrap",
        imageUrl: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "veggie-sandwich",
        name: "Veggie Sandwich",
        calories: 280,
        protein: 10,
        carbs: 45,
        fat: 8,
        servingSize: "1 sandwich",
        imageUrl: "https://images.unsplash.com/photo-1554433607-66b5efe9d304?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      }
    ]
  },
  {
    id: "lunch-salads",
    name: "Salads",
    mealType: "lunch",
    items: [
      {
        id: "chicken-salad",
        name: "Grilled Chicken Salad",
        calories: 320,
        protein: 30,
        carbs: 10,
        fat: 18,
        servingSize: "1 bowl (300g)",
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "caesar-salad",
        name: "Caesar Salad",
        calories: 290,
        protein: 15,
        carbs: 12,
        fat: 20,
        servingSize: "1 bowl (250g)",
        imageUrl: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "greek-salad",
        name: "Greek Salad",
        calories: 230,
        protein: 8,
        carbs: 15,
        fat: 16,
        servingSize: "1 bowl (250g)",
        imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      }
    ]
  },
  {
    id: "lunch-soups",
    name: "Soups",
    mealType: "lunch",
    items: [
      {
        id: "chicken-noodle-soup",
        name: "Chicken Noodle Soup",
        calories: 180,
        protein: 12,
        carbs: 20,
        fat: 6,
        servingSize: "1 bowl (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "tomato-soup",
        name: "Tomato Soup",
        calories: 160,
        protein: 4,
        carbs: 25,
        fat: 6,
        servingSize: "1 bowl (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "lentil-soup",
        name: "Lentil Soup",
        calories: 210,
        protein: 14,
        carbs: 30,
        fat: 5,
        servingSize: "1 bowl (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1616501268209-edfff098fdd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      }
    ]
  },
  {
    id: "lunch-bowls",
    name: "Grain Bowls",
    mealType: "lunch",
    items: [
      {
        id: "quinoa-bowl",
        name: "Quinoa Bowl",
        calories: 380,
        protein: 15,
        carbs: 50,
        fat: 14,
        servingSize: "1 bowl (350g)",
        imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "rice-bowl",
        name: "Brown Rice Bowl",
        calories: 420,
        protein: 18,
        carbs: 65,
        fat: 10,
        servingSize: "1 bowl (400g)",
        imageUrl: "https://images.unsplash.com/photo-1543340713-1bf56d3d1b68?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "buddha-bowl",
        name: "Buddha Bowl",
        calories: 450,
        protein: 20,
        carbs: 55,
        fat: 16,
        servingSize: "1 bowl (400g)",
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      }
    ]
  },

  // Dinner Categories
  {
    id: "dinner-proteins",
    name: "Proteins",
    mealType: "dinner",
    items: [
      {
        id: "grilled-chicken",
        name: "Grilled Chicken Breast",
        calories: 165,
        protein: 31,
        carbs: 0,
        fat: 3.6,
        servingSize: "1 breast (100g)",
        imageUrl: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "salmon",
        name: "Baked Salmon",
        calories: 206,
        protein: 22,
        carbs: 0,
        fat: 13,
        servingSize: "1 fillet (100g)",
        imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "steak",
        name: "Sirloin Steak",
        calories: 250,
        protein: 26,
        carbs: 0,
        fat: 16,
        servingSize: "1 steak (100g)",
        imageUrl: "https://images.unsplash.com/photo-1529694157872-4e0c0f3b238b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "tofu",
        name: "Tofu",
        calories: 144,
        protein: 16,
        carbs: 3,
        fat: 8,
        servingSize: "1 block (100g)",
        imageUrl: "https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      }
    ]
  },
  {
    id: "dinner-sides",
    name: "Side Dishes",
    mealType: "dinner",
    items: [
      {
        id: "roasted-vegetables",
        name: "Roasted Vegetables",
        calories: 120,
        protein: 3,
        carbs: 20,
        fat: 4,
        servingSize: "1 cup (150g)",
        imageUrl: "https://images.unsplash.com/photo-1546548970-71785318a17b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "mashed-potatoes",
        name: "Mashed Potatoes",
        calories: 210,
        protein: 4,
        carbs: 35,
        fat: 7,
        servingSize: "1 cup (210g)",
        imageUrl: "https://images.unsplash.com/photo-1518798108586-1d8f8bd5e223?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "brown-rice",
        name: "Brown Rice",
        calories: 216,
        protein: 5,
        carbs: 45,
        fat: 1.8,
        servingSize: "1 cup cooked (195g)",
        imageUrl: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "quinoa",
        name: "Quinoa",
        calories: 222,
        protein: 8,
        carbs: 39,
        fat: 3.6,
        servingSize: "1 cup cooked (185g)",
        imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e8ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      }
    ]
  },
  {
    id: "dinner-pasta",
    name: "Pasta & Noodles",
    mealType: "dinner",
    items: [
      {
        id: "spaghetti-bolognese",
        name: "Spaghetti Bolognese",
        calories: 380,
        protein: 20,
        carbs: 50,
        fat: 12,
        servingSize: "1 plate (300g)",
        imageUrl: "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "pasta-primavera",
        name: "Pasta Primavera",
        calories: 320,
        protein: 12,
        carbs: 55,
        fat: 8,
        servingSize: "1 plate (300g)",
        imageUrl: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "stir-fry-noodles",
        name: "Stir-Fry Noodles",
        calories: 350,
        protein: 15,
        carbs: 48,
        fat: 12,
        servingSize: "1 plate (300g)",
        imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      }
    ]
  },
  {
    id: "dinner-one-pot",
    name: "One-Pot Meals",
    mealType: "dinner",
    items: [
      {
        id: "chili",
        name: "Chili Con Carne",
        calories: 320,
        protein: 25,
        carbs: 30,
        fat: 12,
        servingSize: "1 bowl (300g)",
        imageUrl: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "curry",
        name: "Vegetable Curry",
        calories: 280,
        protein: 10,
        carbs: 35,
        fat: 14,
        servingSize: "1 bowl (300g)",
        imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "stew",
        name: "Beef Stew",
        calories: 350,
        protein: 28,
        carbs: 25,
        fat: 15,
        servingSize: "1 bowl (300g)",
        imageUrl: "https://images.unsplash.com/photo-1608500218890-c4f9a2f2f222?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      }
    ]
  },

  // Snack Categories
  {
    id: "snack-nuts",
    name: "Nuts & Seeds",
    mealType: "snack",
    items: [
      {
        id: "almonds",
        name: "Almonds",
        calories: 160,
        protein: 6,
        carbs: 6,
        fat: 14,
        servingSize: "1 oz (28g)",
        imageUrl: "https://images.unsplash.com/photo-1536816579748-4ecb3f03d72a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "walnuts",
        name: "Walnuts",
        calories: 185,
        protein: 4.3,
        carbs: 3.9,
        fat: 18.5,
        servingSize: "1 oz (28g)",
        imageUrl: "https://images.unsplash.com/photo-1563412885-139e4045ec52?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "trail-mix",
        name: "Trail Mix",
        calories: 200,
        protein: 5,
        carbs: 20,
        fat: 12,
        servingSize: "1/4 cup (40g)",
        imageUrl: "https://images.unsplash.com/photo-1604210565264-8917562a63d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      }
    ]
  },
  {
    id: "snack-fruits",
    name: "Fruits",
    mealType: "snack",
    items: [
      {
        id: "apple-snack",
        name: "Apple",
        calories: 95,
        protein: 0.5,
        carbs: 25,
        fat: 0.3,
        servingSize: "1 medium (182g)",
        imageUrl: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "banana-snack",
        name: "Banana",
        calories: 105,
        protein: 1.3,
        carbs: 27,
        fat: 0.4,
        servingSize: "1 medium (118g)",
        imageUrl: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "grapes",
        name: "Grapes",
        calories: 104,
        protein: 1.1,
        carbs: 27.3,
        fat: 0.2,
        servingSize: "1 cup (151g)",
        imageUrl: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      }
    ]
  },
  {
    id: "snack-bars",
    name: "Protein & Energy Bars",
    mealType: "snack",
    items: [
      {
        id: "protein-bar",
        name: "Protein Bar",
        calories: 200,
        protein: 20,
        carbs: 20,
        fat: 5,
        servingSize: "1 bar (60g)",
        imageUrl: "https://images.unsplash.com/photo-1622484212850-eb596d769edc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "granola-bar",
        name: "Granola Bar",
        calories: 120,
        protein: 3,
        carbs: 20,
        fat: 4,
        servingSize: "1 bar (30g)",
        imageUrl: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "energy-bar",
        name: "Energy Bar",
        calories: 180,
        protein: 8,
        carbs: 25,
        fat: 6,
        servingSize: "1 bar (50g)",
        imageUrl: "https://images.unsplash.com/photo-1571748982800-fa51082c2224?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      }
    ]
  },
  {
    id: "snack-yogurt",
    name: "Yogurt & Dairy",
    mealType: "snack",
    items: [
      {
        id: "greek-yogurt-snack",
        name: "Greek Yogurt",
        calories: 100,
        protein: 17,
        carbs: 6,
        fat: 0.5,
        servingSize: "6 oz (170g)",
        imageUrl: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "string-cheese",
        name: "String Cheese",
        calories: 80,
        protein: 7,
        carbs: 1,
        fat: 6,
        servingSize: "1 stick (28g)",
        imageUrl: "https://images.unsplash.com/photo-1589881133595-a3c085cb731d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "cottage-cheese-snack",
        name: "Cottage Cheese",
        calories: 120,
        protein: 14,
        carbs: 3,
        fat: 5,
        servingSize: "1/2 cup (113g)",
        imageUrl: "https://images.unsplash.com/photo-1559561853-08451507cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      }
    ]
  },
  {
    id: "snack-vegetables",
    name: "Vegetables & Dips",
    mealType: "snack",
    items: [
      {
        id: "hummus-carrots",
        name: "Hummus with Carrots",
        calories: 150,
        protein: 5,
        carbs: 15,
        fat: 8,
        servingSize: "1/4 cup hummus with 1 cup carrots",
        imageUrl: "https://images.unsplash.com/photo-1564894809611-1742fc40ed80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "guacamole",
        name: "Guacamole with Veggie Sticks",
        calories: 180,
        protein: 3,
        carbs: 12,
        fat: 15,
        servingSize: "1/4 cup guacamole with vegetables",
        imageUrl: "https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "edamame",
        name: "Edamame",
        calories: 120,
        protein: 11,
        carbs: 10,
        fat: 5,
        servingSize: "1 cup (155g)",
        imageUrl: "https://images.unsplash.com/photo-1564894809611-1742fc40ed80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      }
    ]
  }
];

// Helper function to get food categories by meal type
export function getFoodCategoriesByMealType(mealType: string): FoodCategory[] {
  return foodCategories.filter(category => category.mealType === mealType);
}

// Helper function to get a specific food item
export function getFoodItemById(itemId: string): any {
  for (const category of foodCategories) {
    const item = category.items.find(item => item.id === itemId);
    if (item) {
      return item;
    }
  }
  return null;
}