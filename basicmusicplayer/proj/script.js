console.log("Let's begin");
let currentSong = new Audio();


function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
    try {
        let a = await fetch("http://192.168.1.7:5500/proj/songs/");
        let response = await a.text();
        let div = document.createElement("div");
        div.innerHTML = response;
        let as = div.getElementsByTagName("a");
        let songs = [];
        for (let index = 0; index < as.length; index++) {
            const element = as[index];
            if (element.href.endsWith(".mp3")) {
                songs.push(element.href.split("/songs/")[1]);
            }
        }
        return songs;
    } catch (error) {
        console.error('Error fetching songs:', error);
        return [];
    }
}

const playMusic = (track) => {
    currentSong.src = "http://192.168.1.7:5500/proj/songs/" + track;
    currentSong.play();
    play.src = "pause.svg"
    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function main() {
    let songs = await getSongs();
    let songUL = document.querySelector(".songList ul");
    for (const song of songs) {
        songUL.innerHTML += `
            <li>
                <img class="invert" src="music.svg" alt="">
                <div class="info">
                    <div>${song}</div>
                    <div>Anish</div>
                </div>
                <div class="playnow">
                    <span>Play Now</span>
                    <img src="play.svg" alt="" class="invert">
                </div>
            </li>`;
    }

    document.querySelectorAll(".songList li").forEach(e => {
        e.addEventListener("click", element => {
            let songName = e.querySelector(".info div:first-child").innerText;
            console.log('Playing:', songName);
            playMusic(songName);
        });
    });
    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "play.svg"
        }
    })

    currentSong.addEventListener("timeupdate", ()=>
    {
        
        document.querySelector(".songtime").innerHTML = `${
            secondsToMinutesSeconds(currentSong.currentTime)
        }/${secondsToMinutesSeconds(currentSong.duration)}`
    })
}

  

main();
