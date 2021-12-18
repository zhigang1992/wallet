import { PayloadType, StacksTransaction } from '@stacks/transactions';
import { Box, BoxProps, color, Stack } from '@stacks/ui';
import { usePressable } from '@components/item-hover';
import { useExplorerLink } from '@common/hooks/use-explorer-link';
import { stacksValue } from '@common/stacks-utils';
import { getTxSenderAddress } from '@store/accounts/account-activity.utils';
import { StacksTransactionItemIcon } from '@components/tx-icon';
import { SpaceBetween } from '@components/space-between';
import { Caption, Title } from '@components/typography';
import { Tooltip } from '@components/tooltip';
import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';
import { getTxCaption } from '@common/transactions/transaction-utils';

type Tx = MempoolTransaction | Transaction;

interface LocalTxItemProps extends BoxProps {
  transaction: StacksTransaction;
  txid: string;
}
export const LocalTxItem = ({ transaction, txid, ...rest }: LocalTxItemProps) => {
  const [component, bind] = usePressable(true);
  const { handleOpenTxLink } = useExplorerLink();

  if (!transaction) {
    return null;
  }

  const getTxTitle = () => {
    switch (transaction.payload.payloadType) {
      case PayloadType.TokenTransfer:
        return 'Stacks Token';
      case PayloadType.ContractCall:
        return transaction.payload.functionName.content;
      case PayloadType.SmartContract:
        return transaction.payload.contractName.content;
      // this should never be reached
      default:
        return null;
    }
  };

  const value = () => {
    switch (transaction.payload.payloadType) {
      case PayloadType.TokenTransfer:
        return `-${stacksValue({
          value: Number(transaction.payload.amount),
          withTicker: false,
        })}`;

      case PayloadType.ContractCall:
      // TODO: this is a good improvement to have, currently we do not show the asset amount transfered, but we can!
      // return transaction.payload.functionName.content === 'transfer'
      //   ? cvToValue(transaction.payload.functionArgs[0])
      //   : null;
      case PayloadType.SmartContract:
      default:
        return null;
    }
  };

  const txCaption = () => {
    switch (transaction.payload.payloadType) {
      case PayloadType.TokenTransfer:
        return getTxCaption({
          tx_type: 'token_transfer',
          tx_id: txid,
        } as Tx);
      case PayloadType.ContractCall:
        return getTxCaption({
          tx_type: 'contract_call',
          contract_call: {
            contract_id: `.${transaction.payload.contractName.content}`,
          },
        } as unknown as Tx);
      case PayloadType.SmartContract:
        return getTxCaption({
          tx_type: 'smart_contract',
          smart_contract: {
            contract_id: `${getTxSenderAddress(transaction)}.${
              transaction.payload.contractName.content
            }`,
          },
        } as unknown as Tx);
      // this should never be reached
      default:
        return null;
    }
  };

  return (
    <Box position="relative" cursor="pointer" {...bind} {...rest}>
      <Stack
        alignItems="center"
        spacing="base-loose"
        isInline
        position="relative"
        zIndex={2}
        onClick={() => handleOpenTxLink(txid, `&submitted=true`)}
      >
        <StacksTransactionItemIcon transaction={transaction} />
        <SpaceBetween flexGrow={1}>
          <Stack spacing="base-tight">
            <Title as="h3" fontWeight="normal">
              {getTxTitle()}
            </Title>
            <Stack isInline flexWrap="wrap">
              <Caption variant="c2">{txCaption()}</Caption>
              <Tooltip
                placement="bottom"
                label={
                  'This transaction has been broadcast, but is not yet visible in the mempool.'
                }
              >
                <Caption variant="c2" color={color('text-caption')}>
                  Submitted
                </Caption>
              </Tooltip>
            </Stack>
          </Stack>
          <Stack alignItems="flex-end" spacing="base-tight">
            {value() && (
              <Title as="h3" fontWeight="normal">
                {value()}
              </Title>
            )}
          </Stack>
        </SpaceBetween>
      </Stack>
      {component}
    </Box>
  );
};
