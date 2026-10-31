import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StoryProvider, useStories } from './context/StoryContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
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
import { LexoraAchievementCertificateModal } from './components/certificate/LexoraAchievementCertificateModal';
import { JoinCommunityModal } from './components/community/JoinCommunityModal';
import { HelpCenterModal } from './components/help/HelpCenterModal';
import { BirthdayWishModal } from './components/common/BirthdayWishModal';
import { WelcomeGateModal } from './components/auth/WelcomeGateModal';
import { GuestRestrictedModal } from './components/auth/GuestRestrictedModal';
import { GoldenLibraryView } from './components/golden/GoldenLibraryView';
import { LiteraryPassportView } from './components/passport/LiteraryPassportView';
import { Story } from './types';

export type AppScreen =
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
  | 'premium'
  | 'golden_library'
  | 'literary_passport';

const MainAppContent: React.FC = () => {
  const {
    currentUser,
    isFounder,
    isBirthdayToday,
    birthdayGreetingShown,
    dismissBirthdayGreeting,
  } = useAuth();
  const { stories, certificates } = useStories();
  const { theme, isDark } = useTheme();

  // Navigation History Stack for consistent, reliable Back navigation
  const [screenHistory, setScreenHistory] = useState<AppScreen[]>(['home']);
  const currentScreen = screenHistory[screenHistory.length - 1] || 'home';

  const navigateTo = useCallback((screen: AppScreen) => {
    setScreenHistory(prev => {
      if (prev[prev.length - 1] === screen) return prev;
      return [...prev, screen];
    });
    // Sync browser history state
    if (typeof window !== 'undefined' && window.history) {
      window.history.pushState({ screen }, '', `#${screen}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goBack = useCallback(() => {
    setScreenHistory(prev => {
      if (prev.length <= 1) return ['home'];
      return prev.slice(0, prev.length - 1);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Listen for browser / Android system back events
  useEffect(() => {
    const handlePopState = () => {
      setScreenHistory(prev => (prev.length <= 1 ? ['home'] : prev.slice(0, prev.length - 1)));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [selectedStoryId, setSelectedStoryId] = useState<string>('story_beyond_the_loop');
  const [selectedPartNumber, setSelectedPartNumber] = useState<number>(1);
  const [selectedWriterId, setSelectedWriterId] = useState<string>('usr_founder_shreyanshu');
  const [storyToEdit, setStoryToEdit] = useState<Story | null>(null);

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentProductType, setPaymentProductType] = useState<'story_unlock' | 'monthly_subscription'>('monthly_subscription');
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);
  const [introModalOpen, setIntroModalOpen] = useState(false);
  const [inkVaultModalOpen, setInkVaultModalOpen] = useState(false);
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);
  const [achievementCertOpen, setAchievementCertOpen] = useState(false);
  const [joinCommunityModalOpen, setJoinCommunityModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  // Guest Restricted Action Modal
  const [guestRestrictedModalOpen, setGuestRestrictedModalOpen] = useState(false);
  const [attemptedActionTitle, setAttemptedActionTitle] = useState('');
  const [pendingRedirectScreen, setPendingRedirectScreen] = useState<AppScreen | null>(null);

  // Mandatory 1-Time Welcome Login/Signup Gate for first-time visitors
  const [welcomeGateOpen, setWelcomeGateOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    const hasSavedUser = Boolean(localStorage.getItem('lexora_currentUser'));
    const shown = localStorage.getItem('lexora_welcome_onboarding_shown') === 'true';
    return !hasSavedUser && !shown;
  });

  const selectedStory = stories.find(s => s.id === selectedStoryId) || stories[0];

  // Guest check helper
  const requireAuthForAction = (actionTitle: string, targetScreen?: AppScreen): boolean => {
    if (currentUser) return true;
    setAttemptedActionTitle(actionTitle);
    if (targetScreen) setPendingRedirectScreen(targetScreen);
    setGuestRestrictedModalOpen(true);
    return false;
  };

  const handleSelectStory = (storyId: string) => {
    setSelectedStoryId(storyId);
    navigateTo('story_detail');
  };

  const handleReadPart = (storyId: string, partNumber: number) => {
    // If reading beyond preview (e.g. part > 1), require account
    if (partNumber > 1 && !currentUser) {
      requireAuthForAction(`Read Chapter ${partNumber}`, 'reader');
      return;
    }
    setSelectedStoryId(storyId);
    setSelectedPartNumber(partNumber);
    navigateTo('reader');
  };

  const handleOpenWriterProfile = (authorId: string) => {
    setSelectedWriterId(authorId);
    navigateTo('writer_profile');
  };

  const handleOpenUpgrade = () => {
    setPaymentProductType('monthly_subscription');
    setPaymentModalOpen(true);
  };

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleOpenGoldenLibrary = () => {
    if (!requireAuthForAction('Golden Library', 'golden_library')) return;
    navigateTo('golden_library');
  };

  const handleOpenLiteraryPassport = () => {
    if (!requireAuthForAction('Literary Passport', 'literary_passport')) return;
    navigateTo('literary_passport');
  };

  const handleOpenCreateStory = () => {
    if (!requireAuthForAction('Publishing Studio', 'editor')) return;
    setStoryToEdit(null);
    navigateTo('editor');
  };

  const handleOpenProfile = () => {
    if (!requireAuthForAction('Member Profile', 'profile')) return;
    navigateTo('profile');
  };

  const handleOpenAdmin = () => {
    if (!isFounder) {
      alert('Exclusive Administrator access is restricted to verified CEO mishrashreyanshu11@gmail.com.');
      return;
    }
    navigateTo('admin');
  };

  // On successful auth, if user was blocked by guest restriction, navigate to intended screen
  useEffect(() => {
    if (currentUser && pendingRedirectScreen) {
      navigateTo(pendingRedirectScreen);
      setPendingRedirectScreen(null);
    }
  }, [currentUser, pendingRedirectScreen, navigateTo]);

  return (
    <div
      className={`min-h-screen font-sans overflow-x-hidden transition-colors ${
        isDark
          ? 'bg-[#000000] text-slate-100 selection:bg-[#D4AF37]/30 selection:text-amber-100'
          : 'bg-[#ffffff] text-slate-900 selection:bg-[#26F7F7]/30 selection:text-cyan-950'
      }`}
    >
      {/* Global Header */}
      {currentScreen !== 'reader' && currentScreen !== 'editor' && currentScreen !== 'admin' && (
        <Header
          onOpenSearch={() => navigateTo('discover')}
          onOpenNotifications={() => setNotifDrawerOpen(true)}
          onOpenAuth={handleOpenAuth}
          onOpenAdmin={handleOpenAdmin}
          onOpenUpgradeModal={handleOpenUpgrade}
          onOpenProfile={handleOpenProfile}
          onOpenIntro={() => setIntroModalOpen(true)}
          onOpenArena={() => navigateTo('arena')}
          onOpenInkVault={() => {
            if (!requireAuthForAction('InkVault Storage')) return;
            setInkVaultModalOpen(true);
          }}
          onOpenPremiumHub={() => navigateTo('premium')}
          onOpenGoldenLibrary={handleOpenGoldenLibrary}
          onOpenLiteraryPassport={handleOpenLiteraryPassport}
          onOpenLegal={() => setLegalModalOpen(true)}
          onOpenCertificateModal={() => setAchievementCertOpen(true)}
          onOpenEliteCardModal={() => {
            setPaymentProductType('monthly_subscription');
            setPaymentModalOpen(true);
          }}
          onOpenCommunity={() => setJoinCommunityModalOpen(true)}
          onOpenHelpCenter={() => setHelpModalOpen(true)}
          currentScreen={currentScreen}
          onNavigate={(screen) => navigateTo(screen)}
        />
      )}

      {/* Screen Views with Back Navigation */}
      <main>
        {currentScreen === 'home' && (
          <HomePage
            onSelectStory={handleSelectStory}
            onReadPart={(storyId, partNum) => handleReadPart(storyId, partNum)}
            onOpenWriterProfile={handleOpenWriterProfile}
            onOpenUpgradeModal={handleOpenUpgrade}
            onOpenAdminDashboard={handleOpenAdmin}
            onOpenCreateStory={handleOpenCreateStory}
            onOpenArena={() => navigateTo('arena')}
            onOpenCertificateModal={() => setAchievementCertOpen(true)}
            onOpenEliteCardModal={() => {
              setPaymentProductType('monthly_subscription');
              setPaymentModalOpen(true);
            }}
            onOpenAuth={handleOpenAuth}
            onEditStory={(story) => {
              if (!requireAuthForAction('Edit Story', 'editor')) return;
              setStoryToEdit(story);
              navigateTo('editor');
            }}
            onOpenGoldenLibrary={handleOpenGoldenLibrary}
            onOpenLiteraryPassport={handleOpenLiteraryPassport}
            onOpenLegal={() => setLegalModalOpen(true)}
            onOpenHelpCenter={() => setHelpModalOpen(true)}
          />
        )}

        {currentScreen === 'discover' && (
          <DiscoverPage
            onBack={goBack}
            onSelectStory={handleSelectStory}
            onOpenWriterProfile={handleOpenWriterProfile}
          />
        )}

        {currentScreen === 'community' && (
          <CommunityView
            onBack={goBack}
            onSelectStory={handleSelectStory}
            onOpenUpgradeModal={handleOpenUpgrade}
          />
        )}

        {currentScreen === 'library' && (
          <LibraryView
            onBack={goBack}
            onSelectStory={handleSelectStory}
            onReadPart={(storyId, partNum) => handleReadPart(storyId, partNum)}
            onOpenUpgradeModal={handleOpenUpgrade}
          />
        )}

        {currentScreen === 'profile' && (
          <UserProfileView
            onBack={goBack}
            onOpenAdmin={handleOpenAdmin}
            onOpenUpgradeModal={handleOpenUpgrade}
            onOpenLegal={() => setLegalModalOpen(true)}
            onSelectStory={handleSelectStory}
            onReadPart={(storyId, partNum) => handleReadPart(storyId, partNum)}
            onOpenHelpCenter={() => setHelpModalOpen(true)}
            onOpenCommunity={() => setJoinCommunityModalOpen(true)}
            onOpenCreateStory={handleOpenCreateStory}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentScreen === 'arena' && (
          <ChallengeArenaView
            onBack={goBack}
            onSelectStory={handleSelectStory}
            onReadPart={(storyId, partNum) => handleReadPart(storyId, partNum)}
            onOpenCreateStory={handleOpenCreateStory}
          />
        )}

        {currentScreen === 'premium' && (
          <PremiumHubView
            onBack={goBack}
            onOpenUpgradeModal={handleOpenUpgrade}
            onOpenEditor={handleOpenCreateStory}
            onOpenArena={() => navigateTo('arena')}
            onOpenInkVault={() => {
              if (!requireAuthForAction('InkVault Storage')) return;
              setInkVaultModalOpen(true);
            }}
            onSelectStory={handleSelectStory}
          />
        )}

        {currentScreen === 'story_detail' && selectedStory && (
          <StoryDetailView
            story={selectedStory}
            onBack={goBack}
            onReadPart={(partNum) => handleReadPart(selectedStory.id, partNum)}
            onOpenWriterProfile={handleOpenWriterProfile}
            onOpenAuth={handleOpenAuth}
            onEditStory={(story) => {
              if (!requireAuthForAction('Edit Story', 'editor')) return;
              setStoryToEdit(story);
              navigateTo('editor');
            }}
          />
        )}

        {currentScreen === 'reader' && selectedStory && (
          <ReaderView
            story={selectedStory}
            initialPartNumber={selectedPartNumber}
            onBack={goBack}
            onOpenStoryDetail={() => navigateTo('story_detail')}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentScreen === 'editor' && (
          <StoryEditorView
            storyToEdit={storyToEdit || undefined}
            onBack={goBack}
            onSaved={(savedStory) => {
              setStoryToEdit(null);
              setSelectedStoryId(savedStory.id);
              navigateTo('story_detail');
            }}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentScreen === 'admin' && (
          isFounder ? (
            <AdminDashboard
              onBack={goBack}
              onViewStory={handleSelectStory}
            />
          ) : (
            <div className="max-w-md mx-auto p-12 text-center text-slate-300 space-y-4">
              <p className="text-amber-400 font-serif font-bold text-lg">Administrative Console Restricted</p>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                The LEXORA Executive Console is reserved exclusively for Founder &amp; CEO Shreyanshu Mishra (<span className="text-amber-300 font-mono">mishrashreyanshu11@gmail.com</span>).
              </p>
              <button
                onClick={goBack}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-[#f3ba38] text-black font-serif font-bold text-xs cursor-pointer shadow-md"
              >
                Return to Previous Section
              </button>
            </div>
          )
        )}

        {currentScreen === 'writer_profile' && (
          <WriterProfileView
            writerId={selectedWriterId}
            onBack={goBack}
            onSelectStory={handleSelectStory}
          />
        )}

        {currentScreen === 'golden_library' && (
          <GoldenLibraryView
            onBack={goBack}
            onSelectStory={handleSelectStory}
            onReadPart={(storyId, partNum) => handleReadPart(storyId, partNum)}
            onOpenUpgradeModal={handleOpenUpgrade}
          />
        )}

        {currentScreen === 'literary_passport' && (
          <LiteraryPassportView
            onBack={goBack}
            onSelectStory={handleSelectStory}
            onReadPart={(storyId, partNum) => handleReadPart(storyId, partNum)}
            onOpenUpgradeModal={handleOpenUpgrade}
            onOpenAuth={handleOpenAuth}
          />
        )}
      </main>

      {/* Global Bottom Navigation (Visible on main tabs) */}
      {(currentScreen === 'home' ||
        currentScreen === 'discover' ||
        currentScreen === 'community' ||
        currentScreen === 'library' ||
        currentScreen === 'profile' ||
        currentScreen === 'premium' ||
        currentScreen === 'golden_library') && (
        <BottomNav
          currentTab={currentScreen === 'premium' ? 'profile' : currentScreen === 'golden_library' ? 'library' : currentScreen as any}
          onChangeTab={(tab) => navigateTo(tab)}
          onOpenCreateStory={handleOpenCreateStory}
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

      {/* Official Community Hub Modal (WhatsApp & Instagram) */}
      <JoinCommunityModal
        isOpen={joinCommunityModalOpen}
        onClose={() => setJoinCommunityModalOpen(false)}
      />

      {/* Concierge & Help Center Modal */}
      <HelpCenterModal
        isOpen={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
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
          navigateTo('editor');
        }}
      />

      {/* Champion Certificate Modal (Permanent Black & Gold Exception) */}
      <WinnerCertificateModal
        isOpen={certificateModalOpen}
        onClose={() => setCertificateModalOpen(false)}
        certificate={certificates[0] || null}
        storyTitle="Beyond the Loop"
      />

      {/* Black & Gold Achievement Certificate (Permanent Black & Gold Exception) */}
      <LexoraAchievementCertificateModal
        isOpen={achievementCertOpen}
        onClose={() => setAchievementCertOpen(false)}
        defaultRecipientName={currentUser?.displayName || 'Shreyanshu Mishra'}
        categoryCompleted="Serialized Literature & Philosophy"
        storiesCount={40}
      />

      {/* Birthday Celebration Wish from Founder Shreyanshu Mishra */}
      {currentUser && isBirthdayToday && !birthdayGreetingShown && (
        <BirthdayWishModal
          isOpen={true}
          onClose={dismissBirthdayGreeting}
          userName={currentUser.displayName}
        />
      )}

      {/* Mandatory Welcome Login/Sign Up Gate for First-Time Visitors */}
      <WelcomeGateModal
        isOpen={welcomeGateOpen}
        onClose={() => setWelcomeGateOpen(false)}
        onOpenLogin={() => {
          setWelcomeGateOpen(false);
          handleOpenAuth('login');
        }}
        onOpenRegister={() => {
          setWelcomeGateOpen(false);
          handleOpenAuth('register');
        }}
      />

      {/* Restricted Guest Modal: "Unlock the World of LEXORA" */}
      <GuestRestrictedModal
        isOpen={guestRestrictedModalOpen}
        attemptedActionTitle={attemptedActionTitle}
        onClose={() => setGuestRestrictedModalOpen(false)}
        onOpenLogin={() => handleOpenAuth('login')}
        onOpenRegister={() => handleOpenAuth('register')}
      />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <StoryProvider>
            <MainAppContent />
          </StoryProvider>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
