import bios from './bios';
import DmgMainInstructionSet from './instructionSet';
import RegisterSet from './registerSet';
import runInstruction from './runInstruction';
import { IDmg } from './types';

class Dmg extends EventTarget implements IDmg {
  registers = new RegisterSet();
  instructionSet = DmgMainInstructionSet;

  memory = bios;
  pc = 0;
  sp = 0;
  readPc(): number {
    const ret = this.memory.at(this.pc);
    this.pc += 1;
    return ret;
  }

  step() {
    const opcode = this.readPc();
    runInstruction(this, opcode, this.instructionSet);
  }

  start() {
    while (this.pc < this.memory.length) {
      this.step();
    }
  }

  log: string[] = [];
  logEvent(log: string) {
    this.log.push(log);
    this.dispatchEvent(new Event('log'));
  }
}

export default Dmg;
