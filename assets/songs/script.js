let songCounter = 1
let audio = document.getElementById('myAudio');
let pauseButton = document.querySelector('.toggle-play-btn');
let songBar = document.getElementById('song-bar');
let nextSongBtn = document.querySelector('.next-song-btn')
let previousSongBtn = document.querySelector('.previous-song-btn')
let songInterval;
let songTotalLength = document.querySelector('.song-total-length')
let songContainer;
let leftSidebar = document.querySelector('.left-sidebar')
let nowPlayingArtist = document.querySelector('.now-playing-artist')
let nowPlayingSong = document.querySelector('.now-playing-song')
let nowPlayingAlbum = document.querySelector('.now-playing-cover')

document.addEventListener('DOMContentLoaded', function () {


    pauseButton.addEventListener('click', function () {
        if (audio.paused) {
            audio.play();
            pauseButton.firstChild.src = "./assets/imgs/pause.png";
            songInterval = setInterval(songDuration, 1000)
        } else {
            audio.pause();
            clearInterval(songInterval)
            pauseButton.firstChild.src = "./assets/imgs/play.png";
        }

        songContainer[songCounter - 1].firstChild.classList.remove('display-none')
        songContainer[songCounter - 1].querySelector('p').classList.add('display-none')
        songContainer[songCounter].firstChild.classList.add('display-none')
        songContainer[songCounter].querySelector('p').classList.remove('display-none')
    });

    // Update the seek bar as the audio plays
    audio.addEventListener('timeupdate', function () {
        songBar.value = Math.floor(audio.currentTime);
        currentSongTime.innerHTML = Math.floor(audio.currentTime)
    });

    // Update the audio playback position when the seek bar is changed
    songBar.addEventListener('change', function () {
        audio.currentTime = songBar.value;
    });
});


// Control Buttons Interface
nextSongBtn.addEventListener('click', function () {
    clearInterval(songInterval)
    songCounter += 1;
    playSong();
    pauseButton.firstChild.src = "./assets/imgs/pause.png";
});

previousSongBtn.addEventListener('click', function () {
    clearInterval(songInterval)
    if (songCounter > 1)
        songCounter -= 1;
    playSong();
    pauseButton.firstChild.src = "./assets/imgs/pause.png";
});

function playSong() {
    clearInterval(songInterval)
    currentSongMinutes = 0
    currentSongSeconds = 0
    currentSongTime.innerHTML = "0:00"
    songInterval = setInterval(songDuration, 1000)
    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            for (let i = 0; i < data.haydn_profile.length; i++) {
                if (data.haydn_profile[i].song_id == songCounter) {
                    console.log(data.haydn_profile[i].song_file)
                    audio.src = data.haydn_profile[i].song_file;
                    audio.play();
                    audio.addEventListener("loadedmetadata", function () {
                        console.log(audio.duration)
                        let songTotal = Math.floor(audio.duration)
                        let minutes = Math.floor(songTotal / 60)
                        let seconds = songTotal % 60

                        songTotalLength.innerHTML = minutes + ":" + seconds

                    });



                    console.log(songContainer[i].firstChild)
                    songContainer[i].firstChild.classList.remove('display-none')
                    songContainer[i].querySelector('p').classList.add('display-none')
                    songContainer[i - 1].firstChild.classList.add('display-none')
                    songContainer[i - 1].querySelector('p').classList.remove('display-none')
                    nowPlayingArtist.innerHTML = data.haydn_profile[i].artist_name
                    nowPlayingSong.innerHTML = data.haydn_profile[i].song_title
                    nowPlayingAlbum.src = data.haydn_profile[i].album_cover
                }
            }


            for (let i = 0; i < songContainer.length; i++) {
                if (songContainer[i + 1] == songCounter) {
                    console.log(songContainer[i].firstChild)
                    songContainer[i].firstChild.classList.remove('display-none')
                }
            }

        })
        .catch(error => {
            console.error('There was an error', error);
        });


}

let currentSongTime = document.querySelector('.current-song-time')
let currentSongMinutes = 0
let currentSongSeconds = 0



function songDuration() {

}



// let audio = document.getElementById('myAudio');
// let toggleSongBtn = document.querySelector('.toggle-song-btn');

// toggleSongBtn.addEventListener('click', function() {

//         if (audio.paused) {
//             audio.play();
//             toggleSongBtn.textContent = "Pause Music";
//         } else {
//             audio.pause();
//             toggleSongBtn.textContent = "Play Music";
//         }
//     });


window.addEventListener("load", populateSongs)

let songListContainer = document.querySelector('.song-list-container')

function populateSongs() {

    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            for (let i = 0; i < data.haydn_profile.length; i++) {
                let songContainer = document.createElement('div')
                songContainer.classList.add('song-container')

                let songCount = document.createElement('p')
                songCount.innerHTML = data.haydn_profile[i].song_id
                songCount.classList.add('song-count')

                let playBtn = document.createElement('img')

                let soundBarContainer = document.createElement('div')
                soundBarContainer.classList.add('sound-bar-container')

                let soundBarOne = document.createElement('div')
                let soundBarTwo = document.createElement('div')
                let soundBarThree = document.createElement('div')
                let soundBarFour = document.createElement('div')

                soundBarOne.classList.add('sound-bar', 'one')
                soundBarTwo.classList.add('sound-bar', 'two')
                soundBarThree.classList.add('sound-bar', 'three')
                soundBarFour.classList.add('sound-bar', 'four')

                soundBarContainer.appendChild(soundBarOne)
                soundBarContainer.appendChild(soundBarTwo)
                soundBarContainer.appendChild(soundBarThree)
                soundBarContainer.appendChild(soundBarFour)

                soundBarContainer.classList.add('display-none')

                let albumCover = document.createElement('img')
                albumCover.classList.add('album-cover-img')
                albumCover.src = nowPlayingAlbum.src = data.haydn_profile[i].album_cover

                let songDetails = document.createElement('div')
                let songName = document.createElement('p')
                songName.innerHTML = data.haydn_profile[i].song_title
                songName.classList.add('song-name')

                let artistName = document.createElement('p')
                artistName.innerHTML = data.haydn_profile[i].artist_name
                artistName.classList.add('heading-opacity')
                songDetails.appendChild(songName)
                songDetails.appendChild(artistName)

                let albumTitle = document.createElement('p')
                albumTitle.classList.add('heading-opacity')
                albumTitle.innerHTML = data.haydn_profile[i].album_title

                let dateAdded = document.createElement('p')
                dateAdded.classList.add('heading-opacity')
                dateAdded.innerHTML = data.haydn_profile[i].date_added

                let songLength = document.createElement('p')
                songLength.classList.add('heading-opacity')
                songLength.innerHTML = data.haydn_profile[i].length

                songContainer.appendChild(soundBarContainer)
                songContainer.appendChild(songCount)
                songContainer.appendChild(albumCover)
                songContainer.appendChild(songDetails)
                songContainer.appendChild(albumTitle)
                songContainer.appendChild(dateAdded)
                songContainer.appendChild(songLength)

                songListContainer.appendChild(songContainer)

            }



            songContainer = document.querySelectorAll('.song-container')

            console.log(data.haydn_profile[0].song_title)
            console.log(songContainer[2])
        })
        .catch(error => {
            console.error('There was an error', error)
        })
}


// Get the draggable element
const draggableItem = document.querySelector('.width-adjuster');

// Initialize variables to keep track of the position
let startX, isDragging = false;

// Add mousedown event listener to start dragging
draggableItem.addEventListener('mousedown', startDragging);

function startDragging(event) {
  // Calculate the initial position of the mouse
  startX = event.clientX - draggableItem.getBoundingClientRect().left;
  // Update dragging state
  isDragging = true;

  // Add mousemove and mouseup event listeners
  document.addEventListener('mousemove', dragItem);
  document.addEventListener('mouseup', stopDragging);
}

function dragItem(event) {
  if (isDragging) {
    // Calculate the new position of the element
    const newX = event.clientX - startX;
    const minY = 0;
    const maxY = window.innerWidth - draggableItem.offsetWidth;

    // Restrict the item within the window bounds
    const x = Math.max(minY, Math.min(maxY, newX));

    // Set the new position
    console.log(x)
    // draggableItem.style.left = x + 'px';
    if (x > 250) {
        leftSidebar.style.width = "500px"
    } else {
        leftSidebar.style.width = "100px"
    }
  }
}

function stopDragging() {
  // Update dragging state
  isDragging = false;

  // Remove mousemove and mouseup event listeners
  document.removeEventListener('mousemove', dragItem);
  document.removeEventListener('mouseup', stopDragging);
}

