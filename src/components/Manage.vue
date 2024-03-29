<script setup lang="ts">
import { collection, query, where, doc, deleteDoc, setDoc, addDoc } from 'firebase/firestore'
import { ref } from 'vue'
import { useCollection } from 'vuefire'
import { auth, firestore } from '../services/firebase'

// two way reference representing the artist's name for the selected artwork
const artist = ref('')
// two way reference representing the artist's instagram handle for the selected artwork
const attribution = ref('')
// two way reference representing the currently selected artwork that is being edited
const editId = ref('')
// two way reference representing the image for the selected artwork
const image = ref('')
// two way reference representing the member's name for the selected artwork
const subtitle = ref('')
// two way reference representing the group's name for the selected artwork
const title = ref('')

const artworks = useCollection(query(collection(firestore, 'artworks'), where('artistId', '==', auth.currentUser.uid)))

/**
 * Deletes an artwork by its ID.
 *
 * @param {string} id - The ID of the artwork to be deleted
 */
function deleteArtwork(id) {
  deleteDoc(doc(firestore, "artworks", id));
}

/**
 * Saves an artwork. If an ID is provided, it updates the existing artwork; otherwise, it adds a new artwork.
 *
 * @param {string|null} id - The ID of the artwork (null for new artwork)
 */
function saveArtwork(id) {
  if (id) {
    setDoc(doc(firestore, "artworks", id), {
      image: image.value.trim(),
      title: title.value.trim().toLowerCase(),
      subtitle: subtitle.value.trim().toLowerCase(),
      attribution: `https://www.instagram.com/${attribution.value.trim().toLowerCase().replace('@','').substring(0, 30)}`,
      artist: artist.value.trim().toLowerCase().replace(/\s+/g, "%20"),
      artistId: auth.currentUser.uid,
      featured: false,
    });
  } else {
    addDoc(collection(firestore, "artworks"), {
      image: image.value.trim(),
      title: title.value.trim().toLowerCase(),
      subtitle: subtitle.value.trim().toLowerCase(),
      attribution: attribution.value.trim().toLowerCase(),
      artist: artist.value.trim().toLowerCase().replace(/\s+/g, '%20'),
      artistId: auth.currentUser.uid,
      featured: false,
    });
  }
  setEditArtwork();
}

/**
 * Sets the edit artwork form with the artwork's details based on its ID.
 *
 * @param {string|null} id - The ID of the artwork (null to reset the form)
 */
function setEditArtwork(id, artworks) {
  if (!id) {
    editId.value = ''
    image.value = ''
    title.value = ''
    subtitle.value = ''
    attribution.value = ''
    artist.value = ''
    return;
  }
  if (artworks) {
    let artwork = artworks.find((artwork) => artwork.id === id);
    if (artwork) {
      editId.value = id
      image.value = artwork.image
      title.value = artwork.title
      subtitle.value = artwork.subtitle
      attribution.value = artwork.attribution.replace('https://www.instagram.com/', '');
      artist.value = artwork.artist.replace(/%20/g, " ")
    }
  }
}
</script>

<template>
  <div v-if="!artworks">Start uploading your artwork now!</div>
  <div v-else v-for="artwork in artworks" :key="artwork.id" class="cards">
    <section class="container is-visible">
      <!-- Card Flip -->
      <div class="flex reveal">
        <!-- Back of Card -->
        <div class="card flex__side flex__side--back">
          <!-- Border around card -->
          <div class="panel">
            <!-- Background and padding around card -->
            <div></div>
          </div>
          <!-- The featured image -->
          <div class="artwork-wrapper" v-if="editId !== artwork.id">
            <img :src="artwork.image" :alt="artwork.title" />        
          </div>
          <div class="artwork-wrapper" v-if="editId === artwork.id">
            <img :src="image" :alt="title" />
          </div>
          <input v-model="image" type="url" class="image-input" v-if="editId === artwork.id" />
          <!-- Image details -->
          <div class="content">
            <div v-if="editId !== artwork.id">
              <!-- title of image -->
              <span>&nbsp;&nbsp;<span>{{artwork.title}}</span></span>
              <!-- subtitle of image -->
              <span><span>{{artwork.subtitle}}</span>&nbsp;&nbsp;</span>
            </div>
            <div v-if="editId === artwork.id" class="grid-2-inputs mb-8">
              <!-- title of image -->
              <input v-model="title" type="text" placeholder="Group Name" />
              <!-- subtitle of image -->
              <input v-model="subtitle" type="text" placeholder="Member Name" />
            </div>
            <!-- artist attribution -->
            <a :href="artwork.attribution" v-if="editId !== artwork.id">
              <!-- Instagram Icon -->
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                <path
                  d="M23.928 7.05333C23.9082 6.0577 23.7198 5.07262 23.3707 4.14C23.069 3.33923 22.5962 2.61392 21.9853 2.01467C21.3861 1.4038 20.6608 0.931034 19.86 0.629333C18.9278 0.280349 17.9432 0.0919019 16.948 0.072C15.6667 0.0133333 15.2587 0 12 0C8.74133 0 8.33333 0.0133333 7.05333 0.072C6.0577 0.0917516 5.07262 0.280201 4.14 0.629333C3.33875 0.930863 2.61297 1.40364 2.01333 2.01467C1.40295 2.61405 0.930644 3.33935 0.629333 4.14C0.280349 5.0722 0.0919019 6.05681 0.072 7.052C0.0133333 8.33333 0 8.74133 0 12C0 15.2587 0.0133333 15.6667 0.072 16.9467C0.0917516 17.9423 0.280201 18.9274 0.629333 19.86C0.931034 20.6608 1.4038 21.3861 2.01467 21.9853C2.61389 22.5962 3.33921 23.069 4.14 23.3707C5.0722 23.7197 6.05681 23.9081 7.052 23.928C8.33333 23.9867 8.74133 24 12 24C15.2587 24 15.6667 23.9867 16.9467 23.928C17.9423 23.9082 18.9274 23.7198 19.86 23.3707C20.6575 23.0624 21.3817 22.5908 21.9863 21.9863C22.5908 21.3817 23.0624 20.6575 23.3707 19.86C23.7197 18.9278 23.9081 17.9432 23.928 16.948C23.9867 15.6667 24 15.2587 24 12C24 8.74133 23.9867 8.33333 23.928 7.05333ZM21.768 16.8493C21.7588 17.6098 21.619 18.3629 21.3547 19.076C21.1552 19.5938 20.8495 20.064 20.4573 20.4565C20.0651 20.849 19.595 21.1549 19.0773 21.3547C18.3638 21.6191 17.6102 21.7589 16.8493 21.768C15.5827 21.8253 15.204 21.8373 12 21.8373C8.796 21.8373 8.416 21.8253 7.15067 21.768C6.39025 21.7588 5.63707 21.619 4.924 21.3547C4.40225 21.1626 3.93021 20.856 3.54267 20.4573C3.14419 20.0702 2.83756 19.5986 2.64533 19.0773C2.38086 18.3639 2.24105 17.6102 2.232 16.8493C2.17467 15.5827 2.16267 15.204 2.16267 12C2.16267 8.796 2.17467 8.416 2.232 7.15067C2.24123 6.39025 2.38104 5.63707 2.64533 4.924C2.83738 4.40225 3.14402 3.93021 3.54267 3.54267C3.92983 3.14419 4.40139 2.83756 4.92267 2.64533C5.63616 2.38089 6.3898 2.24107 7.15067 2.232C8.41733 2.17467 8.796 2.16267 12 2.16267C15.204 2.16267 15.584 2.17467 16.8493 2.232C17.6098 2.24123 18.3629 2.38104 19.076 2.64533C19.5978 2.83738 20.0698 3.14402 20.4573 3.54267C20.8558 3.92983 21.1624 4.40139 21.3547 4.92267C21.6191 5.63616 21.7589 6.3898 21.768 7.15067C21.8253 8.41733 21.8373 8.796 21.8373 12C21.8373 15.204 21.8253 15.584 21.768 16.8493V16.8493ZM12 5.83733C10.7811 5.83733 9.58965 6.19877 8.57621 6.87593C7.56276 7.55309 6.77288 8.51557 6.30644 9.64165C5.84 10.7677 5.71796 12.0068 5.95575 13.2023C6.19354 14.3977 6.78047 15.4958 7.64234 16.3577C8.5042 17.2195 9.60228 17.8065 10.7977 18.0443C11.9932 18.282 13.2323 18.16 14.3584 17.6936C15.4844 17.2271 16.4469 16.4372 17.1241 15.4238C17.8012 14.4103 18.1627 13.2189 18.1627 12C18.1627 10.3656 17.5134 8.79806 16.3577 7.64234C15.2019 6.48661 13.6344 5.83733 12 5.83733ZM12 16C11.2089 16 10.4355 15.7654 9.77772 15.3259C9.11992 14.8864 8.60723 14.2616 8.30448 13.5307C8.00173 12.7998 7.92252 11.9956 8.07686 11.2196C8.2312 10.4437 8.61216 9.73098 9.17157 9.17157C9.73098 8.61216 10.4437 8.2312 11.2196 8.07686C11.9956 7.92252 12.7998 8.00173 13.5307 8.30448C14.2616 8.60723 14.8864 9.11992 15.3259 9.77772C15.7654 10.4355 16 11.2089 16 12C16 13.0609 15.5786 14.0783 14.8284 14.8284C14.0783 15.5786 13.0609 16 12 16ZM19.8453 5.59467C19.8453 5.87947 19.7609 6.15788 19.6027 6.39469C19.4444 6.63149 19.2195 6.81606 18.9564 6.92505C18.6933 7.03404 18.4037 7.06256 18.1244 7.007C17.8451 6.95143 17.5885 6.81429 17.3871 6.6129C17.1857 6.41151 17.0486 6.15493 16.993 5.8756C16.9374 5.59626 16.966 5.30673 17.0749 5.0436C17.1839 4.78048 17.3685 4.55558 17.6053 4.39735C17.8421 4.23912 18.1205 4.15467 18.4053 4.15467C18.7872 4.15467 19.1535 4.30638 19.4236 4.57643C19.6936 4.84649 19.8453 5.21276 19.8453 5.59467V5.59467Z"
                  fill="white"
                />
              </svg>
              <!-- Name of Artist -->
              <span>{{artwork.artist.replace(/%20/g, " ")}}</span>
            </a>
            <div class="grid-2-inputs" v-if="editId === artwork.id">
              <input v-model="attribution" type="url" />
              <input v-model="artist" type="text" />
            </div>
          </div>
        </div>
      </div>
      <button v-if="editId !== artwork.id" @click="setEditArtwork(artwork.id, artworks)">Edit</button>
      <div v-if="editId === artwork.id" class="grid-3-btns">
        <button @click="saveArtwork(artwork.id)">Save</button>
        <button @click="setEditArtwork()">Cancel</button>
        <button @click="deleteArtwork(artwork.id)">Delete</button>
      </div>
    </section>
  </div>
  <section class="container is-visible" v-if="editId === ''">
    <!-- Card Flip -->
    <div class="flex reveal">
      <!-- Back of Card -->
      <div class="card flex__side flex__side--back">
        <!-- Border around card -->
        <div class="panel">
          <!-- Background and padding around card -->
          <div></div>
        </div>
        <!-- The featured image -->
        <div class="artwork-wrapper">
          <img v-if="image" :src="image" :alt="title" />
        </div>
        <input v-model="image" type="url" class="image-input" placeholder="Artwork URL" />
        <!-- Image details -->
        <div class="content">
          <div class="grid-2-inputs mb-8">
            <!-- title of image -->
            <input v-model="title" type="text" placeholder="Group Name" />
            <!-- subtitle of image -->
            <input v-model="subtitle" type="text" placeholder="Member Name" />
          </div>
          <!-- artist attribution -->
          <div class="grid-2-inputs">
            <input v-model="attribution" type="url" placeholder="Instagram Handle" />
            <input v-model="artist" type="text" placeholder="Artist Name" />
          </div>
        </div>
      </div>
    </div>
    <div class="featured-buttons">
      <button class="save-button" @click="saveArtwork()">Save</button>
    </div>
  </section>
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
.featured-buttons > .save-button {
  margin-top: 85px;
}
.cards {
  min-width: 400px;
}
.grid-3-btns {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
}
.image-input {
  position: absolute;
  top: 454px;
  left: 50%;
  transform: translateX(-50%);
  width: 223px;
  z-index: 3;
}
.grid-2-inputs {
  display: flex;
  flex-direction: row;
}
.grid-2-inputs > input {
  width: 132px;
}
.mb-8 {
  margin-bottom: 8px;
}
.manage {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}
.manage .cards .container {
  max-width: 450px;
}
</style>