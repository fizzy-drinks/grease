import { Instruction, InstructionSet } from './types';

type Register = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'h' | 'l';

// TODO: set flags
const add8 = (source: Register | 'd8' | 'hli'): Instruction => ({
  doc: `ADD a,${source}`,
  run(dmg) {
    switch (source) {
      case 'hli':
        dmg.registers.a += dmg.memory[dmg.registers.hl];
        break;
      case 'd8':
        dmg.registers.a += dmg.readPc();
        break;
      default:
        dmg.registers.a += dmg.registers[source];
    }
  },
});

const ld8 = (
  source: Register | 'hli' | 'd8',
  target: Register | 'hli'
): Instruction => ({
  doc: `LD ${source},${target}`,
  run(dmg) {
    const value =
      source === 'd8'
        ? dmg.readPc()
        : source === 'hli'
        ? dmg.memory[dmg.registers.hl]
        : dmg.registers[source];

    if (target === 'hli') {
      dmg.memory[dmg.registers.hl] = value;
    } else {
      dmg.registers[target] = value;
    }
  },
});

const DmgPrefixedInstructionSet: InstructionSet = {};

const DmgMainInstructionSet: InstructionSet = {
  0x00: { doc: 'NOP', run: () => 0 },
  0x78: ld8('a', 'b'),
  0x79: ld8('a', 'c'),
  0x7a: ld8('a', 'd'),
  0x7b: ld8('a', 'e'),
  0x7c: ld8('a', 'h'),
  0x7d: ld8('a', 'l'),
  0x80: add8('b'),
  0x81: add8('c'),
  0x82: add8('d'),
  0x83: add8('e'),
  0x84: add8('h'),
  0x85: add8('l'),
  0x86: add8('hli'),
  0x87: add8('a'),
  0xc6: add8('d8'),
  0xcb: {
    doc: `PREFIX CB`,
    run(dmg) {
      const opcode = dmg.readPc();
      DmgPrefixedInstructionSet[opcode]?.run(dmg);
    },
  },
};

export default DmgMainInstructionSet;
