import Image from "next/image";

export default function LoginPage() {
  return (
    <main className=" flex justify-center items-center h-screen bg-gradient-to-tl from-gray-600/50 to-purple-900">
      <div className="bg-[#d4d5f3]/80 rounded-lg p-8 shadow-xl shadow-gray-800/50 lg:pr-80 relative" >
        <div className="text-center mb-8">
          <h1 className=" text-2xl font-bold mt-4 bg-clip-text text-transparent bg-gradient-to-r from-red-800 to-orange-400  ">Sign In</h1>
        </div>
        <div className="absolute space-x-0 -z-10 aspect-square w-full max-w-lg rounded-full bg-blue-400/80 blur-3xl filter"></div>
        <div className="">
          
          <Image
            src="/vercel.svg"
            alt="Vercel Logo"
            className="dark:invert hidden lg:block absolute top-20 right-20 mt-4 mr-4 "
            width={100}
            height={24}
            priority
          />
        </div>
        <form method="POST" action="" className="">
          <div className="flex flex-col mb-7 font-semibold">
            <label htmlFor="email" className="text-sm text-center ">Email</label>
            <input type="email"
              id="email"
              name="email"
              className="border rounded-lg p-2"
              placeholder="Enter your email" />

          </div>
          <div className="flex flex-col mb-7 font-semibold">
            <label htmlFor="password" className="text-sm text-center ">password</label>
            <input type="password"
              id="password"
              name="password"
              className="border rounded-lg p-2 "
              placeholder="password" />
            <div className="absolute top-5 left-1/2 transform -translate-x-1/2 flex items-center justify-center rounded-full bg-gray-950 w-2 h-2">
              <span className="animate-ping absolute rounded-full bg-gray-950 w-2 h-2"></span>
              <span className="absolute rounded-full bg-gray-950 w-2 h-2"></span>
            </div>

          </div>
          <div className="flex flex-col mb-7">
            <input type="submit" className=" cursor-pointer bg-slate-800 ring-2 ring-offset-1 ring-teal-950 ring-offset-gray-300 hover:ring-offset-gray-500 hover:bg-slate-900 text-white py-2 px-4 rounded-lg hover:m-3 transition-all duration-200 ease-in-out hover:shadow-lg hover:shadow-black" />

          </div>
        </form>
      </div>
    </main>
  );
}
