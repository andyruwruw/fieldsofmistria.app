import type { MuseumSet } from '../../../types/museum';

const SET_ID_MAPPING = {
  'buried': 'mine',
  'tide-cavern': 'tide-caverns',
  'dig-site': 'common-finds',
  'multi-season': 'multi-season-fish',
  'spring-crop': 'spring-crops',
  'summer-crop': 'summer-crops',
  'fall-crop': 'fall-crops',
  'winter-crop': 'winter-crops',
  'spring-flower': 'spring-flowers',
  'summer-flower': 'summer-flowers',
  'fall-flower': 'fall-flowers',
  'winter-flower': 'winter-flowers',
};

export const museumSetIdResolver = (set: MuseumSet) => {
  return `${set.wing}-${set.id}`;
};
