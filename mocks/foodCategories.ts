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
      },
      {
        id: "strawberries",
        name: "Strawberries",
        calories: 49,
        protein: 1,
        carbs: 11.7,
        fat: 0.5,
        servingSize: "1 cup (152g)",
        imageUrl: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "blueberries",
        name: "Blueberries",
        calories: 84,
        protein: 1.1,
        carbs: 21.4,
        fat: 0.5,
        servingSize: "1 cup (148g)",
        imageUrl: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "pineapple",
        name: "Pineapple",
        calories: 82,
        protein: 0.9,
        carbs: 21.6,
        fat: 0.2,
        servingSize: "1 cup chunks (165g)",
        imageUrl: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "mango",
        name: "Mango",
        calories: 99,
        protein: 1.4,
        carbs: 24.7,
        fat: 0.6,
        servingSize: "1 cup sliced (165g)",
        imageUrl: "https://images.unsplash.com/photo-1553279768-865429fa0078?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
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
      },
      {
        id: "egg-sandwich",
        name: "Egg Sandwich",
        calories: 350,
        protein: 16,
        carbs: 30,
        fat: 18,
        servingSize: "1 sandwich",
        imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "eggs-benedict",
        name: "Eggs Benedict",
        calories: 730,
        protein: 25,
        carbs: 47,
        fat: 50,
        servingSize: "1 serving (2 eggs)",
        imageUrl: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "frittata",
        name: "Vegetable Frittata",
        calories: 280,
        protein: 18,
        carbs: 8,
        fat: 20,
        servingSize: "1 slice (1/6 of 10-inch frittata)",
        imageUrl: "https://images.unsplash.com/photo-1623855244183-52fd8d3ce2f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
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
      },
      {
        id: "yogurt-parfait",
        name: "Yogurt Parfait",
        calories: 210,
        protein: 10,
        carbs: 38,
        fat: 3,
        servingSize: "1 cup (240g)",
        imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "skyr-yogurt",
        name: "Skyr Yogurt",
        calories: 110,
        protein: 19,
        carbs: 7,
        fat: 0.4,
        servingSize: "6 oz (170g)",
        imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "almond-milk",
        name: "Almond Milk",
        calories: 39,
        protein: 1.5,
        carbs: 3.5,
        fat: 2.5,
        servingSize: "1 cup (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1600718374662-0483d2b9da44?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "oat-milk",
        name: "Oat Milk",
        calories: 120,
        protein: 3,
        carbs: 16,
        fat: 5,
        servingSize: "1 cup (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1576186726115-4d51596775d1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
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
      },
      {
        id: "overnight-oats",
        name: "Overnight Oats",
        calories: 300,
        protein: 10,
        carbs: 50,
        fat: 7,
        servingSize: "1 cup (240g)",
        imageUrl: "https://images.unsplash.com/photo-1614961233913-a5113a4a34ed?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "muesli",
        name: "Muesli",
        calories: 289,
        protein: 8,
        carbs: 54,
        fat: 6,
        servingSize: "2/3 cup (65g)",
        imageUrl: "https://images.unsplash.com/photo-1456884590737-c4d142788909?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "bran-flakes",
        name: "Bran Flakes",
        calories: 130,
        protein: 4,
        carbs: 32,
        fat: 1,
        servingSize: "1 cup (40g)",
        imageUrl: "https://images.unsplash.com/photo-1557800636-894a64c1696f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "chia-pudding",
        name: "Chia Pudding",
        calories: 190,
        protein: 6,
        carbs: 18,
        fat: 12,
        servingSize: "1/2 cup (120g)",
        imageUrl: "https://images.unsplash.com/photo-1541621596592-7a1f4516cf19?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
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
      },
      {
        id: "english-muffin",
        name: "English Muffin",
        calories: 130,
        protein: 5,
        carbs: 25,
        fat: 1,
        servingSize: "1 muffin",
        imageUrl: "https://images.unsplash.com/photo-1587131782738-de30ea91a542?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "croissant",
        name: "Croissant",
        calories: 270,
        protein: 5,
        carbs: 31,
        fat: 14,
        servingSize: "1 medium (57g)",
        imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "peanut-butter-toast",
        name: "Peanut Butter Toast",
        calories: 190,
        protein: 8,
        carbs: 17,
        fat: 11,
        servingSize: "1 slice with 1 tbsp peanut butter",
        imageUrl: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "banana-bread",
        name: "Banana Bread",
        calories: 196,
        protein: 3,
        carbs: 33,
        fat: 6,
        servingSize: "1 slice (60g)",
        imageUrl: "https://images.unsplash.com/photo-1605286978633-2dec93ff88a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      }
    ]
  },
  {
    id: "breakfast-smoothies",
    name: "Smoothies & Drinks",
    mealType: "breakfast",
    items: [
      {
        id: "berry-smoothie",
        name: "Berry Smoothie",
        calories: 210,
        protein: 5,
        carbs: 42,
        fat: 3,
        servingSize: "1 cup (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1553530666-ba11a90bb0ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "green-smoothie",
        name: "Green Smoothie",
        calories: 180,
        protein: 4,
        carbs: 36,
        fat: 2,
        servingSize: "1 cup (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1556881286-fc6915169721?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "protein-smoothie",
        name: "Protein Smoothie",
        calories: 280,
        protein: 25,
        carbs: 30,
        fat: 5,
        servingSize: "1 cup (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "coffee",
        name: "Coffee (Black)",
        calories: 5,
        protein: 0.3,
        carbs: 0,
        fat: 0,
        servingSize: "1 cup (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1497515114629-f71d768fd07c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "latte",
        name: "Latte",
        calories: 120,
        protein: 8,
        carbs: 10,
        fat: 5,
        servingSize: "12 oz (355ml)",
        imageUrl: "https://images.unsplash.com/photo-1541167760496-1628856ab772?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "orange-juice",
        name: "Orange Juice",
        calories: 110,
        protein: 2,
        carbs: 26,
        fat: 0,
        servingSize: "1 cup (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
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
      },
      {
        id: "tuna-sandwich",
        name: "Tuna Sandwich",
        calories: 290,
        protein: 22,
        carbs: 30,
        fat: 10,
        servingSize: "1 sandwich",
        imageUrl: "https://images.unsplash.com/photo-1550507992-eb63ffee0847?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "blt-sandwich",
        name: "BLT Sandwich",
        calories: 350,
        protein: 15,
        carbs: 35,
        fat: 18,
        servingSize: "1 sandwich",
        imageUrl: "https://images.unsplash.com/photo-1619096252214-ef06c45683e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "falafel-wrap",
        name: "Falafel Wrap",
        calories: 380,
        protein: 12,
        carbs: 55,
        fat: 14,
        servingSize: "1 wrap",
        imageUrl: "https://images.unsplash.com/photo-1561651823-34feb02250e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "club-sandwich",
        name: "Club Sandwich",
        calories: 430,
        protein: 28,
        carbs: 38,
        fat: 20,
        servingSize: "1 sandwich",
        imageUrl: "https://images.unsplash.com/photo-1567234669003-dce7a7a88821?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
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
      },
      {
        id: "cobb-salad",
        name: "Cobb Salad",
        calories: 400,
        protein: 25,
        carbs: 12,
        fat: 28,
        servingSize: "1 bowl (300g)",
        imageUrl: "https://images.unsplash.com/photo-1551248429-40975aa4de74?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "quinoa-salad",
        name: "Quinoa Salad",
        calories: 280,
        protein: 10,
        carbs: 40,
        fat: 10,
        servingSize: "1 bowl (250g)",
        imageUrl: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "tuna-salad",
        name: "Tuna Salad",
        calories: 310,
        protein: 28,
        carbs: 8,
        fat: 19,
        servingSize: "1 bowl (250g)",
        imageUrl: "https://images.unsplash.com/photo-1604909052743-94e838986d24?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "caprese-salad",
        name: "Caprese Salad",
        calories: 260,
        protein: 12,
        carbs: 8,
        fat: 20,
        servingSize: "1 bowl (200g)",
        imageUrl: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
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
      },
      {
        id: "minestrone-soup",
        name: "Minestrone Soup",
        calories: 190,
        protein: 8,
        carbs: 28,
        fat: 6,
        servingSize: "1 bowl (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1605909388460-74ec8b204127?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "butternut-squash-soup",
        name: "Butternut Squash Soup",
        calories: 170,
        protein: 3,
        carbs: 30,
        fat: 5,
        servingSize: "1 bowl (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "miso-soup",
        name: "Miso Soup",
        calories: 80,
        protein: 6,
        carbs: 8,
        fat: 3,
        servingSize: "1 bowl (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1578020190125-f4f7c18bc9cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "french-onion-soup",
        name: "French Onion Soup",
        calories: 220,
        protein: 9,
        carbs: 22,
        fat: 11,
        servingSize: "1 bowl (240ml)",
        imageUrl: "https://images.unsplash.com/photo-1583112291495-1595e4f0f879?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
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
      },
      {
        id: "poke-bowl",
        name: "Poke Bowl",
        calories: 400,
        protein: 30,
        carbs: 40,
        fat: 12,
        servingSize: "1 bowl (350g)",
        imageUrl: "https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "burrito-bowl",
        name: "Burrito Bowl",
        calories: 550,
        protein: 25,
        carbs: 70,
        fat: 18,
        servingSize: "1 bowl (450g)",
        imageUrl: "https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "farro-bowl",
        name: "Farro Bowl",
        calories: 390,
        protein: 14,
        carbs: 60,
        fat: 10,
        servingSize: "1 bowl (350g)",
        imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "mediterranean-bowl",
        name: "Mediterranean Bowl",
        calories: 420,
        protein: 18,
        carbs: 50,
        fat: 16,
        servingSize: "1 bowl (400g)",
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      }
    ]
  },
  {
    id: "lunch-pasta",
    name: "Pasta & Noodles",
    mealType: "lunch",
    items: [
      {
        id: "pasta-primavera",
        name: "Pasta Primavera",
        calories: 380,
        protein: 12,
        carbs: 60,
        fat: 10,
        servingSize: "1 cup (240g)",
        imageUrl: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "spaghetti-marinara",
        name: "Spaghetti Marinara",
        calories: 350,
        protein: 10,
        carbs: 65,
        fat: 6,
        servingSize: "1 cup (240g)",
        imageUrl: "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "mac-and-cheese",
        name: "Mac and Cheese",
        calories: 420,
        protein: 16,
        carbs: 50,
        fat: 18,
        servingSize: "1 cup (240g)",
        imageUrl: "https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "pad-thai",
        name: "Pad Thai",
        calories: 450,
        protein: 18,
        carbs: 55,
        fat: 16,
        servingSize: "1 cup (240g)",
        imageUrl: "https://images.unsplash.com/photo-1559314809-0d155014e29e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "pesto-pasta",
        name: "Pesto Pasta",
        calories: 410,
        protein: 12,
        carbs: 55,
        fat: 16,
        servingSize: "1 cup (240g)",
        imageUrl: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "ramen",
        name: "Ramen",
        calories: 380,
        protein: 15,
        carbs: 60,
        fat: 8,
        servingSize: "1 bowl (350g)",
        imageUrl: "https://images.unsplash.com/photo-1557872943-16a5ac26437e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
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
      },
      {
        id: "pork-chop",
        name: "Pork Chop",
        calories: 230,
        protein: 25,
        carbs: 0,
        fat: 14,
        servingSize: "1 chop (100g)",
        imageUrl: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "shrimp",
        name: "Grilled Shrimp",
        calories: 120,
        protein: 24,
        carbs: 1,
        fat: 2,
        servingSize: "100g",
        imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "lamb-chops",
        name: "Lamb Chops",
        calories: 290,
        protein: 24,
        carbs: 0,
        fat: 21,
        servingSize: "2 chops (100g)",
        imageUrl: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "turkey-breast",
        name: "Roasted Turkey Breast",
        calories: 170,
        protein: 30,
        carbs: 0,
        fat: 5,
        servingSize: "100g",
        imageUrl: "https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
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
      },
      {
        id: "sweet-potato",
        name: "Baked Sweet Potato",
        calories: 180,
        protein: 4,
        carbs: 41,
        fat: 0.1,
        servingSize: "1 medium (150g)",
        imageUrl: "https://images.unsplash.com/photo-1596434300655-e48d3ff3dd5e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "steamed-broccoli",
        name: "Steamed Broccoli",
        calories: 55,
        protein: 4,
        carbs: 11,
        fat: 0.5,
        servingSize: "1 cup (156g)",
        imageUrl: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "garlic-bread",
        name: "Garlic Bread",
        calories: 180,
        protein: 4,
        carbs: 25,
        fat: 8,
        servingSize: "2 slices (50g)",
        imageUrl: "https://images.unsplash.com/photo-1573140401552-3fab0b24427f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "couscous",
        name: "Couscous",
        calories: 176,
        protein: 6,
        carbs: 36,
        fat: 0.3,
        servingSize: "1 cup cooked (157g)",
        imageUrl: "https://images.unsplash.com/photo-1515942400420-2b98fed1f515?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
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
      },
      {
        id: "fettuccine-alfredo",
        name: "Fettuccine Alfredo",
        calories: 450,
        protein: 15,
        carbs: 50,
        fat: 22,
        servingSize: "1 plate (300g)",
        imageUrl: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "lasagna",
        name: "Lasagna",
        calories: 420,
        protein: 22,
        carbs: 45,
        fat: 18,
        servingSize: "1 piece (250g)",
        imageUrl: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "penne-arrabbiata",
        name: "Penne Arrabbiata",
        calories: 350,
        protein: 12,
        carbs: 60,
        fat: 8,
        servingSize: "1 plate (300g)",
        imageUrl: "https://images.unsplash.com/photo-1598866594230-a7c12756260f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "soba-noodles",
        name: "Soba Noodles",
        calories: 310,
        protein: 14,
        carbs: 56,
        fat: 5,
        servingSize: "1 plate (300g)",
        imageUrl: "https://images.unsplash.com/photo-1518133683791-0b9de5a055f0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
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
      },
      {
        id: "paella",
        name: "Paella",
        calories: 400,
        protein: 22,
        carbs: 50,
        fat: 12,
        servingSize: "1 plate (300g)",
        imageUrl: "https://images.unsplash.com/photo-1515443961218-a51367888e4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "risotto",
        name: "Mushroom Risotto",
        calories: 380,
        protein: 10,
        carbs: 60,
        fat: 10,
        servingSize: "1 bowl (300g)",
        imageUrl: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "jambalaya",
        name: "Jambalaya",
        calories: 410,
        protein: 24,
        carbs: 45,
        fat: 14,
        servingSize: "1 bowl (300g)",
        imageUrl: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "shepherds-pie",
        name: "Shepherd's Pie",
        calories: 380,
        protein: 22,
        carbs: 40,
        fat: 15,
        servingSize: "1 piece (300g)",
        imageUrl: "https://images.unsplash.com/photo-1605908580297-f3e32c587062?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
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
      },
      {
        id: "cashews",
        name: "Cashews",
        calories: 160,
        protein: 5,
        carbs: 9,
        fat: 13,
        servingSize: "1 oz (28g)",
        imageUrl: "https://images.unsplash.com/photo-1583635718087-18e5b4377bd4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "pistachios",
        name: "Pistachios",
        calories: 160,
        protein: 6,
        carbs: 8,
        fat: 13,
        servingSize: "1 oz (28g)",
        imageUrl: "https://images.unsplash.com/photo-1525053875062-42313c4e0bb1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "pumpkin-seeds",
        name: "Pumpkin Seeds",
        calories: 151,
        protein: 7,
        carbs: 5,
        fat: 13,
        servingSize: "1 oz (28g)",
        imageUrl: "https://images.unsplash.com/photo-1508747555118-096e3c5a8f0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "chia-seeds",
        name: "Chia Seeds",
        calories: 138,
        protein: 4.7,
        carbs: 12,
        fat: 8.7,
        servingSize: "1 oz (28g)",
        imageUrl: "https://images.unsplash.com/photo-1541889413-3a84dc9c5b99?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
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
      },
      {
        id: "dried-apricots",
        name: "Dried Apricots",
        calories: 80,
        protein: 1,
        carbs: 20,
        fat: 0.1,
        servingSize: "1/4 cup (40g)",
        imageUrl: "https://images.unsplash.com/photo-1583635718087-18e5b4377bd4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "fruit-cup",
        name: "Mixed Fruit Cup",
        calories: 70,
        protein: 1,
        carbs: 18,
        fat: 0,
        servingSize: "1 cup (150g)",
        imageUrl: "https://images.unsplash.com/photo-1490474504059-bf2db5ab2348?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "peach",
        name: "Peach",
        calories: 58,
        protein: 1.4,
        carbs: 14,
        fat: 0.4,
        servingSize: "1 medium (150g)",
        imageUrl: "https://images.unsplash.com/photo-1595743825637-cdafc8ad4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "kiwi",
        name: "Kiwi",
        calories: 42,
        protein: 0.8,
        carbs: 10,
        fat: 0.4,
        servingSize: "1 medium (69g)",
        imageUrl: "https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
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
      },
      {
        id: "protein-cookie",
        name: "Protein Cookie",
        calories: 240,
        protein: 15,
        carbs: 30,
        fat: 8,
        servingSize: "1 cookie (60g)",
        imageUrl: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "nut-bar",
        name: "Nut Bar",
        calories: 190,
        protein: 6,
        carbs: 15,
        fat: 12,
        servingSize: "1 bar (40g)",
        imageUrl: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "protein-ball",
        name: "Protein Balls",
        calories: 150,
        protein: 10,
        carbs: 12,
        fat: 8,
        servingSize: "2 balls (40g)",
        imageUrl: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
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
      },
      {
        id: "yogurt-drink",
        name: "Yogurt Drink",
        calories: 110,
        protein: 8,
        carbs: 15,
        fat: 2.5,
        servingSize: "1 bottle (200ml)",
        imageUrl: "https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "cheese-cubes",
        name: "Cheese Cubes",
        calories: 110,
        protein: 7,
        carbs: 1,
        fat: 9,
        servingSize: "1 oz (28g)",
        imageUrl: "https://images.unsplash.com/photo-1589881133595-a3c085cb731d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "pudding-cup",
        name: "Pudding Cup",
        calories: 160,
        protein: 2,
        carbs: 30,
        fat: 3,
        servingSize: "1 cup (120g)",
        imageUrl: "https://images.unsplash.com/photo-1514995428455-447d4443fa7f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
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
      },
      {
        id: "celery-peanut-butter",
        name: "Celery with Peanut Butter",
        calories: 190,
        protein: 7,
        carbs: 8,
        fat: 16,
        servingSize: "3 stalks with 2 tbsp peanut butter",
        imageUrl: "https://images.unsplash.com/photo-1571050034347-2a6a4944a8bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "cucumber-tzatziki",
        name: "Cucumber with Tzatziki",
        calories: 120,
        protein: 4,
        carbs: 8,
        fat: 8,
        servingSize: "1 cup cucumber with 1/4 cup tzatziki",
        imageUrl: "https://images.unsplash.com/photo-1584742061792-483643527f1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "bell-peppers-dip",
        name: "Bell Peppers with Ranch",
        calories: 130,
        protein: 2,
        carbs: 10,
        fat: 10,
        servingSize: "1 cup peppers with 2 tbsp ranch",
        imageUrl: "https://images.unsplash.com/photo-1513442542250-854d436a73f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "kale-chips",
        name: "Kale Chips",
        calories: 110,
        protein: 3,
        carbs: 12,
        fat: 7,
        servingSize: "1 cup (30g)",
        imageUrl: "https://images.unsplash.com/photo-1527324688151-0e627063f2b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      }
    ]
  },
  {
    id: "snack-chips",
    name: "Chips & Crackers",
    mealType: "snack",
    items: [
      {
        id: "popcorn",
        name: "Air-popped Popcorn",
        calories: 120,
        protein: 4,
        carbs: 24,
        fat: 2,
        servingSize: "3 cups (24g)",
        imageUrl: "https://images.unsplash.com/photo-1578849278619-e73a158e76c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "rice-cakes",
        name: "Rice Cakes",
        calories: 70,
        protein: 1,
        carbs: 15,
        fat: 0.5,
        servingSize: "2 cakes (18g)",
        imageUrl: "https://images.unsplash.com/photo-1559561853-08451507cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "tortilla-chips-salsa",
        name: "Tortilla Chips with Salsa",
        calories: 180,
        protein: 3,
        carbs: 25,
        fat: 8,
        servingSize: "1 oz chips with 1/4 cup salsa",
        imageUrl: "https://images.unsplash.com/photo-1513262599279-d287e25f4d84?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "whole-grain-crackers",
        name: "Whole Grain Crackers",
        calories: 130,
        protein: 3,
        carbs: 22,
        fat: 4,
        servingSize: "7 crackers (30g)",
        imageUrl: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "veggie-chips",
        name: "Veggie Chips",
        calories: 140,
        protein: 2,
        carbs: 16,
        fat: 8,
        servingSize: "1 oz (28g)",
        imageUrl: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        id: "pretzels",
        name: "Pretzels",
        calories: 110,
        protein: 3,
        carbs: 23,
        fat: 1,
        servingSize: "1 oz (28g)",
        imageUrl: "https://images.unsplash.com/photo-1595856619767-ab739fa7daae?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
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