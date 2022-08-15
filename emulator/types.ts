import RegisterSet from './registerSet';

interface IDmg {
  registers: RegisterSet;
  instructionSet: InstructionSet;
  memory: Uint8Array;
  pc: number;
  sp: number;
  readPc(): number;
  step(): void;
  log: string[];
  logEvent(log: string): void;
}

type Instruction = {
  doc: string;
  run: (dmg: IDmg) => void;
};

type InstructionSet = { __PREFIX?: string; [addr: number]: Instruction };

export type { IDmg, Instruction, InstructionSet };
