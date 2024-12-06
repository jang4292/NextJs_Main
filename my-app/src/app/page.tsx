export default function Home() {
  return (
    <div>
      <header className="lg:px-16 px-4 bg-white flex flex-wrap items-center py-4 shadow-md">
        <div className="flex-1 flex justify-between items-center">
          <a href="#" className="text-xl">Company</a>
        </div>


        <label htmlFor="menu-toggle" className="pointer-cursor md:hidden block">
          <svg className="fill-current text-gray-900"
            xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
            <title>menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
          </svg>
        </label>
        <input className="hidden" type="checkbox" id="menu-toggle" />

        <div className="hidden md:flex md:items-center md:w-auto w-full" id="menu">
          <nav>
            <ul className="md:flex items-center justify-between text-base text-gray-700 pt-4 md:pt-0">
              <li><a className="md:p-4 py-3 px-0 block" href="#">Home</a></li>
              <li><a className="md:p-4 py-3 px-0 block" href="#">About</a></li>
              <li><a className="md:p-4 py-3 px-0 block" href="#">Portfolio</a></li>
              <li><a className="md:p-4 py-3 px-0 block md:mb-0 mb-2" href="#">Contact Us</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <div className="flex flex-wrap">
        <div className="w-full sm:w-8/12 mb-10">
          <div className="container mx-auto h-full sm:p-10">
            <nav className="flex px-4 justify-between items-center">
              <div className="text-4xl font-bold">
                Plant<span className="text-green-700">.</span>
              </div>
              <div>
                <img src="https://image.flaticon.com/icons/svg/497/497348.svg" className="w-8" />
              </div>
            </nav>
            <header className="container px-4 lg:flex mt-10 items-center h-full lg:mt-0">
              <div className="w-full">
                <h1 className="text-4xl lg:text-6xl font-bold">Find your <span className="text-green-700">greeny</span> stuff for your room</h1>
                <div className="w-20 h-2 bg-green-700 my-4"></div>
                <p className="text-xl mb-10">Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae maiores neque eaque ea odit placeat, tenetur illum distinctio nulla voluptatum a corrupti beatae tempora aperiam quia id aliquam possimus aut.</p>
                <button className="bg-green-500 text-white text-2xl font-medium px-4 py-2 rounded shadow">Learn More</button>
              </div>
            </header>
          </div>
        </div>
        <img src="https://images.unsplash.com/photo-1536147116438-62679a5e01f2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80" alt="Leafs" className="w-full h-48 object-cover sm:h-screen sm:w-4/12"/>
      </div>
    </div>
  );
}
