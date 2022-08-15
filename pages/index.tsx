import { useState } from 'react';
import OpcodeTable from '../components/OpcodeTable';
import Dmg from '../emulator';

const Home = () => {
  const [dmg, setDmg] = useState<Dmg>();
  const startDmg = () => {
    const dmg = new Dmg();

    dmg.start();

    setDmg(dmg);
  };

  return (
    <main>
      <button onClick={startDmg}>Hello world!</button>
      {dmg && <OpcodeTable dmg={dmg} />}
    </main>
  );
};

export default Home;
