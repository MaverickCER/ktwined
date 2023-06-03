<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { doc } from 'firebase/firestore'
import { useCurrentUser } from 'vuefire'
import { useDocument } from 'vuefire'
import { firestore } from './services/firebase'

const user = useCurrentUser()

const { data: settings, promise } = useDocument(doc(firestore, 'artworks/homepage'))
promise.value.then((settings) => {
  setCSSVariables(settings);
})

/**
  * Dynamically sets the CSS variables based on the fetched settings.
  *
  * @param {Object} settings - The settings object
  */
function setCSSVariables(settings) {
  const headTag = document.getElementsByTagName('head')[0]
  const metaTag = document.createElement('meta')
  const styleTag = document.createElement('style')

  metaTag.setAttribute('name', 'color-scheme');
  metaTag.setAttribute('content', settings.isDarkMode ? 'dark' : 'light');
  headTag.appendChild(metaTag)

  styleTag.innerHTML = `
    :root {
      --accent: url("${settings.accent}");
      --background: url("${settings.background}");
      --border: ${settings.isDarkMode ? 'rgba(0, 0, 0, .5)' : 'rgba(255, 255, 255, .5)'};
      --card: url("${settings.card}");
      --logo: url("${settings.logo}");
      --text: ${settings.isDarkMode ? '#FFFFFF' : '#000000'};
    }
  `
  headTag.appendChild(styleTag)
}
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/about">About</RouterLink>
      <div class="star-icon"></div>
      <RouterLink to="/"><span alt="Vue logo" class="logo" /></RouterLink>
      <div class="star-icon"></div>
      <RouterLink to="/content" v-if="user">Content</RouterLink>
      <RouterLink to="/join" v-if="!user">Join</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>