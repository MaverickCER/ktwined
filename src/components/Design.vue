<script setup lang="ts">
import { doc, setDoc } from 'firebase/firestore'
import { ref } from 'vue'
import { useDocument } from 'vuefire'
import { firestore } from '../services/firebase'

// two way reference representing the site's accent icon
const accent = ref('')
// two way reference representing the site's background image
const background = ref('')
// two way reference representing the site's card background
const card = ref('')
// two way reference representing the site's dark mode setting
const isDarkMode = ref('')
// two way reference representing the site's logo
const logo = ref('')

const { data: settings, promise: settingsPromise } = useDocument(doc(firestore, 'artworks/homepage'))
settingsPromise.value.then((settings) => {
  updateDesign(settings);
})

/**
 * Updates the design settings. If settings are provided, it updates the existing settings; otherwise, it adds new settings.
 *
 * @param {Object|null} settings - The design settings object (null for new settings)
 */
function updateDesign(settings) {
  if (settings) {
    accent.value = settings.accent
    background.value = settings.background
    card.value = settings.card
    isDarkMode.value = settings.isDarkMode
    logo.value = settings.logo
  } else {
    setDoc(doc(firestore, "artworks/homepage"), {
      accent: accent.value,
      background: background.value,
      card: card.value,
      isDarkMode: isDarkMode.value.toString().toLowerCase() === 'true',
      logo: logo.value
    });
  }
}
</script>

<template>
  <div class="accent">
    <img :src="accent" :alt="accent" />
  </div>
  <input v-model="accent" type="text" placeholder="Accents" />
  <div class="background">
    <img :src="background" :alt="background" />
  </div>
  <input v-model="background" type="text" placeholder="Background" />
  <div class="card">
    <img :src="card" :alt="card" />
  </div>
  <input v-model="card" type="text" placeholder="Card" />
  <div class="logo">
    <img :src="logo" :alt="logo" />
  </div>
  <input v-model="logo" type="text" placeholder="Logo" />
  <label>
  <div :class="[isDarkMode ? 'dark' : 'light']">
    <div>
      {{isDarkMode ? 'Dark Mode' : 'Light Mode'}}
      <br/>
      (Click to toggle)
    </div>
  </div>
  <input v-model="isDarkMode" type="checkbox" style="visibility: hidden;" />
  </label>
  <div class="featured-buttons">
    <button @click="updateDesign()">Save</button>
  </div>
</template>

<style>
.featured-buttons > button {
  display: flex;
  margin: 0;
  padding: 8px 24px;
  border: none;
  background-color: transparent;
  color: white;
  font-size: 2rem;
  box-shadow: none;
  cursor: pointer;
  margin: auto;
}
.design {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.accent img {
  width: 30px;
  height: 30px;
  margin: auto;
}
.background img {
  width: 320px;
  height: auto;
  margin: auto;
}
.card img {
  width: 300px;
  height: 482px;
  margin: auto;
}
.logo img {
  width: 40px;
  height: 50px;
}
.dark,
.light {
  width: 360px;
  height: 552px;
  margin: auto;
}
.dark {
  border: 15px solid rgba(0, 0, 0, 0.5);
}
.light {
  border: 15px solid rgba(255, 255, 255, 0.5);
}
.dark div,
.light div {
  width: calc(100% - 10px);
  height: calc(100% - 10px);
  margin: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.dark div {
  background-color: rgba(0, 0, 0, 0.5);
  color: #FFFFFF;
}
.light div {
  background-color: rgba(255, 255, 255, 0.5);
  color: #000000;
}
</style>