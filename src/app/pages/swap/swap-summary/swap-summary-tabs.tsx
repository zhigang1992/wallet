import { Suspense, useState } from 'react';

import { Box, Flex, SlideFade, Stack } from '@stacks/ui';
import type { StackProps } from '@stacks/ui';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { LoadingSpinner } from '@app/components/loading-spinner';
import { Tabs } from '@app/components/tabs';

const analyticsPath = ['/recommended', '/custom'];

interface SwapSummaryTabsProps extends StackProps {
  details: React.JSX.Element;
  status: React.JSX.Element;
}
export function SwapSummaryTabs(props: SwapSummaryTabsProps) {
  const { details, status, ...rest } = props;
  const analytics = useAnalytics();
  const [activeTab, setActiveTab] = useState(0);

  function setActiveTabTracked(index: number) {
    void analytics.page('view', analyticsPath[index]);
    setActiveTab(index);
  }

  return (
    <Stack flexGrow={1} mt="tight" spacing="base" width="100%" {...rest}>
      <Tabs
        tabs={[
          { slug: 'status', label: 'Status' },
          { slug: 'details', label: 'Swap details' },
        ]}
        activeTab={activeTab}
        onTabClick={setActiveTabTracked}
      />
      <Flex position="relative" flexGrow={1}>
        {activeTab === 0 && (
          <Suspense fallback={<LoadingSpinner pb="72px" />}>
            <SlideFade in={true}>
              {styles => (
                <Box style={styles} width="100%">
                  {status}
                </Box>
              )}
            </SlideFade>
          </Suspense>
        )}
        {activeTab === 1 && (
          <Suspense fallback={<LoadingSpinner pb="72px" />}>
            <SlideFade in={true}>
              {styles => (
                <Box width="100%" style={styles}>
                  {details}
                </Box>
              )}
            </SlideFade>
          </Suspense>
        )}
      </Flex>
    </Stack>
  );
}
