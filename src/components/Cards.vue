<script setup lang="ts">
import { collection, query, where } from 'firebase/firestore'
import { onBeforeUnmount } from 'vue'
import { useCollection } from 'vuefire'
import { useRouter } from 'vue-router'
import { firestore } from '../services/firebase'

const router = useRouter()
const props = defineProps({
  artist: String
})

// On the home page only show featured artworks
let q = where('featured', '==', true)
// On artist's page only show artworks that belong to the specified artist
if (router.currentRoute.value.params.id) {
  q = where('artist', '==', router.currentRoute.value.params.id.toLowerCase())
}
let { data: artworks, promise } = useCollection(query(collection(firestore, 'artworks'), q))
promise.value.then((artworks) => {
  // automatically take the user to the home page if there are no artworks for this artist
  if (artworks.length === 0 && router.currentRoute.value.params.id) {
    router.push('/')
  }
})

let oldIndex = 0
let isRevealed = false

/**
 * Reveal or hide an artwork based on the current state.
 */
function revealArtwork() {
  if (isRevealed) {
    document.getElementById('reveal').innerHTML = 'REVEAL'
    document.getElementById('target').classList.remove('reveal')
    isRevealed = false
  } else {
    // select a random artwork
    let index = Math.floor(Math.random() * (artworks._rawValue.length - 1))
    
    // avoid showing the same artwork consecutively
    if (index === oldIndex) {
      if (index === artworks._rawValue.length - 1) {
        index = oldIndex - 1
      } else {
        index = oldIndex + 1
      }
    }
    oldIndex = index
    let artwork = artworks._rawValue[index]
    // Update the artwork details
    document.getElementById('artist').innerHTML = artwork.artist
    document.getElementById('artwork').style.backgroundImage = `url('${artwork.image}')`
    document.getElementById('attribution').setAttribute('href', artwork.attribution)
    document.getElementById('title').innerHTML = artwork.title
    document.getElementById('subtitle').innerHTML = artwork.subtitle
    document.getElementById('reveal').innerHTML = 'BACK'
    document.getElementById('target').classList.add('reveal')
    isRevealed = true
  }
}

// before unmount, flip the card over so that the artwork isn't shown by default on mount.
onBeforeUnmount(() => {
  if (isRevealed) {
    revealArtwork()
  }
})
</script>

<template>
  <section class="container is-visible" id="cards">
    <!-- Card Flip -->
    <div class="flex" id="target">
      <!-- Font of Card -->
      <div class="card flex__side flex__side--front"></div>
      <!-- Back of Card -->
      <div class="card flex__side flex__side--back">
        <!-- Border around card -->
        <div class="panel">
          <!-- Background and padding around card -->
          <div></div>
        </div>
        <!-- The featured image -->
        <div class="artwork-wrapper">
          <div class="artwork" id="artwork"></div>
        </div>
        <!-- Image details -->
        <div class="content">
          <div>
            <!-- title of image -->
            <span>&nbsp;&nbsp;<span id="title"></span></span>
            <!-- subtitle of image -->
            <span><span id="subtitle"></span>&nbsp;&nbsp;</span>
          </div>
          <!-- artist attribution -->
          <a href="#" id="attribution">
            <!-- Instagram Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <path
                d="M23.928 7.05333C23.9082 6.0577 23.7198 5.07262 23.3707 4.14C23.069 3.33923 22.5962 2.61392 21.9853 2.01467C21.3861 1.4038 20.6608 0.931034 19.86 0.629333C18.9278 0.280349 17.9432 0.0919019 16.948 0.072C15.6667 0.0133333 15.2587 0 12 0C8.74133 0 8.33333 0.0133333 7.05333 0.072C6.0577 0.0917516 5.07262 0.280201 4.14 0.629333C3.33875 0.930863 2.61297 1.40364 2.01333 2.01467C1.40295 2.61405 0.930644 3.33935 0.629333 4.14C0.280349 5.0722 0.0919019 6.05681 0.072 7.052C0.0133333 8.33333 0 8.74133 0 12C0 15.2587 0.0133333 15.6667 0.072 16.9467C0.0917516 17.9423 0.280201 18.9274 0.629333 19.86C0.931034 20.6608 1.4038 21.3861 2.01467 21.9853C2.61389 22.5962 3.33921 23.069 4.14 23.3707C5.0722 23.7197 6.05681 23.9081 7.052 23.928C8.33333 23.9867 8.74133 24 12 24C15.2587 24 15.6667 23.9867 16.9467 23.928C17.9423 23.9082 18.9274 23.7198 19.86 23.3707C20.6575 23.0624 21.3817 22.5908 21.9863 21.9863C22.5908 21.3817 23.0624 20.6575 23.3707 19.86C23.7197 18.9278 23.9081 17.9432 23.928 16.948C23.9867 15.6667 24 15.2587 24 12C24 8.74133 23.9867 8.33333 23.928 7.05333ZM21.768 16.8493C21.7588 17.6098 21.619 18.3629 21.3547 19.076C21.1552 19.5938 20.8495 20.064 20.4573 20.4565C20.0651 20.849 19.595 21.1549 19.0773 21.3547C18.3638 21.6191 17.6102 21.7589 16.8493 21.768C15.5827 21.8253 15.204 21.8373 12 21.8373C8.796 21.8373 8.416 21.8253 7.15067 21.768C6.39025 21.7588 5.63707 21.619 4.924 21.3547C4.40225 21.1626 3.93021 20.856 3.54267 20.4573C3.14419 20.0702 2.83756 19.5986 2.64533 19.0773C2.38086 18.3639 2.24105 17.6102 2.232 16.8493C2.17467 15.5827 2.16267 15.204 2.16267 12C2.16267 8.796 2.17467 8.416 2.232 7.15067C2.24123 6.39025 2.38104 5.63707 2.64533 4.924C2.83738 4.40225 3.14402 3.93021 3.54267 3.54267C3.92983 3.14419 4.40139 2.83756 4.92267 2.64533C5.63616 2.38089 6.3898 2.24107 7.15067 2.232C8.41733 2.17467 8.796 2.16267 12 2.16267C15.204 2.16267 15.584 2.17467 16.8493 2.232C17.6098 2.24123 18.3629 2.38104 19.076 2.64533C19.5978 2.83738 20.0698 3.14402 20.4573 3.54267C20.8558 3.92983 21.1624 4.40139 21.3547 4.92267C21.6191 5.63616 21.7589 6.3898 21.768 7.15067C21.8253 8.41733 21.8373 8.796 21.8373 12C21.8373 15.204 21.8253 15.584 21.768 16.8493V16.8493ZM12 5.83733C10.7811 5.83733 9.58965 6.19877 8.57621 6.87593C7.56276 7.55309 6.77288 8.51557 6.30644 9.64165C5.84 10.7677 5.71796 12.0068 5.95575 13.2023C6.19354 14.3977 6.78047 15.4958 7.64234 16.3577C8.5042 17.2195 9.60228 17.8065 10.7977 18.0443C11.9932 18.282 13.2323 18.16 14.3584 17.6936C15.4844 17.2271 16.4469 16.4372 17.1241 15.4238C17.8012 14.4103 18.1627 13.2189 18.1627 12C18.1627 10.3656 17.5134 8.79806 16.3577 7.64234C15.2019 6.48661 13.6344 5.83733 12 5.83733ZM12 16C11.2089 16 10.4355 15.7654 9.77772 15.3259C9.11992 14.8864 8.60723 14.2616 8.30448 13.5307C8.00173 12.7998 7.92252 11.9956 8.07686 11.2196C8.2312 10.4437 8.61216 9.73098 9.17157 9.17157C9.73098 8.61216 10.4437 8.2312 11.2196 8.07686C11.9956 7.92252 12.7998 8.00173 13.5307 8.30448C14.2616 8.60723 14.8864 9.11992 15.3259 9.77772C15.7654 10.4355 16 11.2089 16 12C16 13.0609 15.5786 14.0783 14.8284 14.8284C14.0783 15.5786 13.0609 16 12 16ZM19.8453 5.59467C19.8453 5.87947 19.7609 6.15788 19.6027 6.39469C19.4444 6.63149 19.2195 6.81606 18.9564 6.92505C18.6933 7.03404 18.4037 7.06256 18.1244 7.007C17.8451 6.95143 17.5885 6.81429 17.3871 6.6129C17.1857 6.41151 17.0486 6.15493 16.993 5.8756C16.9374 5.59626 16.966 5.30673 17.0749 5.0436C17.1839 4.78048 17.3685 4.55558 17.6053 4.39735C17.8421 4.23912 18.1205 4.15467 18.4053 4.15467C18.7872 4.15467 19.1535 4.30638 19.4236 4.57643C19.6936 4.84649 19.8453 5.21276 19.8453 5.59467V5.59467Z"
                fill="white"
              />
            </svg>
            <!-- Name of Artist -->
            <span id="artist"></span>
          </a>
        </div>
      </div>
    </div>
    <!-- button responsible for flipping card -->
    <button @click="revealArtwork" id="reveal">REVEAL</button>
  </section>
</template>
