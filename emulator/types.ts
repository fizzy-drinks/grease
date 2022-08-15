import RegisterSet from './registerSet';

interface IDmg {
  registers: RegisterSet;
  instructionSet: InstructionSet;
  memory: number[];
  pc: number;
  sp: number;
  readPc(): number;
  step(): void;
}

type Instruction = {
  doc: string;
  run: (dmg: IDmg) => void;
};

type InstructionSet = { [addr: number]: Instruction };

export type { IDmg, Instruction, InstructionSet };
