// Packages
import {
  useState,
  type ReactElement,
} from 'react';

// Local Imports
import { PageLayout } from '../../components/layouts/page';
import artifactsData from '../../data/artifacts.json';

// Types
import type { Artifact } from '../../types/museum';
import { ArtifactsHeader } from './components/header';

/**
 * Artifacts page component.
 */
export default function Artifacts(): ReactElement {
  const [
    artifacts,
    setArtifacts
  ] = useState(Object.values(artifactsData) as Artifact[]);
  
  return (
    <PageLayout>
      <ArtifactsHeader progression={0} />
    </PageLayout>
  );
}
