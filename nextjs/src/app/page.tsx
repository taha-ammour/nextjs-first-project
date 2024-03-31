import Navbar from "@/components/Navbar";
import Top250 from "@/components/Top250";
import Image from "next/image";


export default function Home() {
  return (
    <div className="w-full h-full m-3 ">
      
      <Navbar />
     
      
      <div className="flex justify-center "> 
        <div >go</div>
        <div>
          <Top250/>
        </div>
      </div>

    </div>
  );
}
