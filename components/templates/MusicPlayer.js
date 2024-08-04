import Player from "../modules/Player"
function MusicPlayer() {
  return (
   <div className='flex justify-center mt-12'>
   <div className='overflow-hidden w-[800px] bg-neutral-600 min-h-[300px] rounded-md grid'>
        <Player/>
    </div>
   </div>
  )
}

export default MusicPlayer