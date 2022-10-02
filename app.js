let artworks = [
  {
    artist: 'LUNULALYRA',
    attribution: 'https://www.instagram.com/lunulalyra/',
    image:
      'https://firebasestorage.googleapis.com/v0/b/freelancektwine.appspot.com/o/BTS%20JUNGkooK%20Lunulalyra.png?alt=media&token=eae3e45a-bd19-4b99-aad1-7ad9309844d7',
    title: 'BTS',
    subtitle: 'JUNGKOOK',
  },
];

let oldIndex,
  isRevealed = false;

// flip the card and show artwork
function revealArtwork() {
  if (isRevealed) {
    document.getElementById('reveal').innerHTML = 'REVEAL';
    document.getElementById('target').classList.remove('reveal');
    isRevealed = false;
  } else {
    let index = Math.floor(Math.random() * artworks.length);
    if (index === oldIndex) {
      if (index === artworks.length - 1) {
        index = oldIndex - 1;
      } else {
        index = oldIndex + 1;
      }
    }
    oldIndex = index;
    let artwork = artworks[index];
    document.getElementById('artist').innerHTML = artwork.artist;
    document.getElementById('artwork').style.backgroundImage = `url('${artwork.image}')`;
    document.getElementById('attribution').setAttribute('href', artwork.attribution);
    document.getElementById('title').innerHTML = artwork.title;
    document.getElementById('subtitle').innerHTML = artwork.subtitle;
    document.getElementById('reveal').innerHTML = 'BACK';
    document.getElementById('target').classList.add('reveal');
    isRevealed = true;
  }
}

// Show an element
const show = (elem) => {
  // Get the natural height of the element
  elem.classList.add('is-visible'); // Make the element visible
};

// Hide an element
const hide = (elem) => {
  // When the transition is complete, hide it
  elem.classList.remove('is-visible');
};

// Toggle element visibility
const toggle = (elem, target) => {
  // If the element is visible, hide it
  if (!elem.classList.contains('is-visible')) {
    if (target !== '#cards') {
      hide(document.getElementById('cards'));
    }
    if (target !== '#about') {
      hide(document.getElementById('about'));
    }
    if (target !== '#join') {
      hide(document.getElementById('join'));
    }
    show(elem);
  }
};

// Change active view
function changeView(target) {
  // Get the content
  var content = document.querySelector(target);
  if (!content) return;
  // Toggle the content
  toggle(content, target);
}
