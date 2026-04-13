import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

const favoritos = [
  { id: "1", nome: "Morro do Finder", distancia: 4.5 },
  { id: "2", nome: "Cachoeira do Salto", distancia: 12.8 },
  { id: "3", nome: "Trilha Verde", distancia: 7.2 },
];

const menuItems = [
  {
    label: "Meus picos",
    sub: "Gerencie os locais criados",
    color: "#ede9fe",
  },
  {
    label: "Configurações",
    sub: "Preferências do app",
    color: "#fef3c7",
  },
  {
    label: "Sair",
    sub: "Encerrar sessão",
    color: "#fee2e2",
  },
];

export default function ProfileScreen() {
  const usuario = {
    nome: "Diego",
    local: "Chapecó, SC",
    picos: 12,
  };

  return (
    <ThemedView style={{ flex: 1, backgroundColor: "#f4f1ee" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <LinearGradient
          colors={["#1a0a3c", "#2e1065", "#4c1d95"]}
          style={styles.header}
        >
          <View style={styles.topBar}>
            <ThemedText style={styles.topTitle}>Perfil</ThemedText>

            <TouchableOpacity style={styles.editBtn}>
              <ThemedText style={styles.editText}>Editar</ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.avatarSection}>
            <View style={styles.avatar} />

            <ThemedText style={styles.nome}>{usuario.nome}</ThemedText>

            <ThemedText style={styles.local}>
              {usuario.local} · {usuario.picos} picos criados
            </ThemedText>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* MENU */}
          <ThemedText style={styles.section}>Conta</ThemedText>

          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <View style={[styles.iconBox, { backgroundColor: item.color }]} />

              <View style={{ flex: 1 }}>
                <ThemedText style={styles.menuTitle}>{item.label}</ThemedText>
                <ThemedText style={styles.menuSub}>{item.sub}</ThemedText>
              </View>

              <ThemedText style={styles.arrow}>›</ThemedText>
            </TouchableOpacity>
          ))}

          {/* FAVORITOS */}
          <ThemedText style={styles.sectionBig}>Seus favoritos</ThemedText>

          <View style={styles.grid}>
            {favoritos.map((fav) => (
              <TouchableOpacity key={fav.id} style={styles.card}>
                <View style={styles.imagePlaceholder} />

                <View style={styles.cardBody}>
                  <ThemedText style={styles.cardTitle}>{fav.nome}</ThemedText>

                  <ThemedText style={styles.cardSub}>
                    {fav.distancia} km
                  </ThemedText>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  topTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  editBtn: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },

  editText: {
    color: "#fff",
    fontSize: 13,
  },

  avatarSection: {
    alignItems: "center",
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#7c3aed",
    marginBottom: 10,
  },

  nome: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },

  local: {
    color: "rgba(196,181,253,0.8)",
    fontSize: 13,
  },

  content: {
    backgroundColor: "#fff",
    padding: 20,
  },

  section: {
    fontSize: 12,
    fontWeight: "600",
    color: "#a78bfa",
    marginBottom: 10,
  },

  sectionBig: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 12,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  iconBox: {
    width: 35,
    height: 35,
    borderRadius: 10,
    marginRight: 10,
  },

  menuTitle: {
    fontSize: 14,
    fontWeight: "600",
  },

  menuSub: {
    fontSize: 12,
    color: "#777",
  },

  arrow: {
    color: "#bbb",
    fontSize: 18,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  card: {
    width: "47%",
    backgroundColor: "#f5f0ff",
    borderRadius: 12,
    overflow: "hidden",
  },

  imagePlaceholder: {
    height: 80,
    backgroundColor: "#ddd6fe",
  },

  cardBody: {
    padding: 10,
  },

  cardTitle: {
    fontSize: 13,
    fontWeight: "600",
  },

  cardSub: {
    fontSize: 11,
    color: "#777",
  },
});
