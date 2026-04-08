import React, { useState } from "react";
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const PHOTO_SIZE = (width - 4) / 3;

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface Photo {
  id: string;
  uri: ImageSourcePropType; // ✅ aceita require() e { uri: string }
  location: string;
  likes: number;
  comments: Comment[];
  liked: boolean;
}

interface Comment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  time: string;
}

// ─── Dados de exemplo ─────────────────────────────────────────────────────────
const MOCK_PHOTOS: Photo[] = [
  {
    id: "1",
    uri: require("../../assets/images/soneca.jpeg"),
    location: "Nome do Lugar",
    likes: 2424,
    liked: false,
    comments: [],
  },
  {
    id: "2",
    uri: require("../../assets/images/gorizes.jpeg"),
    location: "Nome do Lugar",
    likes: 999,
    liked: true,
    comments: [],
  },
  {
    id: "3",
    uri: require("../../assets/images/mlks-lisos.jpeg"),
    location: "Nome do Lugar",
    likes: 123456789,
    liked: true,
    comments: [],
  },
  {
    id: "1",
    uri: require("../../assets/images/banheiro-do-gabi.jpeg"),
    location: "Nome do Lugar",
    likes: 666,
    liked: true,
    comments: [],
  },
];

// ─── Componente de estatística ────────────────────────────────────────────────
const StatBox = ({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) => (
  <View style={styles.statBox}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// ─── Modal de comentários ─────────────────────────────────────────────────────
const CommentsModal = ({
  visible,
  photo,
  onClose,
  onAddComment,
}: {
  visible: boolean;
  photo: Photo | null;
  onClose: () => void;
  onAddComment: (photoId: string, text: string) => void;
}) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim() || !photo) return;
    onAddComment(photo.id, text.trim());
    setText("");
  };

  if (!photo) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />

          <Text style={styles.modalTitle}>Comentários</Text>
          <Text style={styles.modalSubtitle}>📍 {photo.location}</Text>

          <ScrollView style={styles.commentsList}>
            {photo.comments.length === 0 ? (
              <Text style={styles.noComments}>Seja o primeiro a comentar!</Text>
            ) : (
              photo.comments.map((c) => (
                <View key={c.id} style={styles.commentRow}>
                  <Image
                    source={{ uri: c.avatar }}
                    style={styles.commentAvatar}
                  />
                  <View style={styles.commentBubble}>
                    <Text style={styles.commentUser}>{c.user}</Text>
                    <Text style={styles.commentText}>{c.text}</Text>
                  </View>
                  <Text style={styles.commentTime}>{c.time}</Text>
                </View>
              ))
            )}
          </ScrollView>

          <View style={styles.commentInputRow}>
            <TextInput
              style={styles.commentInput}
              placeholder="Adicionar comentário..."
              placeholderTextColor="#999"
              value={text}
              onChangeText={setText}
              multiline
            />
            <TouchableOpacity
              style={[styles.sendBtn, !text.trim() && styles.sendBtnDisabled]}
              onPress={handleSend}
              disabled={!text.trim()}
            >
              <Text style={styles.sendBtnText}>Enviar</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// ─── Tela principal ───────────────────────────────────────────────────────────
export default function Profile() {
  const [photos, setPhotos] = useState<Photo[]>(MOCK_PHOTOS);
  const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [commentsVisible, setCommentsVisible] = useState(false);

  const visitedCount = photos.length;
  const likedCount = photos.filter((p) => p.liked).length;
  const totalLikesReceived = photos.reduce((acc, p) => acc + p.likes, 0);

  const openComments = (photo: Photo) => {
    setSelectedPhoto(photo);
    setCommentsVisible(true);
  };

  const addComment = (photoId: string, text: string) => {
    const newComment = {
      id: Date.now().toString(),
      user: "voce",
      avatar: "https://i.pravatar.cc/40?img=10",
      text,
      time: "agora",
    };

    setPhotos((prev) =>
      prev.map((p) =>
        p.id === photoId ? { ...p, comments: [...p.comments, newComment] } : p,
      ),
    );

    setSelectedPhoto((prev) =>
      prev && prev.id === photoId
        ? { ...prev, comments: [...prev.comments, newComment] }
        : prev,
    );
  };

  const savedPhotos = photos.filter((p) => p.liked);

  // ✅ Célula de foto corrigida — source={item.uri} direto, sem { uri: }
  const PhotoCell = ({ item }: { item: Photo }) => (
    <TouchableOpacity
      style={styles.photoCell}
      onPress={() => openComments(item)}
      activeOpacity={0.85}
    >
      <Image source={item.uri} style={styles.photoThumb} />
      {item.liked && (
        <View style={styles.likedBadge}>
          <Text style={{ fontSize: 10 }}>❤️</Text>
        </View>
      )}
      <View style={styles.photoOverlay}>
        <Text style={styles.photoOverlayText}>💬 {item.comments.length}</Text>
        <Text style={styles.photoOverlayText}>❤️ {item.likes}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#4A27C4" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.appName}>Peakly</Text>
            <TouchableOpacity style={styles.settingsBtn}>
              <Text style={styles.settingsIcon}>⚙️</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.profileRow}>
            <View style={styles.avatarWrapper}>
              <Image
                source={require("../../assets/images/profile-img.png")}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.addAvatarBtn}>
                <Text style={styles.addAvatarIcon}>+</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.statsRow}>
              <StatBox value={visitedCount} label="Visitados" />
              <StatBox value={likedCount} label="Curtidos" />
              <StatBox value={totalLikesReceived} label="Curtidas" />
            </View>
          </View>

          <View style={styles.bioSection}>
            <Text style={styles.userName}>João Aventureiro</Text>
            <Text style={styles.userHandle}>@joao_peaks</Text>
            <Text style={styles.userBio}>
              🏔️ Amante de trilhas e cachoeiras E casadas{"\n"}
              📍 CASINHAS,SAO PEDRO , BR
            </Text>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.editBtn}>
              <Text style={styles.editBtnText}>Editar Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareBtn}>
              <Text style={styles.shareBtnText}>Compartilhar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addPhotoBtn}>
              <Text style={styles.addPhotoBtnText}>📷</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Destaques ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.highlightsScroll}
          contentContainerStyle={styles.highlightsContent}
        >
          {["Trilhas", "Cachoeiras", "Picos", "Viagens", "+ Novo"].map(
            (h, i) => (
              <TouchableOpacity key={i} style={styles.highlight}>
                <View
                  style={[
                    styles.highlightCircle,
                    i === 4 && styles.highlightAdd,
                  ]}
                >
                  <Text style={styles.highlightEmoji}>
                    {["🥾", "💧", "⛰️", "✈️", "+"][i]}
                  </Text>
                </View>
                <Text style={styles.highlightLabel}>{h}</Text>
              </TouchableOpacity>
            ),
          )}
        </ScrollView>

        {/* ── Abas ── */}
        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "posts" && styles.tabActive]}
            onPress={() => setActiveTab("posts")}
          >
            <Text
              style={[
                styles.tabIcon,
                activeTab === "posts" && styles.tabIconActive,
              ]}
            >
              ⊞
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "saved" && styles.tabActive]}
            onPress={() => setActiveTab("saved")}
          >
            <Text
              style={[
                styles.tabIcon,
                activeTab === "saved" && styles.tabIconActive,
              ]}
            >
              🔖
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Grade de fotos ── */}
        {activeTab === "posts" ? (
          <View style={styles.photoGrid}>
            {photos.map((item) => (
              <PhotoCell key={item.id} item={item} />
            ))}
          </View>
        ) : (
          <View style={styles.photoGrid}>
            {savedPhotos.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>🔖</Text>
                <Text style={styles.emptyText}>Nenhum lugar curtido ainda</Text>
              </View>
            ) : (
              savedPhotos.map((item) => <PhotoCell key={item.id} item={item} />)
            )}
          </View>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      <CommentsModal
        visible={commentsVisible}
        photo={selectedPhoto}
        onClose={() => setCommentsVisible(false)}
        onAddComment={addComment}
      />
    </SafeAreaView>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F0F2FF" },
  container: { flex: 1, backgroundColor: "#F0F2FF" },

  header: {
    backgroundColor: "#5B30E8",
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#5B30E8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  appName: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  settingsBtn: { padding: 4 },
  settingsIcon: { fontSize: 22 },

  profileRow: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  avatarWrapper: { position: "relative", marginRight: 24 },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 3,
    borderColor: "#fff",
  },
  addAvatarBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#FF6B35",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#5B30E8",
  },
  addAvatarIcon: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 22,
  },

  statsRow: { flex: 1, flexDirection: "row", justifyContent: "space-around" },
  statBox: { alignItems: "center" },
  statValue: { color: "#fff", fontSize: 20, fontWeight: "800" },
  statLabel: { color: "rgba(255,255,255,0.75)", fontSize: 11, marginTop: 2 },

  bioSection: { marginBottom: 14 },
  userName: { color: "#fff", fontSize: 17, fontWeight: "700" },
  userHandle: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 13,
    marginBottom: 6,
  },
  userBio: { color: "rgba(255,255,255,0.88)", fontSize: 13, lineHeight: 19 },

  actionRow: { flexDirection: "row", gap: 8 },
  editBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
  editBtnText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  shareBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
  shareBtnText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  addPhotoBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
  addPhotoBtnText: { fontSize: 16 },

  highlightsScroll: { marginTop: 16 },
  highlightsContent: { paddingHorizontal: 16, gap: 14 },
  highlight: { alignItems: "center", marginRight: 8 },
  highlightCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#5B30E8",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 2,
    borderColor: "#5B30E8",
  },
  highlightAdd: {
    borderStyle: "dashed",
    borderColor: "#aaa",
    backgroundColor: "#f5f5f5",
  },
  highlightEmoji: { fontSize: 26 },
  highlightLabel: {
    fontSize: 11,
    color: "#555",
    marginTop: 4,
    fontWeight: "500",
  },

  tabsRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "#E0E0E0",
    marginTop: 16,
    backgroundColor: "#fff",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: { borderBottomColor: "#5B30E8" },
  tabIcon: { fontSize: 20, color: "#999" },
  tabIconActive: { color: "#5B30E8" },

  photoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 2, paddingTop: 2 },
  photoCell: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    position: "relative",
    overflow: "hidden",
  },
  photoThumb: { width: "100%", height: "100%" },
  likedBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  photoOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 4,
  },
  photoOverlayText: { color: "#fff", fontSize: 11, fontWeight: "600" },

  emptyState: { width: "100%", paddingVertical: 60, alignItems: "center" },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { color: "#999", fontSize: 14 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingBottom: 32,
    maxHeight: "80%",
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ddd",
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1A2E",
    marginBottom: 4,
  },
  modalSubtitle: { fontSize: 13, color: "#777", marginBottom: 16 },
  commentsList: { maxHeight: 300, marginBottom: 12 },
  noComments: {
    color: "#bbb",
    textAlign: "center",
    paddingVertical: 32,
    fontSize: 14,
  },
  commentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  commentAvatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
  commentBubble: {
    flex: 1,
    backgroundColor: "#F4F4FB",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  commentUser: {
    fontSize: 12,
    fontWeight: "700",
    color: "#5B30E8",
    marginBottom: 2,
  },
  commentText: { fontSize: 13, color: "#333" },
  commentTime: { fontSize: 11, color: "#bbb", marginLeft: 8, marginTop: 4 },
  commentInputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingTop: 12,
    gap: 8,
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#F4F4FB",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: "#333",
    maxHeight: 90,
  },
  sendBtn: {
    backgroundColor: "#5B30E8",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sendBtnDisabled: { backgroundColor: "#ccc" },
  sendBtnText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  closeBtn: { marginTop: 12, alignItems: "center", paddingVertical: 10 },
  closeBtnText: { color: "#999", fontSize: 14 },
});
