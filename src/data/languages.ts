export type SupportedLanguageCode =
  | 'en'
  | 'hi'
  | 'or'
  | 'ta'
  | 'te'
  | 'kn'
  | 'ml'
  | 'bho'
  | 'gu'
  | 'fr'
  | 'zh-CN'
  | 'es'
  | 'bn'
  | 'mr'
  | 'pa'
  | 'ru'
  | 'pt';

export interface SupportedLanguage {
  code: SupportedLanguageCode;
  name: string;
  nativeName: string;
  script: string;
  fontClass?: string;
  flag: string;
  welcomeSnippet: string;
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    script: 'Latin',
    flag: '🇬🇧',
    welcomeSnippet: 'Beyond the Loop',
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    script: 'Devanagari',
    flag: '🇮🇳',
    welcomeSnippet: 'शब्दों की अपनी सत्ता',
  },
  {
    code: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    script: 'Odia',
    flag: '🇮🇳',
    welcomeSnippet: 'ଶବ୍ଦର ଅସୀମ ମୂଲ୍ୟ',
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    script: 'Tamil',
    flag: '🇮🇳',
    welcomeSnippet: 'வார்த்தைகளின் அற்புதம்',
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    script: 'Telugu',
    flag: '🇮🇳',
    welcomeSnippet: 'అక్షరాల అనంత విశ్వం',
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    script: 'Kannada',
    flag: '🇮🇳',
    welcomeSnippet: 'ಸಾಹಿತ್ಯದ ಅನಂತ ಲೋಕ',
  },
  {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    script: 'Malayalam',
    flag: '🇮🇳',
    welcomeSnippet: 'വാക്കുകളുടെ സ്വന്തം ഗൃഹം',
  },
  {
    code: 'bho',
    name: 'Bhojpuri',
    nativeName: 'भोजपुरी',
    script: 'Devanagari',
    flag: '🇮🇳',
    welcomeSnippet: 'अपने माटी के शब्द',
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    script: 'Gujarati',
    flag: '🇮🇳',
    welcomeSnippet: 'શબ્દોની ખરી કિંમત',
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    script: 'Latin',
    flag: '🇫🇷',
    welcomeSnippet: 'Au-delà de la boucle',
  },
  {
    code: 'zh-CN',
    name: 'Mandarin Chinese',
    nativeName: '简体中文',
    script: 'Simplified Han',
    flag: '🇨🇳',
    welcomeSnippet: '超越常规，字字生辉',
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    script: 'Latin',
    flag: '🇪🇸',
    welcomeSnippet: 'Más allá del bucle',
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    script: 'Bengali',
    flag: '🇮🇳',
    welcomeSnippet: 'শব্দের অনন্য সৃষ্টি',
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    script: 'Devanagari',
    flag: '🇮🇳',
    welcomeSnippet: 'शब्दांची भव्य सृष्टी',
  },
  {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    script: 'Gurmukhi',
    flag: '🇮🇳',
    welcomeSnippet: 'ਸ਼ਬਦਾਂ ਦੀ ਆਪਣੀ ਦੁਨੀਆ',
  },
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    script: 'Cyrillic',
    flag: '🇷🇺',
    welcomeSnippet: 'За гранью привычного',
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    script: 'Latin',
    flag: '🇵🇹',
    welcomeSnippet: 'Além do ciclo',
  },
];

export const LANGUAGE_MAP = new Map<SupportedLanguageCode, SupportedLanguage>(
  SUPPORTED_LANGUAGES.map((l) => [l.code, l])
);

export function getLanguageName(code: string): string {
  const lang = LANGUAGE_MAP.get(code as SupportedLanguageCode);
  return lang ? `${lang.name} (${lang.nativeName})` : code;
}

// -----------------------------------------------------------------------------
// UI Translations Dictionary for Home Menu & Navigation in all 15 Languages
// -----------------------------------------------------------------------------

export interface UiDictionary {
  home: string;
  library: string;
  write: string;
  explore: string;
  profile: string;
  tagline: string;
  startWriting: string;
  readMasterpiece: string;
  elitePass: string;
  community: string;
  helpCenter: string;
  readListen: string;
  voiceAudiobook: string;
  languageSelect: string;
  noChallenges: string;
  poetry?: string;
  stories?: string;
  essays?: string;
  arena?: string;
  searchPlaceholder?: string;
  login?: string;
  signUp?: string;
  back?: string;
  
  // Writing Studio
  writingStudio?: string;
  editPiece?: string;
  publish?: string;
  publishNow?: string;
  saveDraft?: string;
  chapterTitle?: string;
  wordCount?: string;
  minRead?: string;
  fontStyle?: string;
  fontSize?: string;
  eliteEmojis?: string;
  coverArtwork?: string;
  replaceCover?: string;
  uploadCover?: string;
  workTitle?: string;
  synopsisPrologue?: string;
  aiAssistant?: string;
  
  // Profile & Author
  myProfile?: string;
  editProfile?: string;
  editDob?: string;
  myWrittenWorks?: string;
  listeningLibrary?: string;
  signOut?: string;
  requestFeature?: string;
  featureInReview?: string;
  featured?: string;
  withdraw?: string;
  noBio?: string;
  cardholderName?: string;
  vipEliteActive?: string;
  previewReady?: string;
  
  // Discovery
  featuredStories?: string;
  curatedWorks?: string;
  curatedDiscoveries?: string;
  allCategories?: string;
  
  // Auth
  signIn?: string;
  createAccount?: string;
  guestVisitor?: string;
  continueAsGuest?: string;
  password?: string;
  
  // Golden & Passport
  goldenLibrary?: string;
  literaryPassport?: string;
  
  [key: string]: string | undefined;
}

export const UI_TRANSLATIONS: Record<SupportedLanguageCode, UiDictionary> = {
  en: {
    home: 'Home',
    library: 'Library',
    write: 'Write',
    explore: 'Explore',
    profile: 'Profile',
    tagline: 'Beyond the Loop!',
    startWriting: 'Start Writing',
    readMasterpiece: 'Read Masterpiece',
    elitePass: 'Elite Pass',
    community: 'Community',
    helpCenter: 'Help Center',
    readListen: 'Read & Listen',
    voiceAudiobook: 'Listen with LEXORA Voice',
    languageSelect: 'Display Language',
    noChallenges: 'No Recent Challenges! Stay Tuned',
    poetry: 'Poetry',
    stories: 'Stories',
    essays: 'Essays',
    arena: 'Arena',
    searchPlaceholder: 'Search stories, poems, authors...',
    login: 'Login',
    signUp: 'Sign Up',
    back: 'Back',
    writingStudio: 'Writing Studio',
    editPiece: 'Edit Piece',
    publish: 'Publish',
    publishNow: 'Publish Now',
    saveDraft: 'Save Draft',
    chapterTitle: 'Chapter Title',
    wordCount: 'words',
    minRead: 'min read',
    fontStyle: 'Style',
    fontSize: 'Size',
    eliteEmojis: 'Elite Emojis',
    coverArtwork: 'Cover Artwork',
    replaceCover: 'Replace Cover',
    uploadCover: 'Upload Cover',
    workTitle: 'Work Title',
    synopsisPrologue: 'Synopsis / Prologue',
    aiAssistant: 'AI Literary Assistant',
    myProfile: 'My Profile',
    editProfile: 'Edit Profile & Bio',
    editDob: 'Edit DOB',
    myWrittenWorks: 'My Written Stories & Manuscripts',
    listeningLibrary: 'My Listening Library',
    signOut: 'Sign Out',
    requestFeature: 'Request Feature',
    featureInReview: 'Feature In Review',
    featured: 'Featured',
    withdraw: 'Withdraw',
    noBio: 'No bio added yet.',
    cardholderName: 'Cardholder Name',
    vipEliteActive: 'VIP ELITE ACTIVE',
    previewReady: 'PREVIEW READY',
    featuredStories: 'Featured Stories',
    curatedWorks: 'Curated Works',
    curatedDiscoveries: 'Curated Discoveries',
    allCategories: 'All Categories',
    signIn: 'Sign In',
    createAccount: 'Create Account',
    guestVisitor: 'Guest Visitor',
    continueAsGuest: 'Continue as Guest',
    password: 'Password',
    goldenLibrary: 'Golden Library',
    literaryPassport: 'Literary Passport',
  },
  hi: {
    home: 'होम',
    library: 'पुस्तकालय',
    write: 'लिखें',
    explore: 'अन्वेषण',
    profile: 'प्रोफ़ाइल',
    tagline: 'बियॉन्ड द लूप!',
    startWriting: 'लिखना शुरू करें',
    readMasterpiece: 'मास्टरपीस पढ़ें',
    elitePass: 'एलीट पास',
    community: 'समुदाय',
    helpCenter: 'सहायता केंद्र',
    readListen: 'पढ़ें और सुनें',
    voiceAudiobook: 'लेक्सोरा वॉइस से सुनें',
    languageSelect: 'भाषा चुनें',
    noChallenges: 'कोई हालिया चुनौती नहीं! बने रहें',
  },
  or: {
    home: 'ମୂଳପୃଷ୍ଠା',
    library: 'ପାଠାଗାର',
    write: 'ଲେଖନ୍ତୁ',
    explore: 'ଅନ୍ୱେଷଣ',
    profile: 'ପ୍ରୋଫାଇଲ୍',
    tagline: 'ବିୟଣ୍ଡ ଦ ଲୁପ୍!',
    startWriting: 'ଲେଖିବା ଆରମ୍ଭ କରନ୍ତୁ',
    readMasterpiece: 'କାଳଜୟୀ ରଚନା ପଢ଼ନ୍ତୁ',
    elitePass: 'ଏଲିଟ୍ ପାସ୍',
    community: 'ସମ୍ପ୍ରଦାୟ',
    helpCenter: 'ସହାୟତା କେନ୍ଦ୍ର',
    readListen: 'ପଢ଼ନ୍ତୁ ଏବଂ ଶୁଣନ୍ତୁ',
    voiceAudiobook: 'ଲେକ୍ସୋରା ଭଏସରେ ଶୁଣନ୍ତୁ',
    languageSelect: 'ଭାଷା ବାଛନ୍ତୁ',
    noChallenges: 'କୌଣସି ଚ୍ୟାଲେଞ୍ଜ ନାହିଁ! ସାଙ୍ଗରେ ରୁହନ୍ତୁ',
  },
  ta: {
    home: 'முகப்பு',
    library: 'நூலகம்',
    write: 'எழுதுங்கள்',
    explore: 'ஆராயுங்கள்',
    profile: 'சுயவிவரம்',
    tagline: 'பியாண்ட் தி லூப்!',
    startWriting: 'எழுதத் தொடங்குங்கள்',
    readMasterpiece: 'சிறந்த படைப்பை வாசிக்க',
    elitePass: 'எலைட் பாஸ்',
    community: 'சமூகம்',
    helpCenter: 'உதவி மையம்',
    readListen: 'வாசித்து கேளுங்கள்',
    voiceAudiobook: 'லெக்ஸோரா வாய்ஸ் மூலம் கேளுங்கள்',
    languageSelect: 'மொழி தேர்வு',
    noChallenges: 'சமீபத்திய போட்டிகள் இல்லை! இணைந்திருங்கள்',
  },
  te: {
    home: 'హోమ్',
    library: 'గ్రంథాలయం',
    write: 'రాయండి',
    explore: 'అన్వేషించండి',
    profile: 'ప్రొఫైల్',
    tagline: 'బియాండ్ ది లూప్!',
    startWriting: 'రాయడం ప్రారంభించండి',
    readMasterpiece: 'కళాఖండాన్ని చదవండి',
    elitePass: 'ఎలైట్ పాస్',
    community: 'కమ్యూనిటీ',
    helpCenter: 'సహాయ కేంద్రం',
    readListen: 'చదవండి & వినండి',
    voiceAudiobook: 'లెక్సోరా వాయిస్‌తో వినండి',
    languageSelect: 'భాషను ఎంచుకోండి',
    noChallenges: 'సవాళ్లు లేవు! వేచి ఉండండి',
  },
  kn: {
    home: 'ಮುಖಪುಟ',
    library: 'ಗ್ರಂಥಾಲಯ',
    write: 'ಬರೆಯಿರಿ',
    explore: 'ಅನ್ವೇಷಿಸಿ',
    profile: 'ಪ್ರೊಫೈಲ್',
    tagline: 'ಬಿಯಾಂಡ್ ದಿ ಲೂಪ್!',
    startWriting: 'ಬರೆಯಲು ಪ್ರಾರಂಭಿಸಿ',
    readMasterpiece: 'ಕೃತಿಯನ್ನು ಓದಿ',
    elitePass: 'ಎಲೈಟ್ ಪಾಸ್',
    community: 'ಸಮುದಾಯ',
    helpCenter: 'ಸಹಾಯ ಕೇಂದ್ರ',
    readListen: 'ಓದಿ ಮತ್ತು ಕೇಳಿ',
    voiceAudiobook: 'ಲೆಕ್ಸೋರಾ ವಾಯ್ಸ್ ಮೂಲಕ ಕೇಳಿ',
    languageSelect: 'ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ',
    noChallenges: 'ಯಾವುದೇ ಸವಾಲುಗಳಿಲ್ಲ! ಸಂಪರ್ಕದಲ್ಲಿರಿ',
  },
  ml: {
    home: 'ഹോം',
    library: 'ലൈബ്രറി',
    write: 'എഴുതുക',
    explore: 'കണ്ടെത്തുക',
    profile: 'പ്രൊഫൈൽ',
    tagline: 'ബിയോണ്ട് ദി ലൂപ്പ്!',
    startWriting: 'എഴുതിത്തുടങ്ങുക',
    readMasterpiece: 'രചന വായിക്കുക',
    elitePass: 'എലൈറ്റ് പാസ്സ്',
    community: 'കമ്മ്യൂണിറ്റി',
    helpCenter: 'സഹായ കേന്ദ്രം',
    readListen: 'വായിക്കൂ കേൾക്കൂ',
    voiceAudiobook: 'ലെക്സോറ വോയ്‌സ് വഴി കേൾക്കൂ',
    languageSelect: 'ഭാഷ തിരഞ്ഞെടുക്കുക',
    noChallenges: 'വെല്ലുവിളികൾ ലഭ്യമല്ല! കാത്തിരിക്കൂ',
  },
  bho: {
    home: 'घर',
    library: 'पुस्तकालय',
    write: 'लिखीं',
    explore: 'खोजल जाव',
    profile: 'प्रोफाइल',
    tagline: 'बियॉन्ड द लूप!',
    startWriting: 'लिखल शुरू करीं',
    readMasterpiece: 'कृति पढ़ीं',
    elitePass: 'एलीट पास',
    community: 'समाज',
    helpCenter: 'मदद केंद्र',
    readListen: 'पढ़ीं आ सुनीं',
    voiceAudiobook: 'लेक्सोरा आवाज से सुनीं',
    languageSelect: 'भाषा चुनीं',
    noChallenges: 'कोनो चुनौती नइखे! जुड़ल रहीं',
  },
  gu: {
    home: 'હોમ',
    library: 'પુસ્તકાલય',
    write: 'લખો',
    explore: 'અન્વેષણ',
    profile: 'પ્રોફાઇલ',
    tagline: 'બિયોન્ડ ધ લૂપ!',
    startWriting: 'લખવાનું શરૂ કરો',
    readMasterpiece: 'શ્રેષ્ઠ કૃતિ વાંચો',
    elitePass: 'એલિટ પાસ',
    community: 'સમુદાય',
    helpCenter: 'સહાય કેન્દ્ર',
    readListen: 'વાંચો અને સાંભળો',
    voiceAudiobook: 'લેક્સોરા વોઈસ સાથે સાંભળો',
    languageSelect: 'ભાષા પસંદ કરો',
    noChallenges: 'કોઈ નવી ચેલેન્જ નથી! જોડાયેલા રહો',
  },
  fr: {
    home: 'Accueil',
    library: 'Bibliothèque',
    write: 'Écrire',
    explore: 'Explorer',
    profile: 'Profil',
    tagline: 'Au-delà de la boucle !',
    startWriting: 'Commencer à écrire',
    readMasterpiece: 'Lire le chef-d’œuvre',
    elitePass: 'Pass Élite',
    community: 'Communauté',
    helpCenter: 'Centre d’aide',
    readListen: 'Lire et écouter',
    voiceAudiobook: 'Écouter avec LEXORA Voice',
    languageSelect: 'Langue d’affichage',
    noChallenges: 'Aucun défi récent ! Restez à l’écoute',
  },
  'zh-CN': {
    home: '首页',
    library: '藏书阁',
    write: '创作',
    explore: '探索',
    profile: '个人主页',
    tagline: '超越常规，字字生辉！',
    startWriting: '开始创作',
    readMasterpiece: '品读经典',
    elitePass: '精英通行证',
    community: '文学圈',
    helpCenter: '帮助中心',
    readListen: '图文有声',
    voiceAudiobook: '使用 LEXORA 原声朗读',
    languageSelect: '选择界面语言',
    noChallenges: '近期暂无挑战赛！敬请期待',
  },
  es: {
    home: 'Inicio',
    library: 'Biblioteca',
    write: 'Escribir',
    explore: 'Explorar',
    profile: 'Perfil',
    tagline: '¡Más allá del bucle!',
    startWriting: 'Empezar a escribir',
    readMasterpiece: 'Leer obra maestra',
    elitePass: 'Pase Élite',
    community: 'Comunidad',
    helpCenter: 'Centro de ayuda',
    readListen: 'Leer y escuchar',
    voiceAudiobook: 'Escuchar con LEXORA Voice',
    languageSelect: 'Idioma de pantalla',
    noChallenges: '¡No hay desafíos recientes! Mantente al tanto',
  },
  bn: {
    home: 'হোম',
    library: 'গ্রন্থাগার',
    write: 'লিখুন',
    explore: 'অন্বেষণ',
    profile: 'প্রোফাইল',
    tagline: 'বিয়ন্ড দ্য লুপ!',
    startWriting: 'লেখা শুরু করুন',
    readMasterpiece: 'সেরা রচনা পড়ুন',
    elitePass: 'এলিট পাস',
    community: 'সম্প্রদায়',
    helpCenter: 'সহায়তা কেন্দ্র',
    readListen: 'পড়ুন ও শুনুন',
    voiceAudiobook: 'লেক্সোরা ভয়েসে শুনুন',
    languageSelect: 'ভাষা নির্বাচন',
    noChallenges: 'কোনো সাম্প্রতিক চ্যালেঞ্জ নেই! সাথেই থাকুন',
  },
  mr: {
    home: 'मुख्यपृष्ठ',
    library: 'ग्रंथालय',
    write: 'लिहा',
    explore: 'शोधा',
    profile: 'प्रोफाइल',
    tagline: 'बियॉन्ड द लूप!',
    startWriting: 'लेखन सुरू करा',
    readMasterpiece: 'मास्टरपीस वाचा',
    elitePass: 'एलिट पास',
    community: 'समुदाय',
    helpCenter: 'मदत केंद्र',
    readListen: 'वाचा आणि ऐका',
    voiceAudiobook: 'LEXORA Voice सह ऐका',
    languageSelect: 'भाषा निवडा',
    noChallenges: 'कोणतीही नवीन आव्हाने नाहीत! संपर्कात रहा',
  },
  pa: {
    home: 'ਮੁੱਖ ਪੰਨਾ',
    library: 'ਲਾਇਬ੍ਰੇਰੀ',
    write: 'ਲਿਖੋ',
    explore: 'ਖੋਜੋ',
    profile: 'ਪ੍ਰੋਫਾਈਲ',
    tagline: 'ਬਿਓਂਡ ਦ ਲੂਪ!',
    startWriting: 'ਲਿਖਣਾ ਸ਼ੁਰੂ ਕਰੋ',
    readMasterpiece: 'ਮਾਸਟਰਪੀਸ ਪੜ੍ਹੋ',
    elitePass: 'ਏਲੀਟ ਪਾਸ',
    community: 'ਕਮਿਊਨਿਟੀ',
    helpCenter: 'ਸਹਾਇਤਾ ਕੇਂਦਰ',
    readListen: 'ਪੜ੍ਹੋ ਅਤੇ ਸੁਣੋ',
    voiceAudiobook: 'LEXORA Voice ਨਾਲ ਸੁਣੋ',
    languageSelect: 'ਭਾਸ਼ਾ ਚੁਣੋ',
    noChallenges: 'ਕੋਈ ਨਵੀਆਂ ਚੁਣੌਤੀਆਂ ਨਹੀਂ! ਜੁੜੇ ਰਹੋ',
  },
  ru: {
    home: 'Главная',
    library: 'Библиотека',
    write: 'Писать',
    explore: 'Обзор',
    profile: 'Профиль',
    tagline: 'За гранью привычного!',
    startWriting: 'Начать писать',
    readMasterpiece: 'Читать шедевр',
    elitePass: 'Элитный пропуск',
    community: 'Сообщество',
    helpCenter: 'Центр помощи',
    readListen: 'Читать и слушать',
    voiceAudiobook: 'Слушать с LEXORA Voice',
    languageSelect: 'Язык интерфейса',
    noChallenges: 'Нет актуальных конкурсов! Следите за новостями',
  },
  pt: {
    home: 'Início',
    library: 'Biblioteca',
    write: 'Escrever',
    explore: 'Explorar',
    profile: 'Perfil',
    tagline: 'Além do ciclo!',
    startWriting: 'Começar a escrever',
    readMasterpiece: 'Ler obra-prima',
    elitePass: 'Passe Elite',
    community: 'Comunidade',
    helpCenter: 'Central de Ajuda',
    readListen: 'Ler e ouvir',
    voiceAudiobook: 'Ouvir com LEXORA Voice',
    languageSelect: 'Idioma de exibição',
    noChallenges: 'Sem desafios recentes! Fique atento',
  },
};
