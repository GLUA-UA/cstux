export default function CreateUserAccessCode({
  accessCode,
  isLoading,
  errorMessage,
  playerName,
}: {
  accessCode: string | null;
  isLoading: boolean;
  errorMessage: string | null;
  playerName: string | null;
}) {
  return (
    <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
      {isLoading && (
        <p className="text-md text-gray-500 text-center">Loading...</p>
      )}
      {errorMessage && (
        <p className="text-md text-red-500 text-center">{errorMessage}</p>
      )}
      {accessCode && (
        <>
          <p className="text-md text-gray-500 text-center">
            Access Code for {playerName}:
          </p>
          <p className="text-4xl font-semibold text-center pt-2">
            {accessCode.substring(0, 4)}-{accessCode.substring(4)}
          </p>
        </>
      )}
    </div>
  );
}
