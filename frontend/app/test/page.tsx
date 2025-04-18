// app/test/page.tsx
"use client";

export default function TestPage() {
  async function sendTestEmail() {
    const res = await fetch("/api/send", {
      method: "POST",
    });

    const data = await res.json();
    console.log("📨 Email response:", data);
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Test Resend Email</h1>
      <button
        onClick={sendTestEmail}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Send Email
      </button>
    </div>
  );
}
