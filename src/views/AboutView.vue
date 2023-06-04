<template>
  <article class="container is-visible" id="about">
    <!-- Border around About Article -->
    <div class="about__outer">
      <!-- Background and padding around article -->
      <div class="about__inner">
        <p>
          K-twined is a place to intertwine different artists from various kpop fandoms together!
          It's main goal is for people to have a place to discover new artists in a fun and engaging
          way of pulling for random photocards!
        </p>
        <br /><br />
        <p>
          This is a way to bring artists together and display their work in an entertaining way to
          viewers, creating a wider reach for discovering new artists! No matter if you have a small
          or big following, all are welcome!
        </p>
        <br /><br />
        <p>
          As there is nothing more exciting than opening that fresh album and the anticipation and
          curiosity behind what kind of photocard you will get!
        </p>
        <br /><br /><br />
        <p><u>Notes for the Future!</u></p>
        <p>
          I hope to have this project up and running for a long time! As time goes by, I hope more
          and more artists join in to create a community! Here are some things to look forward to
          for the future of K-twined-
        </p>
        <br /><br />
        <p>
          Every so often I'll feature new work from different artists and occasionally I'll change
          the theme of the website to align with special events!
        </p>
      </div>
    </div>
  </article>
</template>

<style>
.about__outer {
  border: 15px solid var(--border);
  position: relative;
}

.about__outer::before,
.about__outer::after {
  content: '';
  display: block;
  background-image: var(--accent);
  background-size: 100% 100%;
  width: 3rem;
  height: 3rem;
  position: absolute;
  top: 50%;
}

.about__outer::before {
  left: -5rem;
  transform: translate(-50%, -50%);
}

.about__outer::after {
  right: -8rem;
  transform: translate(-50%, -50%);
}

.about__inner {
  background-color: var(--border);
  padding: 1rem 3rem;
  margin: 5px;
}

.about__inner u {
  display: block;
  text-align: center;
}

.about__inner p {
  display: block;
  max-width: 65ch !important;
}
</style>
