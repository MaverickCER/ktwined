<script lang="ts">
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '../services/firebase'

export default {
  methods: {
    googleSignIn: function () {
      const provider = new GoogleAuthProvider()
      signInWithPopup(auth, provider)
        .then((result) => {
          this.$router.push('/content')
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
}
</script>

<template>
  <article class="container" id="join">
    <!-- Border around join article -->
    <div class="join__outer">
      <!-- back background and padding -->
      <div class="join__inner">
        <p>
          We have made updates to Ktwined, now you can manage your own artworks and add as many
          images as you wish, so you have more control now! You can also send people directly to
          your own handle so they'll only see your content! For example, my artist handle is
          lunulalyra and you can find only my content at
          <a href="https://www.k-twined.com/lunulalyra">k-twined.com/lunulalyra</a>!
        </p>
        <br /><br />
        <p>
          Please note! Once you join in, I would appreciate it if you could share the website around
          and possibly have a link to it on your Instagram bio or Linktree, Carrd or any other
          landing page you use! As this will indicate that you have your work on there plus increase
          the reach of discovering new artists!
        </p>
        <br /><br />
        <p>
          Lastly, you can delete your content at any time. The only information we store about you
          is your google email, your ramdomly generated user id and the art you upload. You can
          remove your artwork at any time for any reason. I also reserve the right to remove your
          artwork at any time and for any reason, even if it's not featured.
        </p>
        <br /><br />
        <p>
          Any issues with uploading your artworks, please let me know and I can help you out. If you
          are having problems, I have more information on my
          <a href="https://lunulalyra.carrd.co/" target="_blank" rel="noopener">Carrd</a> about
          uploading images! Thank you so much once again!
        </p>
        <br />
        <button @click="googleSignIn" class="signin">Sign In with Google</button>
      </div>
    </div>
  </article>
</template>

<style>
.signin {
  cursor: pointer;
  margin: 9rem auto 2rem;
  padding: 8px 24px;
  border: none;
  background-color: var(--text);
  border-radius: 30px;
  color: var(--border);
  font-size: 2rem;
  z-index: 10;
  box-shadow: 5px 5px 5px var(--text);
}

.join__outer {
  border: 15px solid var(--border);
  position: relative;
}

.join__outer::before,
.join__outer::after {
  content: '';
  display: block;
  background-image: var(--accent);
  background-size: 100% 100%;
  width: 3rem;
  height: 3rem;
  position: absolute;
  top: 50%;
}

.join__outer::before {
  left: -5rem;
  transform: translate(-50%, -50%);
}

.join__outer::after {
  right: -8rem;
  transform: translate(-50%, -50%);
}

.join__inner {
  background-color: var(--border);
  padding: 1rem 3rem;
  margin: 5px;
}

.join__inner p {
  display: block;
  max-width: 50ch !important;
}

.join__inner button {
  margin: 1rem auto;
  display: flex;
  padding: 0.5rem 1rem;
  cursor: pointer;
  background-color: var(--text);
  color: var(--border);
  border: none;
  font-weight: bold;
}
</style>
