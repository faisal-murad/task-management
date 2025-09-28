// app/page.tsx
export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-4xl font-bold mb-4">Welcome to MyApp</h1>
      <p className="text-lg mb-8">
        The easiest way to manage your groceries and deliveries.
      </p>
      <div className="flex gap-4">
        <a
          href="/login"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Login
        </a>
        <a
          href="/signup"
          className="text-black px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Sign Up
        </a>
      </div>
    </main>
  );
}
