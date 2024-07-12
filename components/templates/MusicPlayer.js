import Player from "../modules/Player"

function MusicPlayer() {
  return (
   <div className='flex justify-center mt-12'>
   <div className='overflow-hidden w-[400px] bg-slate-700 min-h-[300px] rounded-md grid place-items-start'>
        <Player/>
    </div>
   </div>
  )
}

export default MusicPlayer