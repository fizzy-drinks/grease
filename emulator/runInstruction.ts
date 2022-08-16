import { InstructionSet, IDmg } from './types';

const runInstruction = (
  dmg: IDmg,
  addr: number,
  opcode: number,
  instructionSet: InstructionSet
) => {
  const instr = instructionSet[opcode];
  const addrRef = addr.toString(16).padStart(4, '0');
  if (instr) {
    dmg.logEvent(`$${addrRef} ${instr?.doc}`);
    instr?.run(dmg);
  } else {
    dmg.logEvent(
      `$${addrRef} NOT IMPL: 0x${
        (instructionSet.__PREFIX || '') + opcode.toString(16)
      }`
    );
  }
};

export default runInstruction;
