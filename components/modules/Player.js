import musics_list from "@/data";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import PrevBtn from "../icons/PrevBtn";
import PauseBtn from "../icons/PauseBtn";
import PlayBtn from "../icons/PlayBtn";
import NextBtn from "../icons/NextBtn";
import Forward from "../icons/Forward";
import Backward from "../icons/Backward";
import shuffle from "@/helpers/shuffle";

function Player() {
  const router = useRouter();
  const audioPlayer = useRef();
  const inputRange = useRef();

  const [volume, updateVolume] = useState(70);
  const [isShuffle, updateIsShuffle] = useState(false);
  const [shuffledMusicIds, setShuffledMusicIds] = useState([]);
const [recentlyPlayedMusicIds,setRecentlyPlayedMusicIds]=useState([]);
  const [leftOrRemainSwitch, updateLeftOrRemainSwitch] = useState(false);
  const [time, updateTime] = useState({
    leftTime: { second: 0, minute: 0 },
    remainTime: { second: 0, minute: 0 },
    duration: 0,
  });
  const [isPlay, updateIsPlay] = useState(false);
  const getMusicName = () => {
    if(recentlyPlayedMusicIds.length>musics_list.length){
      recentlyPlayedMusicIds.length=musics_list.length;
    }
    const playing = recentlyPlayedMusicIds.length ? recentlyPlayedMusicIds : musics_list;

    const currentMusic = playing.find((music) => music.id === +router.query.musicID);
    if (currentMusic) {
      console.log(currentMusic)
      const currentMusicSrc = `/musics/${currentMusic.category}/${currentMusic.title}.mp3`;
      audioPlayer.current.src = currentMusicSrc;
    }
  };
  function handleSeekChange(e) {
    audioPlayer.current.currentTime = inputRange.current.value;
  }



  function handleMusic(btn) {
    if(shuffledMusicIds.length){
      if (btn === "next") {
        updateIsPlay(true);
        const nextMusicId = getNextMusicIdInShuffle();
        router.replace(`/player/${router.query.category}/${nextMusicId.id}`);
      }
      if (btn === "prev") {
        const prevMusicId = getPrevMusicIdInShuffle();;
        router.replace(`/player/${router.query.category}/${prevMusicId.id}`);
      }
    }else{
       if (btn === "next") {
      updateIsPlay(true);
      const nextMusicId = getNextMusicId();
      router.replace(`/player/${router.query.category}/${nextMusicId}`);
    }
    if (btn === "prev") {
      const prevMusicId = getPrevMusicId();
      router.replace(`/player/${router.query.category}/${prevMusicId}`);
    }
    }
   
  }
  function getNextMusicId() {
    if (isShuffle && shuffledMusicIds.length) return shuffledMusicIds[0].id;
    if (+router.query.musicID < musics_list.length) return +router.query.musicID + 1;
    return 1;
  }
  
  function getPrevMusicId() {
    if (+router.query.musicID > 1) return +router.query.musicID - 1;
    return musics_list.length;
  }
  const handleBackwardForward = (btn) => {
    if (btn === "backward") {
      audioPlayer.current.currentTime = audioPlayer.current.currentTime - 10;
    } else {
      audioPlayer.current.currentTime = audioPlayer.current.currentTime + 10;
    }
  };

  useEffect(() => {
    playPause();
    function playPause() {
      if (isPlay) {
        audioPlayer.current.play();
      } else {
        audioPlayer.current.pause();
      }
    }
  }, [isPlay]);

  useEffect(() => {
    getMusicName();
    const updateInterval = setInterval(() => {
      const audioDuration = audioPlayer.current.duration;
      const currentTime = audioPlayer.current.currentTime;
      const leftTime = calculateTime(currentTime);
      const remainTime = calculateTime(audioDuration - currentTime);
      const duration = formatDuration(audioDuration);
    
      inputRange.current.max = audioDuration;
      inputRange.current.value = currentTime.toFixed();
    
      updateTime({
        remainTime: {
          minute: padZero(remainTime.minute),
          second: padZero(remainTime.second),
          duration,
        },
        leftTime: {
          minute: padZero(leftTime.minute),
          second: padZero(leftTime.second),
          duration,
        },
      });
    
      if (isNearEnd(currentTime, audioDuration)) {
        handleMusic("next");
        clearInterval(updateInterval);
      }
      ()=>clearInterval(updateInterval)
    }, 1000);
    
    // Helper functions
    function calculateTime(time) {
      const minute = Math.floor(time / 60);
      const second = Math.floor(time % 60);
      return { minute, second };
    }
    
    function formatDuration(duration) {
      const minute = Math.floor(duration / 60);
      const second = Math.floor(duration % 60);
      return `${minute} : ${second}`;
    }
    
    function padZero(value) {
      return (value < 10 ? "0" : "") + value;
    }
    
    function isNearEnd(currentTime, duration) {
      return +currentTime.toFixed() + 1 >= +duration.toFixed();
    }
    
   
  }, [router.query.musicID]);
  useEffect(() => {
    audioPlayer.current.volume = volume / 100;
  }, [volume]);
  useEffect(() => {
    if (isShuffle) {
      setShuffledMusicIds([...shuffle(musics_list, 0)]);
    } else {
      setShuffledMusicIds([]);
    }
  }, [isShuffle]);
  // Function to get the next music ID
function getNextMusicIdInShuffle() {
  // If the shuffled music IDs array is empty, shuffle the music IDs
  if (shuffledMusicIds.length === 1) {
    setShuffledMusicIds([...shuffle(musics_list,0)]); // Assume musicIds is an array of music IDs
  }
  // Get the next music ID from the shuffled array
  const nextMusicId = shuffledMusicIds.shift();
  // Add the next music ID to the recently played music IDs array
  setRecentlyPlayedMusicIds([...recentlyPlayedMusicIds,nextMusicId]);

  return nextMusicId;
}
// Function to get the previous music ID
function getPrevMusicIdInShuffle() {
  // If the recently played music IDs array is empty, return null
  if (recentlyPlayedMusicIds.length === 0) {
    return shuffledMusicIds.pop();
  }
  const previousMusicId = recentlyPlayedMusicIds.pop();
  // Get the previous music ID from the recently played music IDs array
  shuffledMusicIds.unshift(previousMusicId)
  
  return previousMusicId;
}
/*



// Function to shuffle the music IDs
function shuffleMusicIds(musicIds) {
  // Use a shuffle algorithm to randomize the order of the music IDs
  // For example, you can use the Fisher-Yates shuffle algorithm
  for (let i = musicIds.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [musicIds[i], musicIds[j]] = [musicIds[j], musicIds[i]];
  }
  shuffledMusicIds = musicIds;
}





// Update the handleMusic function to use the getNextMusicId and getPreviousMusicId functions

*/ 
  return (
    <>
      <div className="px-2 py-4">
        <input
          type="range"
          id="seek"
          onChange={handleSeekChange}
          ref={inputRange}
          className="w-full mx-auto appearance-none rounded-full h-[1px] [-webkit-slider-runnable-track]:red"
        />
        <div className="flex justify-between text-gray-50 select-none">
          <span
            onClick={() => updateLeftOrRemainSwitch(!leftOrRemainSwitch)}
            className="bg-slate-900 p-1 rounded"
          >{`${
            leftOrRemainSwitch ? time.remainTime.minute : time.leftTime.minute
          } : ${
            leftOrRemainSwitch ? time.remainTime.second : time.leftTime.second
          }`}</span>
          <span className="bg-slate-900 p-1 rounded">
            {time.leftTime.duration}
          </span>
        </div>
        <div className="p-2 w-full mt-2 rounded bg-gray-50 flex justify-center gap-2 relative">
          <button
            className={`absolute top-0 right-0  ${
              isShuffle
                ? "shadow-lg bg-stone-400 text-gray-50"
                : "bg-slate-700 text-gray-50 "
            }  rounded p-1 mr-1 mt-1`}
            onClick={() => updateIsShuffle(!isShuffle)}
          >
            shuffle
          </button>
          <button onClick={() => handleBackwardForward("backward")}>
            <Backward />
          </button>
          <button onClick={() => handleMusic("prev")}>
            <PrevBtn />
          </button>
          {isPlay ? (
            <button onClick={() => updateIsPlay(false)}>
              <PauseBtn />
            </button>
          ) : (
            <button onClick={() => updateIsPlay(true)}>
              <PlayBtn />
            </button>
          )}
          <button onClick={() => handleMusic("next")}>
            <NextBtn />
          </button>
          <button onClick={() => handleBackwardForward("forward")}>
            <Forward />
          </button>
          <div className="absolute right-0 bottom-0 bottom-2 right-2 ">
            <input
              max={100}
              min={0}
              value={volume}
              onChange={(e) => updateVolume(e.target.value)}
              type="range"
              id="volume"
              className="appearance-none rounded-full  bg-black h-1"
            />
          </div>
        </div>
      </div>
      <div>
        <div className="flex flex-col gap-2 bg-gray-50">
          {musics_list.map((music) => {
            return (
              <Link
                className="relative border-solid border-b-slate-200 border-b-[1px] flex items-center h-[35px]"
                key={music.id}
                href={`/player/${music.category}/${music.id}`}
              >
                <span>{music.title}</span>
                <progress
                  max={audioPlayer.current?.duration || 0}
                  value={
                    router.query.musicID == music.id
                      ? audioPlayer.current?.currentTime
                      : 0
                  }
                  style={{ backgroundColor: "red" }}
                  className={`left-0 w-full absolute h-full opacity-35`}
                ></progress>
              </Link>
            );
          })}
        </div>
        <audio ref={audioPlayer} autoPlay>
          <source />
        </audio>
      </div>
    </>
  );
}

export default Player;
