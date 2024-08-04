import MusicPlayer from "@/components/templates/MusicPlayer";
import { useRouter } from "next/router";
function MusicID() {
    const router=useRouter();
  return (
    <div>
        <MusicPlayer/>
    </div>
  )
}

export default MusicID