export default function CircularProgressIndicator() {
  return (
    <div className="flex mt-10 w-full items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full border-4 border-gray-300 border-t-gray-900 h-12 w-12" />
      </div>
    </div>
  );
}
