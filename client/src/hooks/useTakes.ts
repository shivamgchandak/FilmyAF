import { useSelector } from 'react-redux';
import { TAKE_COSTS } from '../redux/slices/takesSlice.js';

export type TakeAction = keyof typeof TAKE_COSTS;

export function useTakes() {
  const { balance, dailyGrant, grant, grantPeriod, anonymous, accumulates, costs, status } =
    useSelector((s: any) => s.takes);

  const known = typeof balance === 'number';

  return {
    balance: known ? (balance as number) : null,
    known,
    loading: status === 'loading',
    dailyGrant,
    /** What this actor is granted: per day for an account, once for a device. */
    grant,
    grantPeriod,
    anonymous,
    accumulates,
    costs: (costs || TAKE_COSTS) as Record<TakeAction, number>,
    cost: (action: TakeAction) => (costs || TAKE_COSTS)[action],
    /** Unknown balance is treated as affordable - the server is the authority
     *  and will refuse with OUT_OF_TAKES if it isn't. */
    canAfford: (action: TakeAction) =>
      !known || (balance as number) >= (costs || TAKE_COSTS)[action],
  };
}
