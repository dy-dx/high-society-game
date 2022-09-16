import luxury1 from './images/luxury-1.jpg';
import luxury2 from './images/luxury-2.jpg';
import luxury3 from './images/luxury-3.jpg';
import luxury4 from './images/luxury-4.jpg';
import luxury5 from './images/luxury-5.jpg';
import luxury6 from './images/luxury-6.jpg';
import luxury7 from './images/luxury-7.jpg';
import luxury8 from './images/luxury-8.jpg';
import luxury9 from './images/luxury-9.jpg';
import luxury10 from './images/luxury-10.jpg';

import prestigeAvantgarde from './images/prestige-avantgarde.jpg';
import prestigeBonvivant from './images/prestige-bonvivant.jpg';
import prestigeJoiedevivre from './images/prestige-joiedevivre.jpg';

import disgraceFauxpas from './images/disgrace-fauxpas.jpg';
import disgracePasse from './images/disgrace-passe.jpg';
import disgraceScandale from './images/disgrace-scandale.jpg';

import { StatusCardId } from './Game';
type Images = {
  [key in StatusCardId]: typeof disgraceFauxpas;
};

const images: Images = {
  [StatusCardId.luxury1]: luxury1,
  [StatusCardId.luxury2]: luxury2,
  [StatusCardId.luxury3]: luxury3,
  [StatusCardId.luxury4]: luxury4,
  [StatusCardId.luxury5]: luxury5,
  [StatusCardId.luxury6]: luxury6,
  [StatusCardId.luxury7]: luxury7,
  [StatusCardId.luxury8]: luxury8,
  [StatusCardId.luxury9]: luxury9,
  [StatusCardId.luxury10]: luxury10,
  [StatusCardId.prestigeAvantgarde]: prestigeAvantgarde,
  [StatusCardId.prestigeBonvivant]: prestigeBonvivant,
  [StatusCardId.prestigeJoiedevivre]: prestigeJoiedevivre,
  [StatusCardId.disgraceFauxpas]: disgraceFauxpas,
  [StatusCardId.disgracePasse]: disgracePasse,
  [StatusCardId.disgraceScandale]: disgraceScandale,
};
export default images;
