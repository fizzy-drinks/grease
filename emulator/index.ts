import DmgMainInstructionSet from './instructionSet';
import RegisterSet from './registerSet';
import { IDmg } from './types';

class Dmg implements IDmg {
  registers = new RegisterSet();

  instructionSet = DmgMainInstructionSet;

  memory = [0x00, 0xcb, 0x00];
  pc = 0;
  sp = 0;
  readPc(): number {
    const ret = this.memory[this.pc];
    this.pc += 1;
    return ret;
  }

  step() {
    const opcode = this.readPc();
    const instr = this.instructionSet[opcode];
    console.log(instr?.doc);
    instr?.run(this);
  }

  start() {
    while (this.pc <= this.memory.length) {
      this.step();
    }
    console.log('EOF');
  }
}

export default Dmg;
