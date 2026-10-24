import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StoryProvider, useStories } from './context/StoryContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { HomePage } from './components/home/HomePage';
import { DiscoverPage } from './components/discover/DiscoverPage';
import { CommunityView } from './components/community/CommunityView';
import { LibraryView } from './components/library/LibraryView';
import { UserProfileView } from './components/profile/UserProfileView';
import { StoryDetailView } from './components/story/StoryDetailView';
import { ReaderView } from './components/reader/ReaderView';
import { StoryEditorView } from './components/create/StoryEditorView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { WriterProfileView } from './components/writer/WriterProfileView';
import { PaymentModal } from './components/payment/PaymentModal';
import { AuthModal } from './components/auth/AuthModal';
import { LegalModal } from './components/legal/LegalModal';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { IntroModal } from './components/common/IntroModal';
import { ChallengeArenaView } from './components/challenge/ChallengeArenaView';
import { PremiumHubView } from './components/premium/PremiumHubView';
import { InkVaultModal } from './components/inkvault/InkVaultModal';
import { WinnerCertificateModal } from './components/challenge/WinnerCertificateModal';
import { Story } from './types';

type AppScreen =
  | 'home'
  | 'discover'
  | 'community'
  | 'library'
  | 'profile'
  | 'story_detail'
  | 'reader'
  | 'editor'
  | 'admin'
  | 'writer_profile'
  | 'arena'
  | 'premium';

const MainAppContent: React.FC = () => {
  const { currentUser, isFounder } = useAuth();
  const { stories, certificates } = useStories();

  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [selectedStoryId, setSelectedStoryId] = useState<string>('story_atomic_habits');
  const [selectedPartNumber, setSelectedPartNumber] = useState<number>(1);
  const [selectedWriterId, setSelectedWriterId] = useState<string>('usr_author_james_clear');

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentProductType, setPaymentProductType] = useState<'story_unlock' | 'monthly_subscription'>('monthly_subscription');
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);
  const [introModalOpen, setIntroModalOpen] = useState(true);
  const [inkVaultModalOpen, setInkVaultModalOpen] = useState(false);
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);

  const selectedStory = stories.find(s => s.id === selectedStoryId) || stories[0];

  const handleSelectStory = (storyId: string) => {
    setSelectedStoryId(storyId);
    setCurrentScreen('story_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReadPart = (storyId: string, partNumber: number) => {
    setSelectedStoryId(storyId);
    setSelectedPartNumber(partNumber);
    setCurrentScreen('reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenWriterProfile = (authorId: string) => {
    setSelectedWriterId(authorId);
    setCurrentScreen('writer_profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenUpgrade = () => {
    setPaymentProductType('monthly_subscription');
    setPaymentModalOpen(true);
  };

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#26F7F7]/30 selection:text-slate-950">
      {/* Global Header (Hidden during distraction-free reading and editor) */}
      {currentScreen !== 'reader' && currentScreen !== 'editor' && currentScreen !== 'admin' && (
        <Header
          onOpenSearch={() => setCurrentScreen('discover')}
          onOpenNotifications={() => setNotifDrawerOpen(true)}
          onOpenAuth={handleOpenAuth}
          onOpenAdmin={() => setCurrentScreen('admin')}
          onOpenUpgradeModal={handleOpenUpgrade}
          onOpenProfile={() => setCurrentScreen('profile')}
          onOpenIntro={() => setIntroModalOpen(true)}
          onOpenArena={() => {
            setCurrentScreen('arena');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenInkVault={() => setInkVaultModalOpen(true)}
          onOpenPremiumHub={() => {
            setCurrentScreen('premium');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* Screen Views */}
      <main>
        {currentScreen === 'home' && (
          <HomePage
            onSelectStory={handleSelectStory}
            onReadPart={(storyId, partNum) => handleReadPart(storyId, partNum)}
            onOpenWriterProfile={handleOpenWriterProfile}
            onOpenUpgradeModal={handleOpenUpgrade}
            onOpenAdminDashboard={() => setCurrentScreen('admin')}
            onOpenCreateStory={() => setCurrentScreen('editor')}
            onOpenArena={() => {
              setCurrentScreen('arena');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenCertificateModal={() => setCertificateModalOpen(true)}
          />
        )}

        {currentScreen === 'discover' && (
          <DiscoverPage
            onSelectStory={handleSelectStory}
            onOpenWriterProfile={handleOpenWriterProfile}
          />
        )}

        {currentScreen === 'community' && (
          <CommunityView
            onSelectStory={handleSelectStory}
            onOpenUpgradeModal={handleOpenUpgrade}
          />
        )}

        {currentScreen === 'library' && (
          <LibraryView
            onSelectStory={handleSelectStory}
            onReadPart={(storyId, partNum) => handleReadPart(storyId, partNum)}
            onOpenUpgradeModal={handleOpenUpgrade}
          />
        )}

        {currentScreen === 'profile' && (
          <UserProfileView
            onOpenAdmin={() => setCurrentScreen('admin')}
            onOpenUpgradeModal={handleOpenUpgrade}
            onOpenLegal={() => setLegalModalOpen(true)}
            onSelectStory={handleSelectStory}
          />
        )}

        {currentScreen === 'arena' && (
          <ChallengeArenaView
            onSelectStory={handleSelectStory}
            onReadPart={(storyId, partNum) => handleReadPart(storyId, partNum)}
            onOpenCreateStory={() => setCurrentScreen('editor')}
          />
        )}

        {currentScreen === 'premium' && (
          <PremiumHubView
            onOpenUpgradeModal={handleOpenUpgrade}
            onOpenEditor={() => setCurrentScreen('editor')}
            onOpenArena={() => {
              setCurrentScreen('arena');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenInkVault={() => setInkVaultModalOpen(true)}
            onSelectStory={handleSelectStory}
          />
        )}

        {currentScreen === 'story_detail' && selectedStory && (
          <StoryDetailView
            story={selectedStory}
            onBack={() => setCurrentScreen('home')}
            onReadPart={(partNum) => handleReadPart(selectedStory.id, partNum)}
            onOpenWriterProfile={handleOpenWriterProfile}
          />
        )}

        {currentScreen === 'reader' && selectedStory && (
          <ReaderView
            story={selectedStory}
            initialPartNumber={selectedPartNumber}
            onBack={() => setCurrentScreen('story_detail')}
            onOpenStoryDetail={() => setCurrentScreen('story_detail')}
          />
        )}

        {currentScreen === 'editor' && (
          <StoryEditorView
            storyToEdit={undefined}
            onBack={() => setCurrentScreen('home')}
            onSaved={(savedStory) => {
              setSelectedStoryId(savedStory.id);
              setCurrentScreen('story_detail');
            }}
          />
        )}

        {currentScreen === 'admin' && (
          <AdminDashboard
            onBack={() => setCurrentScreen('home')}
            onViewStory={handleSelectStory}
          />
        )}

        {currentScreen === 'writer_profile' && (
          <WriterProfileView
            writerId={selectedWriterId}
            onBack={() => setCurrentScreen('home')}
            onSelectStory={handleSelectStory}
          />
        )}
      </main>

      {/* Global Bottom Navigation (Visible on main tabs) */}
      {(currentScreen === 'home' ||
        currentScreen === 'discover' ||
        currentScreen === 'arena' ||
        currentScreen === 'community' ||
        currentScreen === 'library' ||
        currentScreen === 'profile' ||
        currentScreen === 'premium') && (
        <BottomNav
          currentTab={currentScreen === 'premium' ? 'profile' : currentScreen as any}
          onChangeTab={(tab) => {
            setCurrentScreen(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenCreateStory={() => setCurrentScreen('editor')}
        />
      )}

      {/* Payment Checkout Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        productType={paymentProductType}
        story={selectedStory}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authModalMode}
      />

      {/* Legal & Policy Center Modal */}
      <LegalModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
      />

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={notifDrawerOpen}
        onClose={() => setNotifDrawerOpen(false)}
        onSelectLink={(link) => {
          setNotifDrawerOpen(false);
          if (link.startsWith('/story/')) {
            const id = link.replace('/story/', '');
            handleSelectStory(id);
          }
        }}
      />

      {/* Intro Modal on Open */}
      <IntroModal
        isOpen={introModalOpen}
        onClose={() => setIntroModalOpen(false)}
      />

      {/* InkVault Encrypted Manuscript Storage Modal */}
      <InkVaultModal
        isOpen={inkVaultModalOpen}
        onClose={() => setInkVaultModalOpen(false)}
        onOpenEditor={() => {
          setInkVaultModalOpen(false);
          setCurrentScreen('editor');
        }}
      />

      {/* Champion Certificate Modal */}
      <WinnerCertificateModal
        isOpen={certificateModalOpen}
        onClose={() => setCertificateModalOpen(false)}
        certificate={certificates[0] || null}
        storyTitle="The Chronosphere of Florence"
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <StoryProvider>
        <MainAppContent />
      </StoryProvider>
    </AuthProvider>
  );
}
