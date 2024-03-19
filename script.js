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
let rightSidebar = document.querySelector('.right-sidebar')
let nowPlayingArtist = document.querySelector('.now-playing-artist')
let nowPlayingSong = document.querySelector('.now-playing-song')
let nowPlayingAlbum = document.querySelector('.now-playing-cover')
let playSongBtnList;
let songProgressionBar = document.querySelector('.visible-progression')
let currentMinutes = 0
let songProgressionTracker = 0
let bigPlayBtn = document.querySelector('.big-play-btn')
let songStarted = false;
let volumeSlider = document.getElementById("volume");
let volumeProgression = document.querySelector('.volume-progression')
let playlistLength = 0


// Volume Controls
volumeSlider.addEventListener("input", function () {
    let volumeValue = this.value;

    audio.volume = volumeValue / 100;
    volumeProgression.style.width = volumeValue + "%"
});

// Update the seek bar as the audio plays
audio.addEventListener('timeupdate', function () {
    let currentSeconds = Math.floor(audio.currentTime)
    if (currentSeconds < 10) {
        currentSongTime.innerHTML = "0:0" + currentSeconds
    } else {
        currentSongTime.innerHTML = "0:" + currentSeconds
    }
    let conversionCounter = 0;

    audio.addEventListener("loadedmetadata", function () {
        

    })
    conversionCounter = 100 / audio.duration
    songProgressionTracker = audio.currentTime * conversionCounter
    songProgressionBar.style.width = songProgressionTracker + "%"
    songBar.value = audio.currentTime
});


songBar.addEventListener('change', function () {
    audio.currentTime = songBar.value;

});

bigPlayBtn.addEventListener('click', function () {
    if (!songStarted) {
        playSong()
        bigPlayBtn.firstChild.src = "./assets/imgs/pause.png";
        pauseButton.firstChild.src = "./assets/imgs/pause.png";
        songStarted = true
    } else {
        if (audio.paused) {
            audio.play();
            bigPlayBtn.firstChild.src = "./assets/imgs/pause.png";
            pauseButton.firstChild.src = "./assets/imgs/pause.png";
        } else {
            audio.pause();
            clearInterval(songInterval)
            pauseButton.firstChild.src = "./assets/imgs/play.png";
            bigPlayBtn.firstChild.src = "./assets/imgs/play.png";
        }
    }
})

pauseButton.addEventListener('click', function () {
    if (!songStarted) {
        playSong()
        bigPlayBtn.firstChild.src = "./assets/imgs/pause.png";
        pauseButton.firstChild.src = "./assets/imgs/pause.png";
        songStarted = true

    } else {
        if (audio.paused) {
            audio.play();
            bigPlayBtn.firstChild.src = "./assets/imgs/pause.png";
            pauseButton.firstChild.src = "./assets/imgs/pause.png";
        } else {
            audio.pause();
            clearInterval(songInterval)
            pauseButton.firstChild.src = "./assets/imgs/play.png";
            bigPlayBtn.firstChild.src = "./assets/imgs/play.png";
        }
    }

});


audio.addEventListener('ended', function () {
    if (songCounter == playlistLength) {
        songCounter = 1;
    } else {
        songCounter += 1;
    }
    playSong()
});


// Control Buttons Interface
nextSongBtn.addEventListener('click', function () {
    clearInterval(songInterval)
    if (songCounter == playlistLength) {
        songCounter = 1;
    } else {
        songCounter += 1;
    }
    
    playSong();
    pauseButton.firstChild.src = "./assets/imgs/pause.png";
    console.log(songCounter)
});

previousSongBtn.addEventListener('click', function () {
    clearInterval(songInterval)
    if (songCounter > 1){
        songCounter -= 1;
    }
    playSong();
    pauseButton.firstChild.src = "./assets/imgs/pause.png";
});

function soundWaves() {
    for (let i = 0; i < songContainer.length; i++) {
        songContainer[i].firstChild.classList.add('display-none')
        songContainer[i].querySelector('p').classList.remove('display-none')
        songContainer[i].querySelector('.song-name').style.color = 'white'
        if (i == songCounter - 1) {
            songContainer[i].firstChild.classList.remove('display-none')
            songContainer[i].querySelector('p').classList.add('display-none')
            songContainer[i].querySelector('.song-name').style.color = '#1de763'
        }
    }



}


// Play Song Functionality
function playSong() {
    rightSidebar.classList.add('right-sidebar-width')
    soundWaves()
    songStarted = true
    clearInterval(songInterval)
    nowPlayingAlbum.style.opacity = 1
    bigPlayBtn.firstChild.src = "./assets/imgs/pause.png";
    pauseButton.firstChild.src = "./assets/imgs/pause.png";
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

            playlistLength = data.haydn_profile.length

            for (let i = 0; i < data.haydn_profile.length; i++) {
                if (data.haydn_profile[i].song_id == songCounter) {
                    audio.src = data.haydn_profile[i].song_file;
                    audio.play();

                    audio.addEventListener("loadedmetadata", function () {

                        let songTotal = Math.floor(audio.duration)
                        let minutes = Math.floor(songTotal / 60)
                        let seconds = songTotal % 60
                        songBar.max = Math.floor(audio.duration);

                        if (songTotal < 60) {
                            songTotalLength.innerHTML = minutes + ":" + seconds
                        } else {
                            songTotalLength.innerHTML = minutes + ":0" + seconds
                        }


                    });


                    nowPlayingArtist.innerHTML = data.haydn_profile[i].artist_name
                    nowPlayingSong.innerHTML = data.haydn_profile[i].song_title
                    nowPlayingAlbum.src = data.haydn_profile[i].album_cover
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

                let playBtn = document.createElement('button')
                let playBtnImg = document.createElement('img')
                playBtnImg.src = "./assets/imgs/white-play-btn.png"
                playBtn.appendChild(playBtnImg)
                playBtn.classList.add("play-song-btn")
                playBtn.value = data.haydn_profile[i].song_id

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
                albumCover.src = data.haydn_profile[i].album_cover

                let songDetails = document.createElement('div')
                let songName = document.createElement('a')
                songName.innerHTML = data.haydn_profile[i].song_title
                songName.classList.add('song-name')
                songName.href = data.haydn_profile[i].link
                if (data.haydn_profile[i].link != "#") {
                    songName.target = "_blank"
                }


                let artistName = document.createElement('p')
                artistName.innerHTML = data.haydn_profile[i].artist_name
                artistName.classList.add('heading-opacity')
                songDetails.appendChild(songName)
                songDetails.appendChild(artistName)

                let albumTitle = document.createElement('p')
                albumTitle.classList.add('heading-opacity', 'album-title')
                albumTitle.innerHTML = data.haydn_profile[i].album_title

                let dateAdded = document.createElement('p')
                dateAdded.classList.add('heading-opacity', 'date-added')
                dateAdded.innerHTML = data.haydn_profile[i].date_added

                let songLength = document.createElement('p')
                songLength.classList.add('heading-opacity', 'song-length')
                songLength.innerHTML = data.haydn_profile[i].length

                songContainer.appendChild(soundBarContainer)
                songContainer.appendChild(songCount)
                songContainer.appendChild(playBtn)
                songContainer.appendChild(albumCover)
                songContainer.appendChild(songDetails)
                songContainer.appendChild(albumTitle)
                songContainer.appendChild(dateAdded)
                songContainer.appendChild(songLength)

                songListContainer.appendChild(songContainer)

            }



            songContainer = document.querySelectorAll('.song-container')
            playSongBtnList = document.querySelectorAll('.play-song-btn')


            playSongBtnList.forEach(function (btn) {
                btn.addEventListener('click', function () {
                    songCounter = parseInt(btn.value);
                    songStarted = true
                    playSong()
                });
            });

        })
        .catch(error => {
            console.error('There was an error', error)
        })
}




let draggableItem = document.querySelector('.width-adjuster');

let startX, isDragging = false;

draggableItem.addEventListener('mousedown', startDragging);

function startDragging(event) {
    startX = event.clientX - draggableItem.getBoundingClientRect().left;
    isDragging = true;

  
    document.addEventListener('mousemove', dragItem);
    document.addEventListener('mouseup', stopDragging);
}

function dragItem(event) {
    if (isDragging) {

        let newX = event.clientX - startX;
        let minY = 0;
        let maxY = window.innerWidth - draggableItem.offsetWidth;

        let x = Math.max(minY, Math.min(maxY, newX));



        if (x > 250) {
            leftSidebar.style.width = "500px"
        } else {
            leftSidebar.style.width = "100px"
        }
    }
}

function stopDragging() {
    isDragging = false;

    document.removeEventListener('mousemove', dragItem);
    document.removeEventListener('mouseup', stopDragging);
}

