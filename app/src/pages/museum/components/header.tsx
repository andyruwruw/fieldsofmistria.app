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
   * The progress of the museum completion.
   */
  progress?: number;

  /**
   * The wings of the museum.
   */
  wings?: MuseumWing[];

  /**
   * The progress of each museum wing.
   */
  wingProgress?: Record<string, number>;
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
 * Museum page component.
 */
export default function MuseumHeader({
  progress = 0,
  wings = [] as MuseumWing[],
  wingProgress = {} as Record<string, number>,
}: MuseumHeaderProps): ReactElement {
  return (
    <>
      <h1 className='text-left page-title ml-1 text-2xl font-semibold text-gray-900 dark:text-white'>
        Museum Tracker
      </h1>

      <Accordion
        collapsible
        asChild
        defaultValue='item-1'
        type='single'>
        <section className='space-y-3'>
            <AccordionItem value='header'>
              <AccordionTrigger className='ml-1 text-xl font-semibold text-gray-900 dark:text-white accordion-trigger'>
                Museum Completion
              </AccordionTrigger>

              <AccordionContent asChild>
                <div className='grid grid-cols-1 grid-rows-2 gap-4 xl:grid-cols-3 2xl:grid-cols-3'>
                  <Card
                    className={combineNames(
                      'col-span-1 row-span-full flex w-full items-center justify-center',
                      progress === 1 &&
                        'border-green-900 bg-green-500/20 dark:border-green-900 dark:bg-green-500/10',
                    )}>
                    <div className='flex flex-col items-center p-4'>
                      <CardHeader className='mb-2 flex flex-col items-center justify-between space-y-0 p-0'>
                        <CardTitle className='text-2xl font-semibold'>
                          Total Completion
                        </CardTitle>
                      </CardHeader>

                      <PercentageIndicator
                        percentage={Math.floor(progress * 100)}
                        className='h-32 w-32 lg:h-48 lg:w-48' />
                    </div>
                  </Card>

                  {
                    wings.map((wing) => (
                      <CompletionCard
                        key={wing.id}
                        title={wing.name}
                        description={''}
                        percentage={wingProgress[wing.id] ? Math.floor(wingProgress[wing.id] * 100) : 0}
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
