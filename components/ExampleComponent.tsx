import React from "react";
import { View, Text, Pressable, FlatList } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useGlobalStyles } from "@/hooks/use-styles";

// Example component showing how to use the centralized styles system
export default function ExampleComponent() {
  const styles = useGlobalStyles();

  const sampleData = [
    { id: "1", title: "Item 1", description: "Description for item 1" },
    { id: "2", title: "Item 2", description: "Description for item 2" },
    { id: "3", title: "Item 3", description: "Description for item 3" },
  ];

  return (
    <ThemedView style={styles.container}>
      <Text style={styles.title}>Example Component</Text>
      <Text style={styles.subtitle}>Using centralized styles like CSS</Text>
      
      <View style={styles.gap}>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Primary Button</Text>
        </Pressable>
        
        <Pressable style={styles.buttonSecondary}>
          <Text style={styles.buttonSecondaryText}>Secondary Button</Text>
        </Pressable>
      </View>

      <View style={styles.margin}>
        <Text style={styles.body}>Sample List:</Text>
        <FlatList
          data={sampleData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={styles.body}>{item.title}</Text>
              <Text style={styles.caption}>{item.description}</Text>
            </View>
          )}
        />
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.statsNumber}>42</Text>
        <Text style={styles.statsLabel}>Total Items</Text>
      </View>
    </ThemedView>
  );
}
