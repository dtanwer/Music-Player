// seclecting all tags

const wrapper = document.querySelector(".wrapper"),
    musicImg = wrapper.querySelector(".img-area img"),
    musicName = wrapper.querySelector(".song-details .name"),
    musicArtist = wrapper.querySelector(".song-details .artist"),
    mainAudio = wrapper.querySelector("#main-audio"),
    playPauseBtn = wrapper.querySelector(".play-pause"),
    prevBtn = wrapper.querySelector("#prev"),
    nextBtn = wrapper.querySelector("#next"),
    progressBar = wrapper.querySelector(".progress-bar"),
    progressArea = wrapper.querySelector(".progress-area"),
    musicList = wrapper.querySelector(".music-list"),
    showMoreBtn = wrapper.querySelector("#more-music"),
    hideMoreBtn = musicList.querySelector("#close");

    //loading random music 
let musicIndex =Math.floor((Math.random() * allMusic.length) + 1);;

window.addEventListener("load", () => {
    loadMusic(musicIndex);
    playingNow();
})

//load function
function loadMusic(indexNumb) {
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = "img/" + allMusic[indexNumb - 1].img + ".jpg";
    mainAudio.src = "song/" + allMusic[indexNumb - 1].src + ".mp3";

}

//play music function
function playMusic() {
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").classList.remove("fa-play");
    playPauseBtn.querySelector("i").classList.add("fa-pause");
    mainAudio.play();
    playingNow();
}

//pause music function
function pauseMusic() {
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").classList.remove("fa-pause");
    playPauseBtn.querySelector("i").classList.add("fa-play");
    mainAudio.pause();
}

//next music function
function nextMusic() {
    musicIndex == allMusic.length ? musicIndex = 1 : musicIndex++;
    loadMusic(musicIndex);
    playMusic();
}

// prev music function
function prevMusic() {
    musicIndex == 1 ? allMusic.length : musicIndex--;
    loadMusic(musicIndex);
    playMusic();
}



//play or pause btn event
playPauseBtn.addEventListener("click", () => {
    const isMusicPaused = wrapper.classList.contains("paused");
    isMusicPaused ? pauseMusic() : playMusic();
});

//next music btn event 
nextBtn.addEventListener("click", () => {
    nextMusic();
});

//prev music btn event 
prevBtn.addEventListener("click", () => {
    prevMusic();
});


// updating progressbar width

mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;

    var progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = progressWidth + "%";


    let musicCurrentTime = wrapper.querySelector(".current"),
        musicDuration = wrapper.querySelector(".duration");

    mainAudio.addEventListener("loadeddata", () => {

        //upadting song duration
        var audioDuration = mainAudio.duration;
        var totalMin = Math.floor(audioDuration / 60);
        var totalsec = Math.floor(audioDuration % 60);
        if (totalsec < 10) {
            totalsec = "0" + totalsec;
        }

        musicDuration.innerText = totalMin + ":" + totalsec;
    });

    //upadting playing song current
    var CurrentMin = Math.floor(currentTime / 60);
    var Currentsec = Math.floor(currentTime % 60);
    if (Currentsec < 10) {
        Currentsec = "0" + Currentsec;
    }

    musicCurrentTime.innerText = CurrentMin + ":" + Currentsec;


});


// update playing song current time according to progress width
progressArea.addEventListener("click", (e) => {
    let progressWidthval = progressArea.clientWidth;
    let clickedOffSetX = e.offsetX;
    let songDuration = mainAudio.duration;
    mainAudio.currentTime = (clickedOffSetX / progressWidthval) * songDuration;
    //mainAudio.play();
});


//repeat button icon
const repeatBtn = wrapper.querySelector("#repeat-plist")
repeatBtn.addEventListener("click", () => {
    var title = repeatBtn.getAttribute("title");
    switch (title) {
        case "repeat":
            repeatBtn.setAttribute("class", "fa-duotone fa-repeat");
            repeatBtn.setAttribute("title", "repeat-1");
            break;
        case "repeat-1":
            repeatBtn.setAttribute("class", "fa-solid fa-shuffle");
            repeatBtn.setAttribute("title", "shuffle");
            break;
        case "shuffle":
            repeatBtn.setAttribute("class", "fa-solid fa-repeat");
            repeatBtn.setAttribute("title", "repeat");
            break;
    }

});


// repeadt btn working after song end
mainAudio.addEventListener("ended", () => {

    var title = repeatBtn.getAttribute("title");
    switch (title) {
        case "repeat":
            nextMusic();
            break;
        case "repeat-1":
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();
            break;
        case "shuffle":
            let randInd = Math.floor((Math.random() * allMusic.length) + 1);
            do {
                randInd = Math.floor((Math.random() * allMusic.length) + 1);
            } while (musicIndex == randInd);

            musicIndex = randInd;
            loadMusic(musicIndex);
            playMusic();
            break;
    }
});

showMoreBtn.addEventListener("click", () => {
    musicList.classList.toggle("show");
});

hideMoreBtn.addEventListener("click", () => {
    showMoreBtn.click();
});

const ulTag = wrapper.querySelector("ul");
for (let i = 0; i < allMusic.length; i++) {

    let liTag = '<li li-index="' + (i + 1) + '"><div class="row"><span>' + allMusic[i].name + '</span><p>' + allMusic[i].artist + '</p> <audio class="' + allMusic[i].src + '" src="song/' + allMusic[i].src + '.mp3"></audio> </div><span id="' + allMusic[i].src + '" class="audio-duration">00:30</span></li>';
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioTagDuration = ulTag.querySelector("#" + allMusic[i].src);
    let liAudioTag = ulTag.querySelector("." + allMusic[i].src);
    liAudioTag.addEventListener("loadeddata", () => {
        //upadting song duration
        var audioDuration = liAudioTag.duration;
        var totalMin = Math.floor(audioDuration / 60);
        var totalsec = Math.floor(audioDuration % 60);
        if (totalsec < 10) {
            totalsec = "0" + totalsec;
        }

        liAudioTagDuration.innerText = totalMin + ":" + totalsec;
        liAudioTagDuration.setAttribute("t-duration",totalMin + ":" + totalsec);
    });
}


// play partuclar song on click 

const allLiTags = ulTag.querySelectorAll("li");
function playingNow() {
    for (let i = 0; i < allLiTags.length; i++) {


        let audioTag=allLiTags[i].querySelector(".audio-duration");
        if(allLiTags[i].classList.contains("playing"))
        {
            allLiTags[i].classList.remove("playing");
            audioTag.innerText=audioTag.getAttribute("t-duration");
        }




        if (allLiTags[i].getAttribute("li-index") == musicIndex) {
            allLiTags[i].classList.add("playing");
            audioTag.innerText="Playing";
        }
        allLiTags[i].setAttribute("onclick", "clicked(this)");
    }
}


//play song with li click

function clicked(element) {
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}



