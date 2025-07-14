import { Link } from 'react-router-dom';

function NavMenu() {
  return (
    <nav className=" text-gray-800 p-4 flex items-center justify-between">
      <div className="left">
        <Link to="/" className="text-2xl font-bold hover:text-black no-underline">
          Snipr
        </Link>
      </div>
      <div className="navbar-center">
        <ul className="flex space-x-6">
          <li>
            <Link to="/" className="hover:text-black no-underline">
              Home
            </Link>
          </li>
          <li>
            <Link to="/liked" className="hover:text-black no-underline">
              Liked
            </Link>
          </li>
          <li>
            <Link to="/disliked" className="hover:text-black no-underline">
              Disliked
            </Link>
          </li>
          <li>
            <Link to="/read_later" className="hover:text-black no-underline">
              Read later
            </Link>
          </li>
        </ul>
      </div>
      <div className="right">
        <ul className="flex items-center space-x-2">
          <li>
            <input
              type="search"
              placeholder="Search..."
              className="px-2 py-1 rounded-md border-2 border-amber-300 bg-white text-gray-800 focus:outline-none focus:border-amber-500"
            />
          </li>
          <li>
            <button className="p-2 rounded-full hover:bg-amber-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavMenu;