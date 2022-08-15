import { FC } from 'react';
import Dmg from '../emulator';

const OpcodeTable: FC<{ dmg: Dmg }> = ({ dmg }) => (
  <table style={{ whiteSpace: 'nowrap' }}>
    <tbody>
      {[null, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0xa, 0xb, 0xc, 0xd, 0xe, 0xf].map(
        (h) => (
          <tr key={h}>
            <td style={{ border: 'black 1px solid' }}>
              {h != null && h.toString(16) + 'x'}
            </td>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0xa, 0xb, 0xc, 0xd, 0xe, 0xf].map(
              (l) => (
                <td key={l} style={{ border: 'black 1px solid' }}>
                  {h == null
                    ? 'x' + l.toString(16)
                    : dmg.instructionSet[(h << 4) + l]?.doc}
                </td>
              )
            )}
          </tr>
        )
      )}
    </tbody>
  </table>
);

export default OpcodeTable;
