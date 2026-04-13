import { Ionicons } from "@expo/vector-icons"; // Importação dos ícones
import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
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
  // Estados para controle do Slider de Distância
  const [sliderOpen, setSliderOpen] = useState(false);
  const [distancia, setDistancia] = useState(20);

  const filtros = [
    "Rio",
    "Cachoeira",
    "Montanha",
    "Trilha",
    "Pôr do Sol",
    "Morro",
  ];

  // Dados dos Picos
  const picos = [
    {
      id: "1",
      nome: "Morro do Finder",
      categoria: "Trilhaa",
      distancia: 4.5,
      descricao: "Vista panorâmica incrível da cidade.",
      estrelas: 5,
      gratuito: true,
      imagem:
        "https://lh3.googleusercontent.com/gps-cs-s/APNQkAFwaNtUVfB3sP4awvbM8b60VxWiuZXRe3zD4zNLpPx4A7_3FkVYu20zkNs1jnU7-TBPnQGDjXkJ2h7p4WqMlqKC9G_NqLq8lYiypWxF1KBwTMDXZ2KHOMsILSt_JvjLFPHsh9uTcg=s1360-w1360-h1020-rw",
    },
    {
      id: "2",
      nome: "Cachoeira do Salto",
      categoria: "Cachoeira",
      distancia: 12.8,
      descricao: "Queda d'água refrescante para banho.",
      estrelas: 4,
      gratuito: false,
      imagem:
        "https://lh3.googleusercontent.com/gps-cs-s/APNQkAHXqnsyxOus6Gj2gFICP6AGmCMBNB36YaUBC-mp5MXw5ADIwZNKzXiLnCiwzsjurkddTalY1EkmdhvGgVqPQ34o8XoK0PeE2sc77sjxnCEaU5OH_BicStqNv8P8yX8asVhUMqQS15Qb3Ug=s1360-w1360-h1020-rw",
    },
    {
      id: "3",
      nome: "Mirante das Estrelas",
      categoria: "Céu estrelado",
      distancia: 8.2,
      descricao: "Perfeito para observação astronômica.",
      estrelas: 5,
      gratuito: true,
      imagem:
        "https://imagens.fotografia-dg.com/imagens-wp/2015/11/Pedra-do-Ba%c3%ba.jpg",
    },
  ];

  const [favoritos, setFavoritos] = useState<string[]>([]);

  const toggleFavorito = (id: string) => {
    setFavoritos((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id],
    );
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      {/* --- HEADER PRINCIPAL --- */}
      <View>
        <LinearGradient
          colors={["#1a0a3c", "#2e1065", "#4c1d95"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <View>
              <ThemedText style={styles.greeting}>
                Bem-vindo de volta
              </ThemedText>
              <View style={styles.brand}>
                <ThemedText style={styles.brandName}>
                  Peak<ThemedText style={styles.brandAccent}>ly</ThemedText>
                </ThemedText>
                <Image
                  source={require("@/assets/images/logoPeakly.png")}
                  style={styles.brandIcon}
                  resizeMode="contain"
                />
              </View>
            </View>

            {/* Botão de Distância com Novo Ícone */}
            <TouchableOpacity
              style={styles.distBtn}
              activeOpacity={0.75}
              onPress={() => setSliderOpen((prev) => !prev)}
            >
              <Ionicons
                name="options-outline"
                size={18}
                color="rgba(255,255,255,0.9)"
              />
              <ThemedText style={styles.distLabel}>{distancia} km</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Barra de Busca Fictícia */}
          <View style={styles.searchBar}>
            <ThemedText style={styles.searchPlaceholder}>
              Buscar trilhas, cachoeiras...
            </ThemedText>
          </View>
        </LinearGradient>

        {/* Painel do Slider que abre ao clicar no botão */}
        {sliderOpen && (
          <View style={styles.sliderPanel}>
            <View style={styles.sliderHeader}>
              <ThemedText style={styles.sliderTitle}>
                Distância máxima
              </ThemedText>
              <View style={styles.sliderBadge}>
                <ThemedText style={styles.sliderBadgeText}>
                  {distancia} km
                </ThemedText>
              </View>
            </View>
            <Slider
              style={{ width: "100%", height: 36 }}
              minimumValue={1}
              maximumValue={100}
              step={1}
              value={distancia}
              onValueChange={(val) => setDistancia(val)}
              minimumTrackTintColor="#7c3aed"
              maximumTrackTintColor="#e5e7eb"
              thumbTintColor="#7c3aed"
            />
            <View style={styles.rangeLabels}>
              <ThemedText style={styles.rangeLbl}>1 km</ThemedText>
              <ThemedText style={styles.rangeLbl}>100 km</ThemedText>
            </View>
          </View>
        )}
      </View>

      {/* --- FILTROS RÁPIDOS --- */}
      <View style={styles.filtersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScrollContent}
        >
          {filtros.map((filtro, index) => (
            <TouchableOpacity key={index} style={styles.filterBadge}>
              <ThemedText style={styles.filterText}>{filtro}</ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* --- LISTA DE PICOS --- */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.mainContent}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Picos recomendados
          </ThemedText>

          {picos.map((pico) => (
            <TouchableOpacity
              key={pico.id}
              style={styles.card}
              activeOpacity={0.95}
            >
              {/* Imagem com o botão de favorito flutuante */}
              <View>
                <Image source={{ uri: pico.imagem }} style={styles.cardImage} />
                <TouchableOpacity
                  style={styles.favButton}
                  onPress={() => toggleFavorito(pico.id)}
                >
                  <Ionicons
                    name={
                      favoritos.includes(pico.id) ? "heart" : "heart-outline"
                    }
                    size={22}
                    color={favoritos.includes(pico.id) ? "#FF4B4B" : "#FFF"}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.cardContent}>
                {/* Categoria e Avaliação */}
                <View style={styles.cardTopRow}>
                  <ThemedText style={styles.cardCategory}>
                    {pico.categoria}
                  </ThemedText>
                  <View style={styles.ratingBox}>
                    <Ionicons name="star" size={14} color="#FFD700" />
                    <ThemedText style={styles.ratingText}>
                      {pico.estrelas}
                    </ThemedText>
                    <ThemedText style={styles.reviewText}>(124)</ThemedText>
                  </View>
                </View>

                <ThemedText style={styles.cardTitle}>{pico.nome}</ThemedText>

                {/* Rodapé do Card: Distância e Preço */}
                <View style={styles.cardFooter}>
                  <View style={styles.locBox}>
                    <Ionicons
                      name="location-outline"
                      size={14}
                      color="#6a11cb"
                    />
                    <ThemedText style={styles.locText}>
                      {pico.distancia} km de você
                    </ThemedText>
                  </View>
                  <ThemedText
                    style={[
                      styles.priceText,
                      { color: pico.gratuito ? "#28a745" : "#333" },
                    ]}
                  >
                    {pico.gratuito ? "Grátis" : "Entrada paga"}
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
  // ESTILOS DO HEADER
  header: {
    paddingTop: 56,
    paddingHorizontal: 24,
    paddingBottom: 25,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  greeting: {
    fontSize: 12,
    color: "rgba(196,181,253,0.8)",
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  brandName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: -0.5,
  },
  brandAccent: {
    color: "#a78bfa",
    fontSize: 28,
    fontWeight: "700",
  },
  brandIcon: {
    width: 32,
    height: 32,
  },
  distBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  distLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
  },
  searchBar: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchPlaceholder: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 14,
  },

  // ESTILOS DO PAINEL SLIDER
  sliderPanel: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 18,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  sliderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sliderTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1a0a3c",
  },
  sliderBadge: {
    backgroundColor: "#ede9fe",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 20,
  },
  sliderBadgeText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#5b21b6",
  },
  rangeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
  },
  rangeLbl: {
    fontSize: 11,
    color: "#7c6e8a",
  },

  // FILTROS
  filtersContainer: {
    height: 50,
    marginTop: 15,
  },
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
  },
  filterText: {
    color: "white",
    fontWeight: "600",
    fontSize: 13,
  },

  // CARDS HORIZONTAIS
  mainContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 15,
    color: "#333",
  },
  horizontalCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 15,
    padding: 10,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  /* cardImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: "#eee",
  }, */

  cardImage: {
    width: "100%",
    height: 180,
  },
  cardInfo: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: "space-between",
    height: 90,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#222",
    marginBottom: 12,
  },
  cardMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  categoryBadge: {
    backgroundColor: "#f0e6ff",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryText: {
    color: "#6a11cb",
    fontWeight: "bold",
    fontSize: 10,
    textTransform: "uppercase",
  },
  cardDistance: {
    color: "#888",
    fontSize: 12,
  },
  cardPrice: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#2ecc71",
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 4, // Sombra no Android
    shadowColor: "#000", // Sombra no iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  favButton: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "rgba(0,0,0,0.3)", // Fundo escuro transparente para o ícone aparecer em qualquer foto
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    padding: 16,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardCategory: {
    fontSize: 10,
    fontWeight: "800",
    color: "#6a11cb",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  ratingBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#333",
  },
  reviewText: {
    fontSize: 12,
    color: "#999",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 12,
  },
  locBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  priceText: {
    fontSize: 13,
    fontWeight: "800",
  },
});
