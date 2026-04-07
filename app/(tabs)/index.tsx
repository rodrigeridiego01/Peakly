import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function HomeScreen() {
  const filtros = [
    "Rio",
    "Cachoeira",
    "Montanha",
    "Trilha",
    "Pôr do Sol",
    "Morro",
  ];

  // LISTA DE PICOS (DADOS FAKES)
  const picos = [
    {
      id: "1",
      nome: "Morro do Finder",
      categoria: "Trilha",
      distancia: 4.5,
      descricao: "Uma vista panorâmica incrível da cidade com trilhas leves.",
      estrelas: 5,
      gratuito: true,
      imagem:
        "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "2",
      nome: "Cachoeira do Salto",
      categoria: "Cachoeira",
      distancia: 12.8,
      descricao: "Queda d'água refrescante com área para piquenique.",
      estrelas: 4,
      gratuito: false,
      imagem:
        "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=400&q=80",
    },
  ];

  return (
    <ThemedView style={{ flex: 1 }}>
      {/* 1. HEADER INCLINADO */}
      <View style={{ backgroundColor: "white", overflow: "hidden" }}>
        <LinearGradient
          colors={["#6a11cb", "#2575fc"]}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <ThemedText type="title" style={styles.headerTitle}>
              Peakly
            </ThemedText>
            <Image
              source={require("@/assets/images/logoPeakly.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </LinearGradient>
        <View style={{ height: 10 }} />
      </View>

      {/* 2. FILTROS RÁPIDOS */}
      <View style={styles.filtersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScrollContent}
        >
          {filtros.map((filtro, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.7}
              style={styles.filterBadge}
            >
              <ThemedText style={styles.filterText}>{filtro}</ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 3. LISTA DE PICOS */}
      <ScrollView style={{ flex: 1 }}>
        <ThemedView style={styles.mainContent}>
          <ThemedText
            type="defaultSemiBold"
            style={{ fontSize: 18, marginBottom: 15 }}
          >
            Descubra picos incríveis perto de você
          </ThemedText>

          {picos.map((pico) => (
            <TouchableOpacity
              key={pico.id}
              style={styles.card}
              activeOpacity={0.9}
            >
              {/* Imagem do Lugar */}
              <Image source={{ uri: pico.imagem }} style={styles.cardImage} />

              <View style={styles.cardInfo}>
                {/* Nome + Coração */}
                <View style={styles.cardRow}>
                  <ThemedText type="subtitle" style={styles.cardTitle}>
                    {pico.nome}
                  </ThemedText>
                  <TouchableOpacity hitSlop={10}>
                    <ThemedText style={{ fontSize: 20 }}>❤️</ThemedText>
                  </TouchableOpacity>
                </View>

                {/* Categoria + Distância */}
                <View style={[styles.cardRow, { marginTop: 4 }]}>
                  <View style={styles.tagContainer}>
                    <ThemedText style={styles.cardTag}>
                      {pico.categoria}
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.cardDistance}>
                    📍 {pico.distancia} km
                  </ThemedText>
                </View>

                {/* Estrelas + Preço */}
                <View style={[styles.cardRow, { marginTop: 12 }]}>
                  <ThemedText style={{ fontSize: 14 }}>
                    {"⭐".repeat(pico.estrelas)}
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.cardPrice,
                      { color: pico.gratuito ? "#2ecc71" : "#888" },
                    ]}
                  >
                    {pico.gratuito ? "Grátis" : "$$ • Entrada paga"}
                  </ThemedText>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerGradient: {
    height: 200,
    width: "120%",
    marginLeft: "-10%",
    marginTop: -75,
    transform: [{ rotate: "-3deg" }],
    justifyContent: "flex-end",
    paddingBottom: 30,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "75%",
    alignSelf: "center",
    transform: [{ rotate: "3deg" }],
    marginBottom: 5,
  },
  headerTitle: { color: "white", fontWeight: "bold", fontSize: 28 },
  logo: { width: 60, height: 60 },
  filtersContainer: { height: 50, marginTop: 10, marginBottom: 5 },
  filtersScrollContent: {
    paddingHorizontal: 20,
    alignItems: "center",
    gap: 10,
  },
  filterBadge: {
    backgroundColor: "#7831c4",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  filterText: { color: "white", fontWeight: "600", fontSize: 14 },
  mainContent: { padding: 20 },

  // ESTILOS DO CARD
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 20,
    overflow: "hidden", // Importante para a imagem respeitar o border do card
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  cardImage: {
    width: "100%",
    height: 150, // Altura da foto
    backgroundColor: "#ddd",
  },
  cardInfo: {
    padding: 15,
  },
  tagContainer: {
    backgroundColor: "#f0e6ff", // Roxo bem clarinho de fundo para a tag
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  cardTag: {
    color: "#6a11cb",
    fontWeight: "bold",
    fontSize: 11,
    textTransform: "uppercase",
  },
});
