<template>
  <div>
    <h1>Admin Page</h1>
    <p>Benvenuto nella tua pagina di admin!</p>
    <form>
      <input type="text" v-model="userSearchName">
      <input type="button" value="Search" @click="searchUsersByDisplayNameStartsWith">
    </form>
    <div v-for="user in users" :key="user.id">
      <form>
        <input type="text" :value="user.displayName">
        <input type="text" :value="user.id" disabled>
        <input type="text" :value="user.email">
        <input type="text" :value="user.role">
      </form>
    </div>
  </div>
</template>

<script setup>
import { collection, query, where, getDocs } from "firebase/firestore";
import { ref } from 'vue'

const { $db } = useNuxtApp();

const userSearchName = ref(null);
let users = ref([]);

async function searchUsersByDisplayNameStartsWith() {
  const usersRef = collection($db, "users");
  if (!userSearchName.value) {
    users.value = [];
    return;
  }

  const endText = userSearchName.value + '\uf8ff';

  const q = query(usersRef,
    where("displayName", ">=", userSearchName.value),
    where("displayName", "<=", endText)
  );

  try {
    const querySnapshot = await getDocs(q);
    users.value = [];
    querySnapshot.forEach((doc) => {
      users.value.push({ id: doc.id, ...doc.data() });
    });
    console.log(users);
  } catch (error) {
    console.error("Errore durante la ricerca 'starts with':", error);
  }
}
</script>
