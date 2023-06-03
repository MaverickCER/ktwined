<script setup lang="ts">
import { doc } from 'firebase/firestore'
import { ref } from 'vue'
import { signOut } from 'firebase/auth'
import { useDocument } from 'vuefire'
import { auth, firestore } from '../services/firebase'
import Design from '../components/Design.vue'
import Feature from '../components/Feature.vue'
import Manage from '../components/Manage.vue'
import Router from '../router'

// one way refernece representing the current user's role
const admin = ref(false)
// two way reference representing the current tab
const view = ref('manage')

const { data: user, promise } = useDocument(doc(firestore, `artists/${auth.currentUser.uid}`))
promise.value.then((user) => {
  updateAdmin(user)
})

/**
 * Switches the view to the specified value.
 *
 * @param {string} value - The value to switch the view to, must fall into enum ['feature', 'manage', 'design']
 */
function switchView(value) {
  if (['feature', 'manage', 'design'].includes(value)) {
    view.value = value
  }
}

/**
 * Signs out the current user.
 */
function signout() {
  signOut(auth)
    .then(() => {
      Router.push('/')
    })
    .catch((error) => {
      console.error(error)
    })
}

/**
 * Updates the admin status based on the provided value.
 *
 * @param {Object|null} value - The value containing the admin status
 */
function updateAdmin(value) {
  if (value?.admin) {
    admin.value = value.admin.toString() === 'true'
  }
}
</script>

<template>
  <div class="featured-buttons">
    <button @click="signout()">Sign Out</button>
  </div>
  <div v-if="admin" class="featured-buttons">
    <button @click="switchView('feature')" v-if="view === 'manage'">Manage</button>
    <button @click="switchView('design')" v-if="view === 'feature'">Feature</button>
    <button @click="switchView('manage')" v-if="view === 'design'">Design</button>
  </div>
  <div v-if="view === 'manage'" class="manage">
    <Manage />
  </div>
  <div v-if="view === 'feature' && admin" class="feature">
    <Feature />
  </div>
  <div v-if="view === 'design' && admin" class="design">
    <Design />
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
.design,
.feature,
.manage {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}
.design {
  flex-direction: column;
}
</style>