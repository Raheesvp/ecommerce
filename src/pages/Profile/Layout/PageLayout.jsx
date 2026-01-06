const PageLayout = ({ children }) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pt-20 pb-10 px-4  ">
    <div className="max-w-6xl mx-auto mt-15">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {children}
      </div>
    </div>
  </div>
);

export default PageLayout;
