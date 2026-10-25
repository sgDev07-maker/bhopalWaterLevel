export function ErrorMessage({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p
      className="rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-800"
      role="alert"
    >
      {message}
    </p>
  );
}
