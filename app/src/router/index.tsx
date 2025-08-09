// Packages
import {
  Route,
  Routes,
} from 'react-router';

// Local Imports
import FishingAndDiving from '../pages/fishing-and-diving';
import Blacksmithing from '../pages/blacksmithing';
import Relationships from '../pages/relationships';
import CookedDishes from '../pages/cooked-dishes';
import Forageables from '../pages/forageables';
import Furniture from '../pages/furniture';
import Materials from '../pages/materials';
import Artifacts from '../pages/artifacts';
import Ranching from '../pages/ranching';
import Animals from '../pages/animals';
import Player from '../pages/player';
import Quests from '../pages/quests';
import Museum from '../pages/museum';
import Spells from '../pages/spells';
import Skills from '../pages/skills';
import Crops from '../pages/crops';
import Dates from '../pages/dates';
import Home from '../pages/home';
import Bugs from '../pages/bugs';

/**
 * Router component that defines the application's routes.
 *
 * @returns The rendered routes for the application.
 */
function Router() {
  return (
    <Routes>
      <Route
        path='/'
        element={<Home />} />
      
      <Route
        path='/player'
        element={<Player />} />

      <Route
        path='/museum'
        element={<Museum />} />

      <Route
        path='/quests'
        element={<Quests />} />

      <Route
        path='/relationships'
        element={<Relationships />} />

      <Route
        path='/animals'
        element={<Animals />} />

      <Route
        path='/spells'
        element={<Spells />} />

      <Route
        path='/skills'
        element={<Skills />} />

      <Route
        path='/artifacts'
        element={<Artifacts />} />

      <Route
        path='/blacksmithing'
        element={<Blacksmithing />} />

      <Route
        path='/bugs'
        element={<Bugs />} />

      <Route
        path='/cooked-dishes'
        element={<CookedDishes />} />

      <Route
        path='/crops'
        element={<Crops />} />

      <Route
        path='/date-inspiration'
        element={<Dates />} />

      <Route
        path='/fishing-and-diving'
        element={<FishingAndDiving />} />
    
      <Route
        path='/forageables'
        element={<Forageables />} />

      <Route
        path='/furniture'
        element={<Furniture />} />

      <Route
        path='/materials'
        element={<Materials />} />

      <Route
        path='/ranching'
        element={<Ranching />} />
    </Routes>
  );
}

export default Router;
