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
import { combineNames } from '../../../lib/utils';

/**
 * Props for the relationships header component.
 */
export interface RelationshipsHeaderProps {
  progress?: number;
}

/**
 * Relationships page component.
 */
export const RelationshipsHeader = ({ progress = 0 }: RelationshipsHeaderProps): ReactElement => {
  return (
    <>
      <h1 className='text-left page-title ml-1 text-2xl font-semibold text-gray-900 dark:text-white'>
        Relationship Tracker
      </h1>

      <Accordion
        collapsible
        asChild
        defaultValue='header'
        type='single'>
        <section className='space-y-3'>
          <AccordionItem value='header'>
            <AccordionTrigger className='ml-1 text-xl font-semibold text-gray-900 dark:text-white accordion-trigger'>
              Friendship Progress
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
              </div>
            </AccordionContent>
          </AccordionItem>
        </section>
      </Accordion>
    </>
  )
}
