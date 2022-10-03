import Nav from "./Nav";

const Layout = ({ children }: any) => {
  return (
    <div
      className={`flex flex-col bg-gray-500 border-yellow-400 w-full flex-1 duration-500 ease-in-out`}
    >
      {true && (
        <Nav
          className="w-full flex-1 overflow-hidden"
          //   openSidebar={openSidebar}
          //   hideLogin={showSidebar && minSmallScreen && hideLoginLimit}
        />
      )}
      {/* INDEX - Communities */}
      <div className="flex flex-col bg-zinc-300 border-emerald-400 w-full flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default Layout;
