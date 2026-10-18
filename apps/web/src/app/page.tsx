'use client';

import { useEffect, useState } from 'react';

type HealthResponse = {
  status: string;
  database: string;
};

export default function Home() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function checkApi() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/health`,
        );

        if (!response.ok) {
          throw new Error(`Falha ao verificar a API (HTTP ${response.status}).`);
        }

        const data: HealthResponse = await response.json();

        setHealth(data);
      } catch {
        setError(true);
      }
    }

    void checkApi();
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Bamak Portal</h1>

      <div className="mt-6">
        {health && (
          <p>
            API: {health.status} / Banco: {health.database}
          </p>
        )}

        {error && <p>Não foi possível conectar à API.</p>}

        {!health && !error && <p>Verificando API...</p>}
      </div>
    </main>
  );
}