import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Image, 
  Modal,
  ScrollView
} from "react-native";
import { Search, X, ChevronDown } from "lucide-react-native";
import { TextInput } from "react-native";
import { FoodCategory, FoodItem } from "@/types";
import { colors } from "@/constants/colors";
import { Picker } from "@react-native-picker/picker";

interface FoodCategorySelectorProps {
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  categories: FoodCategory[];
  onSelectFood: (food: FoodItem) => void;
}

export default function FoodCategorySelector({ 
  mealType, 
  categories, 
  onSelectFood 
}: FoodCategorySelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter categories by meal type
  const filteredCategories = categories.filter(
    category => category.mealType === mealType
  );
  
  // Filter food items by search query
  const getFilteredItems = () => {
    if (!searchQuery.trim()) {
      return selectedCategory?.items || [];
    }
    
    const query = searchQuery.toLowerCase();
    return selectedCategory?.items.filter(
      item => item.name.toLowerCase().includes(query)
    ) || [];
  };
  
  const handleSelectCategory = (categoryId: string) => {
    const category = filteredCategories.find(cat => cat.id === categoryId);
    if (category) {
      setSelectedCategory(category);
      setModalVisible(true);
    }
  };
  
  const handleSelectFood = (food: FoodItem) => {
    onSelectFood(food);
    setModalVisible(false);
    setSearchQuery("");
  };
  
  const closeModal = () => {
    setModalVisible(false);
    setSearchQuery("");
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Food Categories</Text>
      <Text style={styles.subtitle}>Select a category to browse foods or enter macros manually below</Text>
      
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedCategory?.id || ""}
          onValueChange={(itemValue) => {
            if (itemValue) handleSelectCategory(itemValue);
          }}
          style={styles.picker}
        >
          <Picker.Item label="Select a food category..." value="" />
          {filteredCategories.map((category) => (
            <Picker.Item 
              key={category.id} 
              label={`${category.name} (${category.items.length} items)`} 
              value={category.id} 
            />
          ))}
        </Picker>
        <ChevronDown size={20} color={colors.textSecondary} style={styles.pickerIcon} />
      </View>
      
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedCategory?.name}</Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.searchContainer}>
              <Search size={20} color={colors.textSecondary} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search foods..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={colors.textSecondary}
              />
            </View>
            
            <ScrollView style={styles.foodList}>
              {getFilteredItems().map((food) => (
                <TouchableOpacity
                  key={food.id}
                  style={styles.foodItem}
                  onPress={() => handleSelectFood(food)}
                >
                  {food.imageUrl && (
                    <Image source={{ uri: food.imageUrl }} style={styles.foodImage} />
                  )}
                  <View style={styles.foodInfo}>
                    <Text style={styles.foodName}>{food.name}</Text>
                    <Text style={styles.servingSize}>{food.servingSize}</Text>
                    <View style={styles.macroInfo}>
                      <Text style={styles.calories}>{food.calories} kcal</Text>
                      <Text style={styles.macros}>
                        P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  pickerIcon: {
    position: "absolute",
    right: 12,
    top: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 30,
    height: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  foodList: {
    flex: 1,
  },
  foodItem: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  foodImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
  },
  foodInfo: {
    flex: 1,
    justifyContent: "center",
  },
  foodName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  servingSize: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  macroInfo: {
    flexDirection: "column",
  },
  calories: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.primary,
    marginBottom: 2,
  },
  macros: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});