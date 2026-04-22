import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import {
    Alert,
    Animated,
    Dimensions,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

const { width, height } = Dimensions.get("window");

// ─── Types ────────────────────────────────────────────────────────────────────
interface Pin {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  category: "trilha" | "cachoeira" | "mirante" | "camping" | "outro";
  createdAt: Date;
}

const CATEGORY_CONFIG = {
  trilha: { emoji: "🥾", color: "#5c8a3c", label: "Trilha" },
  cachoeira: { emoji: "💧", color: "#2b7bba", label: "Cachoeira" },
  mirante: { emoji: "🏔️", color: "#7b5ea7", label: "Mirante" },
  camping: { emoji: "⛺", color: "#c0782a", label: "Camping" },
  outro: { emoji: "📍", color: "#cc4444", label: "Outro" },
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function ExploreScreen() {
  const mapRef = useRef<MapView>(null);
  const slideAnim = useRef(new Animated.Value(300)).current;

  const [pins, setPins] = useState<Pin[]>([]);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [addingPin, setAddingPin] = useState(false);
  const [pendingCoord, setPendingCoord] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [mapType, setMapType] = useState<"satellite" | "hybrid" | "standard">(
    "hybrid",
  );
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "trilha" as Pin["category"],
  });

  // ─── Request location on mount ──────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
      }
    })();
  }, []);

  // ─── Slide panel animation ───────────────────────────────────────────────────
  const showPanel = () => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 80,
      friction: 10,
    }).start();
  };

  const hidePanel = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setDetailVisible(false));
  };

  // ─── Map long press → start adding pin ──────────────────────────────────────
  const handleMapLongPress = (e: any) => {
    if (!addingPin) return;
    const coord = e.nativeEvent.coordinate;
    setPendingCoord(coord);
    setForm({ title: "", description: "", category: "trilha" });
    setModalVisible(true);
  };

  // ─── Save new pin ────────────────────────────────────────────────────────────
  const handleSavePin = () => {
    if (!form.title.trim() || !pendingCoord) {
      Alert.alert("Atenção", "Dê um nome ao ponto antes de salvar.");
      return;
    }
    const newPin: Pin = {
      id: Date.now().toString(),
      latitude: pendingCoord.latitude,
      longitude: pendingCoord.longitude,
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      createdAt: new Date(),
    };
    setPins((prev) => [...prev, newPin]);
    setModalVisible(false);
    setAddingPin(false);
    setPendingCoord(null);
  };

  // ─── Select existing pin ─────────────────────────────────────────────────────
  const handlePinPress = (pin: Pin) => {
    setSelectedPin(pin);
    setDetailVisible(true);
    slideAnim.setValue(300);
    showPanel();
  };

  // ─── Delete pin ──────────────────────────────────────────────────────────────
  const handleDeletePin = (id: string) => {
    Alert.alert("Remover ponto?", "Esta ação não pode ser desfeita.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: () => {
          setPins((prev) => prev.filter((p) => p.id !== id));
          hidePanel();
        },
      },
    ]);
  };

  // ─── Center on user ──────────────────────────────────────────────────────────
  const handleCenterUser = () => {
    if (!userLocation) return;
    mapRef.current?.animateToRegion(
      {
        ...userLocation,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      600,
    );
  };

  const initialRegion = userLocation
    ? { ...userLocation, latitudeDelta: 0.05, longitudeDelta: 0.05 }
    : {
        latitude: -27.5,
        longitude: -52.5,
        latitudeDelta: 3,
        longitudeDelta: 3,
      };

  return (
    <View style={styles.container}>
      {/* ── MAP ── */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        mapType={mapType}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton={false}
        onLongPress={handleMapLongPress}
      >
        {pins.map((pin) => {
          const cfg = CATEGORY_CONFIG[pin.category];
          return (
            <Marker
              key={pin.id}
              coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
              onPress={() => handlePinPress(pin)}
            >
              <View
                style={[styles.markerBubble, { backgroundColor: cfg.color }]}
              >
                <Text style={styles.markerEmoji}>{cfg.emoji}</Text>
              </View>
            </Marker>
          );
        })}
      </MapView>

      {/* ── TOP BAR ── */}
      <View style={styles.topBar}>
        <View style={styles.topBarInner}>
          <Text style={styles.topBarTitle}>🌍 Explorar</Text>
          <Text style={styles.pinCount}>
            {pins.length} ponto{pins.length !== 1 ? "s" : ""}
          </Text>
        </View>
      </View>

      {/* ── MAP TYPE TOGGLE ── */}
      <View style={styles.mapTypeRow}>
        {(["hybrid", "satellite", "standard"] as const).map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.mapTypeBtn,
              mapType === type && styles.mapTypeBtnActive,
            ]}
            onPress={() => setMapType(type)}
          >
            <Text
              style={[
                styles.mapTypeTxt,
                mapType === type && styles.mapTypeTxtActive,
              ]}
            >
              {type === "hybrid"
                ? "Híbrido"
                : type === "satellite"
                  ? "Satélite"
                  : "Mapa"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── RIGHT FAB CLUSTER ── */}
      <View style={styles.fabCluster}>
        {/* Center on user */}
        <TouchableOpacity style={styles.fabSmall} onPress={handleCenterUser}>
          <Text style={styles.fabIcon}>📍</Text>
        </TouchableOpacity>

        {/* Add pin toggle */}
        <TouchableOpacity
          style={[styles.fabAdd, addingPin && styles.fabAddActive]}
          onPress={() => setAddingPin((v) => !v)}
        >
          <Text style={styles.fabAddIcon}>{addingPin ? "✕" : "+"}</Text>
        </TouchableOpacity>
      </View>

      {/* ── ADDING HINT ── */}
      {addingPin && (
        <View style={styles.hint}>
          <Text style={styles.hintText}>
            Pressione e segure no mapa para adicionar um ponto
          </Text>
        </View>
      )}

      {/* ── ADD PIN MODAL ── */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Novo Ponto</Text>

            <Text style={styles.label}>Nome *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Mirante do Vale"
              placeholderTextColor="#8892a4"
              value={form.title}
              onChangeText={(t) => setForm((f) => ({ ...f, title: t }))}
            />

            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={[styles.input, styles.inputMulti]}
              placeholder="Observações, dificuldade, acesso..."
              placeholderTextColor="#8892a4"
              value={form.description}
              onChangeText={(t) => setForm((f) => ({ ...f, description: t }))}
              multiline
              numberOfLines={3}
            />

            <Text style={styles.label}>Categoria</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.catRow}
            >
              {(Object.keys(CATEGORY_CONFIG) as Pin["category"][]).map(
                (cat) => {
                  const cfg = CATEGORY_CONFIG[cat];
                  const active = form.category === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.catChip,
                        active && { backgroundColor: cfg.color },
                      ]}
                      onPress={() => setForm((f) => ({ ...f, category: cat }))}
                    >
                      <Text style={styles.catEmoji}>{cfg.emoji}</Text>
                      <Text
                        style={[
                          styles.catLabel,
                          active && styles.catLabelActive,
                        ]}
                      >
                        {cfg.label}
                      </Text>
                    </TouchableOpacity>
                  );
                },
              )}
            </ScrollView>

            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  setModalVisible(false);
                  setAddingPin(false);
                }}
              >
                <Text style={styles.cancelTxt}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSavePin}>
                <Text style={styles.saveTxt}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── PIN DETAIL SLIDE PANEL ── */}
      {detailVisible && selectedPin && (
        <Animated.View
          style={[
            styles.detailPanel,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.detailHandle} />
          <View style={styles.detailHeader}>
            <Text style={styles.detailEmoji}>
              {CATEGORY_CONFIG[selectedPin.category].emoji}
            </Text>
            <View style={styles.detailTitles}>
              <Text style={styles.detailTitle}>{selectedPin.title}</Text>
              <View
                style={[
                  styles.detailBadge,
                  {
                    backgroundColor:
                      CATEGORY_CONFIG[selectedPin.category].color,
                  },
                ]}
              >
                <Text style={styles.detailBadgeTxt}>
                  {CATEGORY_CONFIG[selectedPin.category].label}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={hidePanel}>
              <Text style={styles.closeTxt}>✕</Text>
            </TouchableOpacity>
          </View>

          {selectedPin.description ? (
            <Text style={styles.detailDesc}>{selectedPin.description}</Text>
          ) : (
            <Text style={styles.detailDescEmpty}>Sem descrição</Text>
          )}

          <Text style={styles.detailCoord}>
            {selectedPin.latitude.toFixed(5)},{" "}
            {selectedPin.longitude.toFixed(5)}
          </Text>

          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => handleDeletePin(selectedPin.id)}
          >
            <Text style={styles.deleteTxt}>🗑️ Remover ponto</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d1117" },
  map: { flex: 1 },

  // Top bar
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: Platform.OS === "ios" ? 54 : 36,
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: "rgba(13,17,23,0.85)",
  },
  topBarInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topBarTitle: {
    color: "#e6edf3",
    fontSize: 18,
    fontWeight: "700",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  pinCount: { color: "#7d8590", fontSize: 13 },

  // Map type
  mapTypeRow: {
    position: "absolute",
    top: Platform.OS === "ios" ? 100 : 80,
    left: 16,
    flexDirection: "row",
    gap: 6,
  },
  mapTypeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "rgba(13,17,23,0.80)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  mapTypeBtnActive: { backgroundColor: "#1f6feb", borderColor: "#388bfd" },
  mapTypeTxt: { color: "#7d8590", fontSize: 12, fontWeight: "600" },
  mapTypeTxtActive: { color: "#e6edf3" },

  // FAB cluster
  fabCluster: {
    position: "absolute",
    right: 16,
    bottom: 120,
    alignItems: "center",
    gap: 10,
  },
  fabSmall: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(13,17,23,0.88)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  fabIcon: { fontSize: 18 },
  fabAdd: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#238636",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2ea043",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  fabAddActive: { backgroundColor: "#b62324" },
  fabAddIcon: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "300",
    lineHeight: 30,
  },

  // Hint
  hint: {
    position: "absolute",
    bottom: 110,
    left: 20,
    right: 70,
    backgroundColor: "rgba(13,17,23,0.88)",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#388bfd",
  },
  hintText: { color: "#58a6ff", fontSize: 13, textAlign: "center" },

  // Marker
  markerBubble: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  markerEmoji: { fontSize: 18 },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#161b22",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 36,
  },
  modalTitle: {
    color: "#e6edf3",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  label: {
    color: "#7d8590",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 14,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  input: {
    backgroundColor: "#0d1117",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#30363d",
    color: "#e6edf3",
    fontSize: 15,
    padding: 12,
  },
  inputMulti: { height: 80, textAlignVertical: "top" },
  catRow: { marginTop: 4, flexDirection: "row" },
  catChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "#21262d",
    borderWidth: 1,
    borderColor: "#30363d",
  },
  catEmoji: { fontSize: 16, marginRight: 4 },
  catLabel: { color: "#7d8590", fontSize: 13, fontWeight: "600" },
  catLabelActive: { color: "#fff" },
  modalBtns: { flexDirection: "row", gap: 12, marginTop: 24 },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#21262d",
    borderWidth: 1,
    borderColor: "#30363d",
    alignItems: "center",
  },
  cancelTxt: { color: "#7d8590", fontWeight: "600" },
  saveBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#238636",
    alignItems: "center",
  },
  saveTxt: { color: "#fff", fontWeight: "700", fontSize: 15 },

  // Detail panel
  detailPanel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#161b22",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 16,
  },
  detailHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#30363d",
    alignSelf: "center",
    marginBottom: 16,
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  detailEmoji: { fontSize: 30, marginRight: 12, marginTop: 2 },
  detailTitles: { flex: 1 },
  detailTitle: {
    color: "#e6edf3",
    fontSize: 18,
    fontWeight: "700",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  detailBadge: {
    alignSelf: "flex-start",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 6,
  },
  detailBadgeTxt: { color: "#fff", fontSize: 11, fontWeight: "700" },
  closeBtn: { padding: 4 },
  closeTxt: { color: "#7d8590", fontSize: 18 },
  detailDesc: {
    color: "#8b949e",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  detailDescEmpty: {
    color: "#3d444d",
    fontSize: 14,
    fontStyle: "italic",
    marginBottom: 10,
  },
  detailCoord: {
    color: "#3d444d",
    fontSize: 11,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    marginBottom: 20,
  },
  deleteBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "rgba(182,35,36,0.15)",
    borderWidth: 1,
    borderColor: "rgba(182,35,36,0.4)",
    alignItems: "center",
  },
  deleteTxt: { color: "#f85149", fontWeight: "600", fontSize: 14 },
});
