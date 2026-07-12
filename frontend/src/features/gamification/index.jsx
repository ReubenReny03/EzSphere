import { useSearchParams } from 'react-router-dom';
import { Tabs } from '@/components/ui/Tabs';
import { ChallengesTab } from './ChallengesTab';
import { ChallengeParticipationTab } from './ChallengeParticipationTab';
import { BadgeGallery } from './BadgeGallery';
import { RewardsTab } from './RewardsTab';
import { LeaderboardTab } from './LeaderboardTab';

const TABS = [
  { value: 'challenges', label: 'Challenges' },
  { value: 'participation', label: 'Challenge Participation' },
  { value: 'badges', label: 'Badges' },
  { value: 'rewards', label: 'Rewards' },
  { value: 'leaderboard', label: 'Leaderboard' },
];

const Gamification = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const active = searchParams.get('tab') || 'challenges';

  return (
    <div className="flex flex-col gap-6">
      <Tabs tabs={TABS} active={active} onChange={(tab) => setSearchParams({ tab })} accent="game" />
      {active === 'challenges' && <ChallengesTab />}
      {active === 'participation' && <ChallengeParticipationTab />}
      {active === 'badges' && <BadgeGallery />}
      {active === 'rewards' && <RewardsTab />}
      {active === 'leaderboard' && <LeaderboardTab />}
    </div>
  );
};

export default Gamification;
