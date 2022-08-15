import { InstructionSet, IDmg } from './types';

const runInstruction = (
  dmg: IDmg,
  opcode: number,
  instructionSet: InstructionSet
) => {
  const instr = instructionSet[opcode];
  if (instr) {
    dmg.logEvent(instr?.doc);
    instr?.run(dmg);
  } else {
    dmg.logEvent(
      `NOT IMPL: 0x${(instructionSet.__PREFIX || '') + opcode.toString(16)}`
    );
  }
};

export default runInstruction;
