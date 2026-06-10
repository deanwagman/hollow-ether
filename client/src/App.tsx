import { useSessionController } from './game/useSessionController';

export default function App() {
  const { session, isPending, isError, sceneLabel } = useSessionController();

  return (
    <main>
      <h1>Hollow Ether</h1>
      <p>Layout rebuild in progress.</p>
      {isPending && <p>Loading session…</p>}
      {isError && <p>Could not reach the server.</p>}
      {session && <p>Scene: {sceneLabel}</p>}
    </main>
  );
}
