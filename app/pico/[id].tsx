import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    Alert,
    Dimensions,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

// ── 1. CONTRATOS DE DADOS (INTERFACES) ──
interface Avaliacao {
  id: string;
  usuario: string;
  nota: number;
  comentario: string;
  data: string;
  fotos: string[];
}

interface Pico {
  nome: string;
  autorOrigem: string;
  categoria: string;
  preco: string;
  distancia: number;
  imagemCapa: string;
  avaliacoes: Avaliacao[];
}

interface DadosForm {
  nota: number;
  comentario: string;
  fotos: string[];
}

// ── 2. COMPONENTE DE FORMULÁRIO INTEGRADO ──
function FormularioAvaliacao({
  onPublicar,
}: {
  onPublicar: (dados: DadosForm) => void;
}) {
  const [aberto, setAberto] = useState(false);
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState("");
  const [fotosTemp, setFotosTemp] = useState<string[]>([]);

  const anexarFoto = () => {
    // Simulando anexo de foto (Em prod: expo-image-picker)
    const fotoFake =
      "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=400";
    setFotosTemp([...fotosTemp, fotoFake]);
  };

  function publicar() {
    if (nota === 0) {
      Alert.alert("Atenção", "Selecione uma nota.");
      return;
    }
    if (!comentario.trim()) {
      Alert.alert("Atenção", "Escreva um comentário.");
      return;
    }
    onPublicar({ nota, comentario, fotos: fotosTemp });
    setAberto(false);
    setNota(0);
    setComentario("");
    setFotosTemp([]);
  }

  return (
    <View style={{ marginBottom: 25 }}>
      <TouchableOpacity
        style={styles.avaliarBtn}
        onPress={() => setAberto(!aberto)}
      >
        <Ionicons
          name={aberto ? "close-circle" : "add-circle"}
          size={20}
          color="#7c3aed"
        />
        <ThemedText style={styles.avaliarBtnText}>
          {aberto ? "Cancelar avaliação" : "Avaliar este local"}
        </ThemedText>
      </TouchableOpacity>

      {aberto && (
        <View style={styles.formPanel}>
          <ThemedText style={styles.formLabel}>Sua nota</ThemedText>
          <View style={{ flexDirection: "row", gap: 12, marginBottom: 20 }}>
            {[1, 2, 3, 4, 5].map((v) => (
              <TouchableOpacity key={v} onPress={() => setNota(v)}>
                <Ionicons
                  name="star"
                  size={32}
                  color={v <= nota ? "#f59e0b" : "#e5e7eb"}
                />
              </TouchableOpacity>
            ))}
          </View>

          <ThemedText style={styles.formLabel}>Fotos (Opcional)</ThemedText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 15 }}
          >
            <TouchableOpacity style={styles.addFotoBtn} onPress={anexarFoto}>
              <Ionicons name="camera" size={24} color="#7c3aed" />
              <ThemedText
                style={{ fontSize: 10, color: "#7c3aed", fontWeight: "800" }}
              >
                ANEXAR
              </ThemedText>
            </TouchableOpacity>
            {fotosTemp.map((f, i) => (
              <Image key={i} source={{ uri: f }} style={styles.miniatureTemp} />
            ))}
          </ScrollView>

          <TextInput
            style={styles.textarea}
            placeholder="Conte sua experiência..."
            multiline
            value={comentario}
            onChangeText={setComentario}
          />
          <TouchableOpacity style={styles.submitBtn} onPress={publicar}>
            <ThemedText style={{ color: "#fff", fontWeight: "bold" }}>
              Publicar Avaliação
            </ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// ── 3. TELA DE DETALHES ──
export default function PicoDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [dotAtivo, setDotAtivo] = useState(0);

  const [pico, setPico] = useState<Pico>({
    nome: id === "1" ? "Morro do Finder" : "Cachoeira do Salto",
    autorOrigem: "Marcos Silva",
    categoria: "Trilha",
    preco: "Acesso Gratuito",
    distancia: 4.5,
    imagemCapa:
      "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=800",
    avaliacoes: [
      {
        id: "1",
        usuario: "Marcos Silva",
        nota: 5,
        comentario: "Minha trilha favorita na região!",
        data: "12/04/2024",
        fotos: [],
      },
    ],
  });

  // Lógica de Galeria: Foto Oficial + Fotos dos usuários
  const galeriaUnificada = useMemo(() => {
    const fotos = [
      { uri: pico.imagemCapa, dono: pico.autorOrigem, tipo: "Autor" },
    ];
    pico.avaliacoes.forEach((av) => {
      av.fotos.forEach((f) => {
        fotos.push({
          uri: f,
          dono: av.usuario,
          tipo: av.usuario === pico.autorOrigem ? "Autor" : "Visitante",
        });
      });
    });
    return fotos;
  }, [pico]);

  // Estatísticas dinâmicas
  const stats = useMemo(() => {
    const total = pico.avaliacoes.length;
    const soma = pico.avaliacoes.reduce((acc, curr) => acc + curr.nota, 0);
    return {
      media: total > 0 ? (soma / total).toFixed(1) : "0.0",
      quantidade: total,
    };
  }, [pico]);

  const handlePublicar = (dados: DadosForm) => {
    const nova: Avaliacao = {
      id: Math.random().toString(),
      usuario: "Você",
      nota: dados.nota,
      comentario: dados.comentario,
      data: "Hoje",
      fotos: dados.fotos,
    };
    setPico((prev) => ({ ...prev, avaliacoes: [nova, ...prev.avaliacoes] }));
  };

  return (
    <ThemedView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* CARROSSEL */}
        <View style={styles.headerContainer}>
          <FlatList
            data={galeriaUnificada}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) =>
              setDotAtivo(Math.round(e.nativeEvent.contentOffset.x / width))
            }
            renderItem={({ item }) => (
              <View style={{ width, height: 350 }}>
                <Image source={{ uri: item.uri }} style={styles.imageHeader} />
                <View style={styles.badgeAutor}>
                  <Ionicons
                    name={item.tipo === "Autor" ? "ribbon" : "camera"}
                    size={14}
                    color="#fff"
                  />
                  <ThemedText style={styles.badgeText}>
                    {item.tipo === "Autor" ? `Autor: ${item.dono}` : item.dono}
                  </ThemedText>
                </View>
              </View>
            )}
          />
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <View style={styles.iconCircle}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        {/* CONTEÚDO */}
        <View style={styles.content}>
          <ThemedText style={styles.title}>{pico.nome}</ThemedText>

          <View style={styles.infoRow}>
            <View style={styles.categoryTag}>
              <ThemedText style={styles.categoryTagText}>
                {pico.categoria}
              </ThemedText>
            </View>
            <ThemedText style={styles.priceText}>{pico.preco}</ThemedText>
          </View>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={18} color="#f59e0b" />
            <ThemedText style={styles.ratingText}>{stats.media}</ThemedText>
            <ThemedText style={styles.ratingCount}>
              ({stats.quantidade} avaliações)
            </ThemedText>
            <View style={styles.dotSeparator} />
            <ThemedText style={styles.distanceText}>
              {pico.distancia} km de você
            </ThemedText>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.btnMain}>
              <Ionicons name="navigate" size={18} color="#fff" />
              <ThemedText style={styles.btnText}>Como chegar</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnSecondary}
              onPress={() => router.push("/(tabs)/explore")}
            >
              <Ionicons name="map-outline" size={18} color="#7c3aed" />
              <ThemedText style={styles.btnSecondaryText}>
                Ver no Mapa
              </ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <FormularioAvaliacao onPublicar={handlePublicar} />

          <ThemedText style={styles.sectionTitle}>Avaliações</ThemedText>
          {pico.avaliacoes.map((av) => (
            <View key={av.id} style={styles.reviewCard}>
              <ThemedText style={styles.reviewUser}>{av.usuario}</ThemedText>
              <View style={styles.reviewStars}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Ionicons
                    key={s}
                    name="star"
                    size={12}
                    color={s <= av.nota ? "#f59e0b" : "#e5e7eb"}
                  />
                ))}
                <ThemedText style={styles.reviewDate}> • {av.data}</ThemedText>
              </View>
              <ThemedText style={styles.reviewComment}>
                {av.comentario}
              </ThemedText>

              {av.fotos.length > 0 && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ marginTop: 12 }}
                >
                  {av.fotos.map((f, i) => (
                    <Image
                      key={i}
                      source={{ uri: f }}
                      style={styles.reviewMiniature}
                    />
                  ))}
                </ScrollView>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerContainer: { height: 350 },
  imageHeader: { width: "100%", height: "100%" },
  badgeAutor: {
    position: "absolute",
    bottom: 30,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 12,
    gap: 6,
  },
  badgeText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  backBtn: { position: "absolute", top: 50, left: 20 },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: 25,
    marginTop: -20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1a0a3c",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginBottom: 15,
  },
  categoryTag: {
    backgroundColor: "#7c3aed",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  categoryTagText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#fff",
    textTransform: "uppercase",
  },
  priceText: { fontSize: 14, color: "#666", fontWeight: "600" },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 25,
  },
  ratingText: { fontWeight: "800", fontSize: 16 },
  ratingCount: { color: "#999", fontSize: 14 },
  dotSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ddd",
    marginHorizontal: 5,
  },
  distanceText: { fontSize: 14, color: "#666" },
  actionRow: { flexDirection: "row", gap: 10, marginBottom: 30 },
  btnMain: {
    flex: 1.2,
    backgroundColor: "#7c3aed",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  btnSecondary: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#7c3aed",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  btnSecondaryText: { color: "#7c3aed", fontWeight: "700", fontSize: 14 },
  divider: { height: 1, backgroundColor: "#f0f0f0", marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: "800", marginBottom: 20 },
  avaliarBtn: {
    borderStyle: "dashed",
    borderWidth: 1.5,
    borderColor: "#c4b5fd",
    borderRadius: 15,
    padding: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginBottom: 25,
  },
  avaliarBtnText: { color: "#7c3aed", fontWeight: "700" },
  formPanel: {
    backgroundColor: "#f9f7ff",
    padding: 20,
    borderRadius: 20,
    marginBottom: 25,
  },
  formLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#7c6e8a",
    textTransform: "uppercase",
    marginBottom: 10,
  },
  addFotoBtn: {
    width: 70,
    height: 70,
    borderRadius: 12,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#7c3aed",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    backgroundColor: "#fff",
  },
  miniatureTemp: { width: 70, height: 70, borderRadius: 12, marginRight: 10 },
  textarea: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    height: 100,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 15,
  },
  submitBtn: {
    backgroundColor: "#4c1d95",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  reviewCard: {
    marginBottom: 25,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  reviewUser: { fontWeight: "800", fontSize: 15, color: "#1a0a3c" },
  reviewStars: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  reviewDate: { fontSize: 12, color: "#999" },
  reviewComment: { fontSize: 14, color: "#4b4060", lineHeight: 22 },
  reviewMiniature: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 10,
  },
});
