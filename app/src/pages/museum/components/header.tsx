// Packages
import type { ReactElement } from 'react';

// Local Imports
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../../components/ui/accordion';
import {
  Card,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { PercentageIndicator } from '../../../components/ui/percentage-indicator';
import { CompletionCard } from '../../../components/cards/completion-card';
import { combineNames } from '../../../lib/utils';

// Types
import type { MuseumWing } from '../../../types/museum';

/**
 * Props for the museum header component.
 */
export interface MuseumHeaderProps {
  /**
   * The wings of the museum.
   */
  wings?: MuseumWing[];

  /**
   * The progress of each museum wing.
   */
  wingItemCounts?: Record<string, number[]>;
}

/**
 * The colors associated with each museum wing.
 */
const WING_COLORS = {
  'archaeology-wing': 'yellow',
  'fish-wing': 'blue',
  'flora-wing': 'green',
  'insects-wing': 'violet',
} as Record<string, string>;

/**
 * Get the overall progress of the museum wings.
 *
 * @param {Record<string, number[]>} wingItemCounts The item counts for each wing.
 * @returns {number} The overall progress as a decimal.
 */
const getProgress = (wingItemCounts: Record<string, number[]>): number => (Object.values(wingItemCounts).reduce((
  acc: number[],
  curr: number[],
) => {
  const [
    done,
    total,
  ] = curr;
  return [
    acc[0] + done,
    acc[1] + total,
  ];
}, [
  0,
  0,
]).reduce((
  acc: number,
  curr: number,
  index: number,
) => {
  if (index === 0) {
    return acc + curr;
  }
  return acc / curr;
}, 0));

/**
 * Museum page component.
 */
export const MuseumHeader = ({
  wings = [] as MuseumWing[],
  wingItemCounts = {} as Record<string, number[]>,
}: MuseumHeaderProps): ReactElement => {
  return (
    <>
      <h1 className='text-left page-title ml-1 text-2xl font-semibold text-foreground'>
        Museum Tracker
      </h1>

      <Accordion
        collapsible
        asChild
        defaultValue='header'
        type='single'>
        <section className='space-y-3'>
          <AccordionItem value='header'>
            <AccordionTrigger className='ml-1 text-xl font-semibold text-foreground accordion-trigger'>
              Museum Completion
            </AccordionTrigger>

            <AccordionContent asChild>
              <div className='grid grid-cols-1 grid-rows-2 gap-4 xl:grid-cols-3 2xl:grid-cols-3'>
                <Card
                  className={combineNames(
                    'col-span-1 row-span-full flex w-full items-center justify-center',
                    getProgress(wingItemCounts) === 1 &&
                      'border-brand/40 bg-brand/15',
                  )}>
                  <div className='flex flex-col items-center p-4'>
                    <CardHeader className='mb-2 flex flex-col items-center justify-between space-y-0 p-0'>
                      <CardTitle className='text-2xl font-semibold'>
                        Total Completion
                      </CardTitle>
                    </CardHeader>

                    <PercentageIndicator
                      percentage={Math.floor(getProgress(wingItemCounts) * 100)}
                      className='h-32 w-32 lg:h-48 lg:w-48' />
                  </div>
                </Card>

                {
                  wings.map((wing) => (
                    <CompletionCard
                      key={wing.id}
                      title={wing.name}
                      description={''}
                      percentage={wingItemCounts[wing.id.replace('-wing', '')] ? Math.floor(wingItemCounts[wing.id.replace('-wing', '')][0] / wingItemCounts[wing.id.replace('-wing', '')][1] * 100) : 0}
                      image={wing.image}
                      color={WING_COLORS[wing.id]}
                      footer={''} />
                  ))
                }
              </div>
            </AccordionContent>
          </AccordionItem>
        </section>
      </Accordion>
    </>
  )
}
