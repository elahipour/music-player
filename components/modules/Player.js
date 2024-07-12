import PlayBtn from "../icons/PlayBtn";
import PauseBtn from "../icons/PauseBtn";
import NextBtn from "../icons/NextBtn";
import PrevBtn from "../icons/PrevBtn";
import { useEffect, useRef, useState } from "react";

function Player() {
  const audioPlayer = useRef();
  const progressBar = useRef();
  const showSeconds=useRef();
  const showDuration=useRef();
  const [second,updateSecond]=useState(0);
  const [minute,updateMinute]=useState(0);
  const [musicIndex, setMusicIndex] = useState(0);
  const [isPlay, updateIsPlay] = useState(true);
  const [music, setMusic] = useState([
    {
      id: 1,
      src: "/musics/Anon-Romance-Anonimo-Juegos-Prohibidos.mp3",
      title: "Anon Romance Anonimo",
    },
    { id: 2, src: "/musics/Carmen.mp3", title: "Carmen" },
    { id: 3, src: "/musics/Ice.mp3", title: "Ice" },
  ]);
  useEffect(() => {
    if (!isPlay) audioPlayer.current.pause();
    else audioPlayer.current.play();
  }, [isPlay]);
  useEffect(() => {
    const interval=setInterval(()=>{
      updateSecond(audioPlayer.current.currentTime.toFixed())
      if(second%60>=59){
      updateMinute(minute=>minute+1)
    }
      showDuration.current.innerText=(audioPlayer.current.duration/60).toFixed()+':'+(audioPlayer.current.duration%60).toFixed();
      progressBar.current.max=audioPlayer.current.duration;
      progressBar.current.value = audioPlayer.current.currentTime.toFixed();
      showSeconds.current.innerText=minute+':'+second%60;
      if(audioPlayer.current.currentTime===audioPlayer.current.duration){
        if (musicIndex < music.length - 1)
        setMusicIndex((musicIndex) => musicIndex + 1);
      else setMusicIndex(0);
        updateMinute(0)
      }
     
    },1000);
    return ()=>clearInterval(interval)
  }, [second]);
  
  useEffect(() => {
   
    audioPlayer.current.src = music[musicIndex].src;
  }, [musicIndex]);

  function handleMusic(btn) {
    if (btn === "next")
      if (musicIndex < music.length - 1)
        setMusicIndex((musicIndex) => musicIndex + 1);
      else setMusicIndex(0);

    if (btn === "prev") {
      if (musicIndex > 0) {
        setMusicIndex((musicIndex) => musicIndex - 1);
      } else {
        setMusicIndex(2);
      }
    }
  }

  return (
    <>
      <div className="p-2 w-full bg-gray-50 flex justify-center gap-2">
        <button onClick={() => handleMusic("prev")}>
          <PrevBtn />
        </button>
        {isPlay ? (
          <button onClick={() => updateIsPlay(!isPlay)}>
            <PauseBtn />
          </button>
        ) : (
          <button onClick={() => updateIsPlay(!isPlay)}>
            <PlayBtn />
          </button>
        )}
        <button onClick={() => handleMusic("next")}>
          <NextBtn />
        </button>
      </div>
      <div>
        <audio ref={audioPlayer} autoPlay>
          <source />
        </audio>
      </div>
      <progress
      id="progress"
        ref={progressBar}
        className="w-full px-2"
      ></progress>
      <div className='flex justify-between w-[95%] rounded-sm px-4 bg-gray-50 mx-auto'>
      <span ref={showSeconds}></span>
      <span ref={showDuration}></span>
      </div>
    </>
  );
}

export default Player;
