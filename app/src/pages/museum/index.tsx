// Packages
import {
  useContext,
  useEffect,
  useState,
  type ReactElement,
} from 'react';

// Local Imports
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../components/ui/accordion';
import { PlayersContext } from '../../contexts/player';
import museumData from '../../data/museum.json';
import SetAccordion from './components/set-accordion';
import type { FieldsOfMistriaSetCompletion } from '../../types/fields-of-mistria/game-stats';
import type { MuseumSet } from '../../types/museum';

/**
 * Museum page component.
 */
export default function Museum(): ReactElement {
  const { data, stats } = useContext(PlayersContext);

  const wings = museumData.wings;
  const sets = museumData.sets;

  const [
    archaeologySets,
    setArchaeologySets,
  ] = useState(sets['archaeology-wing'] as MuseumSet[]);
  const [
    fishSets,
    setFishSets,
  ] = useState(sets['fish-wing'] as MuseumSet[]);
  const [
    floraSets,
    setFloraSets,
  ] = useState(sets['flora-wing'] as MuseumSet[]);
  const [
    insectSets,
    setInsectSets,
  ] = useState(sets['insects-wing'] as MuseumSet[]);

  const [
    progress,
    setProgress,
  ] = useState({});
  const [
    completions,
    setCompletions,
  ] = useState({});

  useEffect(() => {
    setArchaeologySets(sets['archaeology-wing'] as MuseumSet[]);
    setFishSets(sets['fish-wing'] as MuseumSet[]);
    setFloraSets(sets['flora-wing'] as MuseumSet[]);
    setInsectSets(sets['insects-wing'] as MuseumSet[]);
  }, [sets]);

  useEffect(() => {
    const progress = {} as Record<string, boolean>;

    if (data && data.museum_progress) {
      for (let i = 0; i < data.museum_progress.length; i += 1) {
        progress[data.museum_progress[i]] = true;
      }
    }

    setProgress(progress);

    const done = {} as Record<string, Record<string, boolean>>;

    if (stats && stats.set_completions) {
      for (let i = 0; i < stats.set_completions.length; i += 1) {
        const wing = stats.set_completions[i].wing;
        const set = stats.set_completions[i].set.replace(/_+/g, '-').toLowerCase();

        if (!(stats.set_completions[i].wing in done)) {
          done[stats.set_completions[i].wing] = {};
        }

        done[wing][set] = true;
      }

      setCompletions(done);
    }
  }, [
    data,
    stats,
  ]);
  
  return (
    <>
      <div className='mx-auto mt-4 w-full space-y-4'>
        <h1 className='text-left page-title ml-1 text-2xl font-semibold text-gray-900 dark:text-white'>
          Museum Tracker
        </h1>

        <Accordion
          type='single'
          collapsible
          defaultValue='item-1'
          asChild>
          <section className='space-y-3'>
            <AccordionItem value='item-1'>
              <AccordionTrigger className='accordion-trigger ml-1 pt-0 text-xl font-semibold text-gray-900 dark:text-white'>
                Archaeology Wing
              </AccordionTrigger>

              <AccordionContent>
                <div className='grid grid-cols-1 gap-4 xl:grid-cols-2'>
                  {archaeologySets.map((set: MuseumSet) => (
                    <SetAccordion
                      key={set.id}
                      set={set}
                      items={progress}
                      done={completions} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </section>
        </Accordion>

        <Accordion
          type='single'
          collapsible
          defaultValue='item-1'
          asChild>
          <section className='space-y-3'>
            <AccordionItem value='item-1'>
              <AccordionTrigger className='accordion-trigger ml-1 pt-0 text-xl font-semibold text-gray-900 dark:text-white'>
                Fish Wing
              </AccordionTrigger>

              <AccordionContent>
                <div className='grid grid-cols-1 gap-4 xl:grid-cols-2'>
                  {fishSets.map((set: MuseumSet) => (
                    <SetAccordion
                      key={set.id}
                      set={set}
                      items={progress}
                      done={completions} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </section>
        </Accordion>

        <Accordion
          type='single'
          collapsible
          defaultValue='item-1'
          asChild>
          <section className='space-y-3'>
            <AccordionItem value='item-1'>
              <AccordionTrigger className='accordion-trigger ml-1 pt-0 text-xl font-semibold text-gray-900 dark:text-white'>
                Flora Wing
              </AccordionTrigger>

              <AccordionContent>
                <div className='grid grid-cols-1 gap-4 xl:grid-cols-2'>
                  {floraSets.map((set: MuseumSet) => (
                    <SetAccordion
                      key={set.id}
                      set={set}
                      items={progress}
                      done={completions} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </section>
        </Accordion>

        <Accordion
          type='single'
          collapsible
          defaultValue='item-1'
          asChild>
          <section className='space-y-3'>
            <AccordionItem value='item-1'>
              <AccordionTrigger className='accordion-trigger ml-1 pt-0 text-xl font-semibold text-gray-900 dark:text-white'>
                Insects Wing
              </AccordionTrigger>

              <AccordionContent>
                <div className='grid grid-cols-1 gap-4 xl:grid-cols-2'>
                  {insectSets.map((set: MuseumSet) => (
                    <SetAccordion
                      key={set.id}
                      set={set}
                      items={progress}
                      done={completions} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </section>
        </Accordion>
      </div>
    </>
  );
}
