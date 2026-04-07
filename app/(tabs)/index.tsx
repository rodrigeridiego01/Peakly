import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { LinearGradient } from "expo-linear-gradient";
import { Image, View } from "react-native";

export default function HomeScreen() {
  return (
    <ThemedView style={{ flex: 1 }}>
      {/* Header com degradê */}
      <View style={{ backgroundColor: "white", overflow: "hidden" }}>
        {/* O Container do Gradient precisa ser maior para a rotação não mostrar o fundo */}
        <LinearGradient
          colors={["#6a11cb", "#2575fc"]}
          style={{
            height: 200, // Aumentamos a altura
            width: "120%", // Aumentamos a largura para a ponta não sumir ao girar
            marginLeft: "-10%", // Centraliza o excesso de largura
            marginTop: -75, // Sobe para esconder a quina superior
            transform: [{ rotate: "-3deg" }],
            justifyContent: "flex-end",
            paddingBottom: 30, // Espaço para o conteúdo não sumir na inclinação
          }}
        >
          {/* View "Desentortadora": compensa os -5deg com +5deg */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "75%", // Ajusta para não bater nas bordas da tela real
              alignSelf: "center",
              transform: [{ rotate: "3deg" }],
              marginBottom: 2,
            }}
          >
            <ThemedText
              type="title"
              style={{ color: "white", fontWeight: "bold", fontSize: 28 }}
            >
              Peakly
            </ThemedText>
            {/* Futuramente esse texto que aparece no header e que vai ser outro texto provavelmente, deve acompanhar a inclinação do header */}
            <Image
              source={require("@/assets/images/logoPeakly.png")}
              style={{ width: 60, height: 60 }}
              resizeMode="contain"
            />
          </View>
        </LinearGradient>

        <View style={{ height: 20 }} />
      </View>

      {/* Conteúdo da tela */}
      <ThemedView style={{ padding: 20 }}>
        <ThemedText>Descubra picos incríveis perto de você</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
