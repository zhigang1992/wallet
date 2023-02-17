import { useMemo } from 'react';

import { toUnicode } from 'punycode';

import { getAutogeneratedAccountDisplayName } from '@app/common/utils/get-account-display-name';
import {
  useCurrentAccountNames,
  useGetAccountNamesByAddressQuery,
} from '@app/query/stacks/bns/bns.hooks';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { StacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.models';

const parseIfValidPunycode = (s: string) => {
  try {
    return toUnicode(s);
  } catch {
    return s;
  }
};

export function useCurrentAccountDisplayName() {
  const account = useCurrentStacksAccount();
  const { data: names = [] } = useCurrentAccountNames();

  return useMemo(() => {
    if (!account || typeof account?.index !== 'number') return 'Account';
    if (names[0]) return parseIfValidPunycode(names[0]);
    return getAutogeneratedAccountDisplayName(account.index);
  }, [account, names]);
}

export function useAccountDisplayName(account: StacksAccount): string {
  const { data: names = [] } = useGetAccountNamesByAddressQuery(account.address);
  return useMemo(() => {
    if (names[0]) return parseIfValidPunycode(names[0]);
    return getAutogeneratedAccountDisplayName(account.index);
  }, [account, names]);
}
