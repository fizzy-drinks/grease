import { useState } from 'react';
import OpcodeTable from '../components/OpcodeTable';
import Dmg from '../emulator';

const Home = () => {
  const [dmg, setDmg] = useState<Dmg>();
  const [log, setLog] = useState<string[]>([]);
  const startDmg = () => {
    const dmg = new Dmg();

    dmg.addEventListener('log', () => setLog(dmg.log));
    dmg.start();

    setDmg(dmg);
  };

  return (
    <main>
      <button onClick={startDmg}>Hello world!</button>
      {dmg && <OpcodeTable dmg={dmg} />}
      <pre>{log.join('\n')}</pre>
    </main>
  );
};

export default Home;
