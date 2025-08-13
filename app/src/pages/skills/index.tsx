/* eslint-disable @typescript-eslint/no-explicit-any */
// Packages
import {
  useContext,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactElement
} from 'react';

// Local Imports
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../components/ui/accordion';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '../../components/ui/toggle-group';
import {
  Command,
  CommandInput
} from '../../components/ui/command';
import { SKILL_WING_IMAGES } from '../../config';
import { PlayersContext } from '../../contexts/player';
import { combineNames } from '../../lib/utils';
import { SkillCard } from '../../components/cards/skill-card';
import { InfoCard } from '../../components/cards/info-card';
import { Progress } from '../../components/ui/progress';
import skillsData from '../../data/skills.json';

// Types
import type { Skill } from '../../types/skills';
import clsx from 'clsx';
import { SkillBranchCard } from '../../components/cards/skill-branch-card';

const bubbleColors: Record<string, string> = {
	'0': 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950', // unfound
	'farming': 'border-green-900 bg-green-500/20', // found
  'fishing': 'border-blue-900 bg-blue-500/20', // found
  'archaeology': 'border-orange-900 bg-orange-500/20', // found
  'cooking': 'border-teal-900 bg-teal-500/20', // found
  'ranching': 'border-pink-900 bg-pink-500/20', // found
  'woodcrafting': 'border-yellow-900 bg-yellow-500/20', // found
  'blacksmithing': 'border-purple-900 bg-purple-500/20', // found
  'mining': 'border-black-900 bg-black-500/20', // found
  'combat': 'border-red-900 bg-red-500/20', // found
};

/**
 * Skills page component.
 */
export default function Skills(): ReactElement {
  const {
    player,
    data,
  } = useContext(PlayersContext);

  const [
    skills,
    setSkills,
  ] = useState([] as Skill[]);
  const [
    skillPurchases,
    setSkillPurchases,
  ] = useState({} as Record<string, boolean>);
  const [
    branches,
    setBranches,
  ] = useState([] as Record<string, number | string | number[]>[]);
  const [
    levels,
    setLevels,
  ] = useState({} as Record<string, number>);
  const [
    perkCounts,
    setPerkCounts,
  ] = useState({} as Record<string, number>);

  const [
    _filter,
    setFilter,
  ] = useState('farming');
  const [
    search,
    setSearch,
  ] = useState('');
  const [
    filteredSkills,
    setFilteredSkills,
  ] = useState([] as Skill[][]);

  const [
    open,
    setIsOpen,
  ] = useState(false);
  const [
    object,
    setObject
  ] = useState<any | null>(null);

  // Basic Data
  useMemo(() => {
    const newSkills = [];
    const branches = {} as Record<string, Record<string, number | string | number[]>>;

    for (const skill in (skillsData as Record<string, Skill>)) {
      const category = (skillsData as Record<string, Skill>)[skill].category;

      if (!category) {
        continue;
      }

      const skillData = (skillsData as Record<string, Skill>)[skill];

      if (skillData.id === 'museum-quality-i') {
        skillData.id = 'museum-quality-one';
      } else if (skillData.id === 'museum-quality-ii') {
        skillData.id = 'museum-quality-two';
      }

      newSkills.push(skillData);

      if (category in branches) {
        (branches[category].count as number) = (branches[category].count as number) + 1;
      } else {
        const name = category[0].toUpperCase() + category.slice(1).toLowerCase();

        branches[category] = {
          id: category.toLowerCase().replace(/\s+/g, '-'),
          name: name,
          count: 1,
        };
      }
    }

    setBranches(Object.values(branches));
    setSkills(newSkills);
  }, []);

  // User specific data
  useEffect(() => {
    const levels = {
      fishing: 0,
      archaeology: 0,
      cooking: 0,
      mining: 0,
      combat: 0,
      blacksmithing: 0,
      farming: 0,
      woodcrafting: 0,
      ranching: 0,
    } as Record<string, number>;

    if (data && 't2_world_facts' in data) {
      for (const skill in levels) {
        const key = `${skill}_level`;
        levels[skill] = data && key in data['t2_world_facts'] ? (data['t2_world_facts'] as Record<string, number>)[key] as number : 0;
      }
    }

    const newPerkCounts = {} as Record<string, number>;
    const skillData = (skillsData as Record<string, Skill>);

    const newPurchases = player && 'perks' in player ? player.perks.reduce((
      perks: Record<string, boolean>,
      perk: string
    ) => {
      const perkId = perk.replace(/_/g, '-');

      const skill = skillData[perkId];

      if (skill && 'category' in skill) {
        newPerkCounts[skill.category] = (newPerkCounts[skill.category] || 0) + 1;
      }

      perks[perkId] = true;
      return perks;
    }, {} as Record<string, boolean>) : {};

    setSkillPurchases(newPurchases);
    setPerkCounts(newPerkCounts);
    setLevels(levels);
  }, [
    data,
    player,
  ]);

  // Filters
  useEffect(() => {
    const filtered = skills.filter((skill: Skill) => {
      if (_filter && skill.category !== _filter) {
        return false;
      }

      if (search && !skill.name.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }

      return true;
    });

    const sortedSkills = [] as Skill[][];

    for (const skill of filtered) {
      const tier = skill.tier - 1 || 0;

      while (sortedSkills.length < tier + 1) {
        sortedSkills.push([]);
      }

      sortedSkills[tier].push(skill);
    }

    for (let i = 0; i < sortedSkills.length; i++) {
      sortedSkills[i] = sortedSkills[i].sort((
        a: Skill,
        b: Skill,
      ) => (a.index - b.index));
    }

    setFilteredSkills(sortedSkills);
  }, [
    skills,
    _filter,
    search,
  ])

  return (
    <div className='mx-auto mt-4 w-full space-y-4'>
      <div className='mx-auto mt-4 w-full space-y-4'>
        <h1 className='text-left page-title ml-1 text-2xl font-semibold text-gray-900 dark:text-white'>
          Skills & Mastery
        </h1>

        <Accordion
          collapsible
          asChild
          defaultValue='item-1'
          type='single'>
          <section className='space-y-3'>
            <AccordionItem value='item-1'>
              <AccordionTrigger className='ml-1 text-xl font-semibold text-gray-900 dark:text-white accordion-trigger'>
                Total Progression
              </AccordionTrigger>

              <AccordionContent asChild>
                <div className='grid grid-cols-1 grid-rows-2 gap-4 xl:grid-cols-3 2xl:grid-cols-3'>
                  {
                    branches.map((
                      branch: Record<string, string | number | number[]>,
                      index: number
                    ) => (
                      <SkillBranchCard
                        key={`${branch.id}-${index}`}
                        branch={branch}
                        level={levels[branch.id as string] || 0}
                        perksUnlocked={perkCounts[branch.id as string] ? perkCounts[branch.id as string] : 0}
                        perks={branch.count as number}
                        onClick={(id) => {
                          if (id !== _filter) {
                            setFilter(id === _filter ? 'all' : id);
                          }
                        }} />
                    ))
                  }
                </div>
              </AccordionContent>
            </AccordionItem>
          </section>
        </Accordion>

        <Accordion
          collapsible
          asChild
          defaultValue='item-1'
          type='single'>
          <section className='space-y-3'>
            <AccordionItem value='item-1'>
								<AccordionTrigger className='ml-1 text-xl font-semibold text-gray-900 dark:text-white accordion-trigger'>
									All Perks
								</AccordionTrigger>

								<AccordionContent asChild>
                  <div className='flex w-full flex-col gap-2 md:flex-row md:items-center md:justify-between'>
                    <div className='flex flex-row items-center gap-2'>
                      <ToggleGroup
                        variant='outline'
                        type='single'
                        className='gap-2'
                        value={_filter}
                        onValueChange={(val) => {
                          setFilter(val === _filter ? 'all' : val);
                        }}>
                        {
                          branches.map((branch) => (
                            <ToggleGroupItem
                              value={`${branch.id}`}
                              aria-label={`Show ${branch.name}`}
                              className='toggle-group-item'>
                              <span
                                className={combineNames(
                                  'inline-block h-4 w-4 rounded-full border align-middle',
                                  bubbleColors[branch.id as string] || '',
                                )} />

                              <span className='align-middle'>
                                { branch.name }
                              </span>
                            </ToggleGroupItem>
                          ))
                        }
                      </ToggleGroup>
                    </div>
                  </div>

                  <div className='mt-2 w-full pb-5'>
                    <Command className='w-full border border-b-0 dark:border-neutral-800'>
                      <CommandInput
                        placeholder='Search Perks'
                        onValueChange={(v) => {
                          setSearch(v);
                        }} />
                    </Command>
                  </div>
                  
                  <div className='grid grid-cols-1 gap-4 xl:grid-cols-1'>
                    {
                      filteredSkills.map((
                        tier: Skill[],
                        index: number,
                      ) => (
                        <div
                          className={clsx(
                            'slide-in mb-8',
                            {
                              'faded': tier[0].level > levels[tier[0].category] || 0,
                            },
                          )}
                          style={{
                            '--index': index,
                          } as CSSProperties}>
                          <div className='flex mb-5 items-end'>
                            <h2 className='ml-1 text-xl font-semibold text-gray-900 dark:text-white text-left'>
                              Tier { index + 1 }
                            </h2>

                            <p className='ml-4 pb-[1px] text-sm text-neutral-500 dark:text-neutral-400'>
                              Level { tier[0].level } Required
                            </p>
                          </div>

                          <div className='grid grid-cols-1 gap-4 xl:grid-cols-2'>
                            {
                              tier.map((skill: Skill) => (
                                <SkillCard
                                  key={skill.id}
                                  skill={skill}
                                  setIsOpen={setIsOpen}
                                  setSkill={setObject}
                                  owned={skillPurchases[skill.id] || false} />
                              ))
                            }
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </AccordionContent>
            </AccordionItem>
          </section>
        </Accordion>
      </div>
    </div>
  );
}
