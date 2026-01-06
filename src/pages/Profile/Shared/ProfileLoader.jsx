const ProfileLoader = () => {
  return (
    <div className="flex flex-col gap-6 p-8 animate-pulse">
      {/* Avatar */}
      <div className="w-24 h-24 rounded-full bg-gray-700" />

      {/* Name */}
      <div className="h-6 w-48 bg-gray-700 rounded" />

      {/* Info rows */}
      <div className="space-y-4">
        <div className="h-4 w-full bg-gray-700 rounded" />
        <div className="h-4 w-5/6 bg-gray-700 rounded" />
        <div className="h-4 w-2/3 bg-gray-700 rounded" />
      </div>
    </div>
  );
};

export default ProfileLoader;
