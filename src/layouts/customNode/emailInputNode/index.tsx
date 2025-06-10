const EmailInputNode = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="bg-white p-4 rounded-lg shadow-md w-80">
        <h2 className="text-lg font-semibold mb-2">Email Input</h2>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
    </div>
  );
}
export default EmailInputNode;