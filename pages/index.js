import MusicPlayer from "@/components/templates/MusicPlayer";
import { useRouter } from "next/router";
import { useEffect } from "react";
function index() {
  const router=useRouter();
  useEffect(()=>{
    router.replace('/player/0/1')
  },[])
  return (
  <>
  {/* <MusicPlayer/> */}

  </>
  )
}

export default index