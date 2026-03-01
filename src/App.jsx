import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from './i18n';
import { MEETING_STAGES, ROLES } from './constants';
import { MOTION_TYPES } from './constants/motionTypes';
import { useMeetingState } from './hooks/useMeetingState';
import { useModal } from './hooks/useModal';
import { useHeartbeat } from './hooks/useHeartbeat';
import { useAudioCues } from './hooks/useAudioCues';
import { getCurrentPendingQuestion } from './engine/motionStack';
import LoginScreen from './components/LoginScreen';
import MeetingView from './components/MeetingView';
import AboutPage from './components/AboutPage';
import TutorialPage from './components/TutorialPage';
import TutorialChairPage from './components/TutorialChairPage';
import TutorialMemberPage from './components/TutorialMemberPage';
import GeneralSettings from './components/GeneralSettings';
import HatsellLogo from './components/HatsellLogo';
import TopBar from './components/TopBar';
import MembersDrawer from './components/drawers/MembersDrawer';
import QueueDrawer from './components/drawers/QueueDrawer';
import LogDrawer from './components/drawers/LogDrawer';
import OrderDrawer from './components/drawers/OrderDrawer';
import MotionModal from './components/modals/MotionModal';
import AmendmentModal from './components/modals/AmendmentModal';
import PointOfOrderModal from './components/modals/PointOfOrderModal';
import MinutesCorrectionModal from './components/modals/MinutesCorrectionModal';
import IncidentalMainModal from './components/modals/IncidentalMainModal';
import IncidentalMotionsModal from './components/modals/IncidentalMotionsModal';
import SubsidiaryMotionModal from './components/modals/SubsidiaryMotionModal';
import PrivilegedMotionModal from './components/modals/PrivilegedMotionModal';
import BringBackModal from './components/modals/BringBackModal';
import ParliamentaryInquiryModal from './components/modals/ParliamentaryInquiryModal';
import RequestForInfoModal from './components/modals/RequestForInfoModal';
import AppealModal from './components/modals/AppealModal';
import SuspendRulesModal from './components/modals/SuspendRulesModal';
import DivideQuestionModal from './components/modals/DivideQuestionModal';
import ExpertMotionModal from './components/modals/ExpertMotionModal';
import WithdrawMotionModal from './components/modals/WithdrawMotionModal';
import PreChairWithdrawModal from './components/modals/PreChairWithdrawModal';
import ChairExplanationModal from './components/modals/ChairExplanationModal';
import ChairRulingNotification from './components/ChairRulingNotification';

const HIDDEN_TEST_QUERY_KEY = 'hidden';
const HIDDEN_TEST_QUERY_VALUE = 'rr9';
const HIDDEN_TEST_PATH = '/hidden/rr9';
const HIDDEN_TEST_MEETING_CODE = 'RR9HID';
const HIDDEN_TEST_MEMBERS = [
    'Amina Hassan',
    'Luca Bianchi',
    'Sofia Petrova',
    'Kenji Sato',
    'Priya Sharma',
    "Michael O'Connor",
    'Fatima El Idrissi',
    'Jonas Muller',
    'Camila Torres'
];

export default function App() {
    const [activePage, setActivePage] = useState('meeting');
    const [settingsUserName, setSettingsUserName] = useState('');
    const [disclaimerAccepted, setDisclaimerAccepted] = useState(
        () => sessionStorage.getItem('hatsell_disclaimer') === 'true'
    );
    const [disclaimerChecked, setDisclaimerChecked] = useState(false);
    const [activeDrawer, setActiveDrawer] = useState(null);
    const [inactivityWarning, setInactivityWarning] = useState(false);
    const [pendingRuling, setPendingRuling] = useState(null);
    const hiddenTestBootstrapped = useRef(false);
    const hiddenTestMode = useRef((() => {
        const params = new URLSearchParams(window.location.search);
        const fromQuery = params.get(HIDDEN_TEST_QUERY_KEY) === HIDDEN_TEST_QUERY_VALUE;
        const fromPath = window.location.pathname.toLowerCase() === HIDDEN_TEST_PATH;
        return fromQuery || fromPath;
    })());

    const { t } = useTranslation('meeting');
    const { t: tModals } = useTranslation('modals');

    const toggleDrawer = (name) => {
        setActiveDrawer(prev => prev === name ? null : name);
    };

    const {
        isLoggedIn,
        currentUser,
        meetingState,
        setMeetingState,
        updateMeetingState,
        addToLog,
        handleLogin,
        handleCallToOrder,
        handleRollCall,
        handleCallMember,
        handleMarkPresent,
        handleRespondToRollCall,
        handleApproveMinutes,
        handleNewMotion,
        handleSecondMotion,
        handleRequestToSpeak,
        handleRecognizeSpeaker,
        handleFinishSpeaking,
        handleCallVote,
        handleCallVoteOnMinutesCorrection,
        handleVote,
        handleAnnounceResult,
        handleAcknowledgeAnnouncement,
        handleAdjourn,
        handleSubmitAmendment,
        handleRecognizeAmendment,
        handleDismissAmendment,
        handleSecondAmendment,
        handleSubmitPointOfOrder,
        handleSubmitMinutesCorrection,
        handleRecognizeCorrection,
        handleReturnCorrection,
        handleObjectToCorrection,
        handleAcceptCorrectionByConsent,
        handleRuleOnPointOfOrder,
        handleLogout,
        handleClearMeeting,
        handleSubmitIncidental,
        // New handlers
        handleMoveSubsidiary,
        handleRaisePendingRequest,
        handleAcceptRequest,
        handleRespondToRequest,
        handleDismissRequest,
        handleRuleOnPointOfOrderRequest,
        handleConvertRequestToMotion,
        handleDivisionOfAssembly,
        handleWithdrawMotion,
        handleTakeFromTable,
        handleReconsider,
        handleResumeFromRecess,
        handleResumeFromSuspendedRules,
        handleSuspendedVote,
        handleNewSpeakingList,
        handleResumePreviousSpeakingList,
        handleDeclareNoSecond,
        handleSetQuorum,
        handleChairAcceptMotion,
        handleChairRejectMotion,
        handleRecognizePendingMotion,
        handleDismissPendingMotion,
        handleReformulateMotion,
        handleOrdersOfTheDay,
        handleOrdersOfTheDayResponse,
        handleAdoptAgenda,
        handleNextAgendaItem
    } = useMeetingState();

    const {
        showModal,
        setShowModal,
        openMotionModal,
        openIncidentalMainModal,
        openIncidentalMotionsModal,
        openAmendmentModal,
        openPointOfOrderModal,
        openSubsidiaryMotionModal,
        openPrivilegedMotionModal,
        openBringBackModal,
        openParliamentaryInquiryModal,
        openRequestForInfoModal,
        openAppealModal,
        openSuspendRulesModal,
        openDivideQuestionModal,
        openWithdrawMotionModal,
        openExpertMotionModal,
        openPreChairWithdrawModal,
        closeModal,
        modalData
    } = useModal();

    const buildExpertMotionConfig = (payload) => {
        const voteMap = {
            majority_votes_cast: { voteRequired: 'majority', voteBasisOverride: 'votes_cast' },
            two_thirds_votes_cast: { voteRequired: 'two_thirds', voteBasisOverride: 'votes_cast' },
            majority_entire_membership: { voteRequired: 'majority', voteBasisOverride: 'entire_membership' },
            majority_members_present: { voteRequired: 'majority', voteBasisOverride: 'members_present' },
            two_thirds_members_present: { voteRequired: 'two_thirds', voteBasisOverride: 'members_present' }
        };
        const selectedVote = voteMap[payload.voteRequired] || voteMap.majority_votes_cast;
        return {
            purpose: payload.purpose,
            ronrCitation: payload.ronrCitation,
            ronrMotionName: payload.ronrMotionName,
            inOrderNowWhy: payload.inOrderNowWhy,
            currentBusiness: payload.currentBusiness,
            noConflictWhy: payload.noConflictWhy,
            requiresSecond: payload.secondRequiredBool,
            isDebatable: payload.debatableBool,
            debateLimitsText: payload.debateLimits,
            isAmendable: payload.amendableBool,
            amendLimitsText: payload.amendLimits,
            voteRequired: selectedVote.voteRequired,
            voteBasisOverride: selectedVote.voteBasisOverride,
            noticeRequired: payload.noticeRequired,
            classType: payload.classType,
            precedence: payload.parsedPrecedence,
            canInterrupt: payload.canInterruptBool,
            precedenceRelations: payload.precedenceRelations,
            reconsiderable: payload.reconsiderableBool,
            reconsiderWhen: payload.reconsiderWhen,
            renewable: payload.renewableBool,
            renewableWhen: payload.renewableWhen,
            durationScope: payload.durationScope
        };
    };

    useHeartbeat(currentUser, isLoggedIn, meetingState, setMeetingState, updateMeetingState, {
        onInactivityWarning: (action) => setInactivityWarning(action === 'show'),
        inactivityWarningActive: inactivityWarning
    });
    useAudioCues(meetingState);

    useEffect(() => {
        if (!hiddenTestMode.current) return;
        if (hiddenTestBootstrapped.current) return;
        if (isLoggedIn) return;
        hiddenTestBootstrapped.current = true;

        const bootstrapHiddenMeeting = async () => {
            setDisclaimerAccepted(true);
            sessionStorage.setItem('hatsell_disclaimer', 'true');

            const meetingSettings = {
                meetingName: 'Hidden Test Meeting',
                agendaItems: [
                    { id: 1, createdAt: 1, title: 'Reports', category: 'officer_reports', owner: 'Officers', timeTarget: '10', notes: '' },
                    { id: 2, createdAt: 2, title: 'Unfinished Business', category: 'unfinished_business', owner: 'Assembly', timeTarget: '10', notes: '' }
                ],
                agendaCustomSequence: false,
                includeMinutesApproval: true,
                agendaStatus: 'orders_of_the_day',
                previousNotice: {
                    rescind: false,
                    bylawAmendments: false,
                    dischargeCommittee: false,
                    disciplinary: false
                },
                meetingType: 'regular',
                specialMeetingRestrict: true,
                electronicRules: {
                    recognitionMethod: 'queue_only',
                    chatPolicy: 'informational_only',
                    raiseHandMechanism: 'button'
                },
                openingPackage: {
                    enabled: false,
                    adoptAgenda: true,
                    adoptElectronicRules: true
                },
                autoYieldOnTimeExpired: false,
                audioCues: false,
                showVoteDetails: false,
                language: 'en'
            };

            const orgProfile = {
                organizationName: 'Hatsell Hidden Demo',
                totalMembership: '10',
                quorumType: 'default',
                quorumValue: '',
                majorityBasis: 'votes_cast',
                twoThirdsBasis: 'votes_cast',
                timePerSpeech: 10,
                speechesPerMember: 2,
                totalDebateTime: '',
                meetingFormat: 'in_person',
                electronicVoting: false,
                proxyVoting: false
            };

            await handleLogin({
                name: 'John Hatsell',
                role: ROLES.PRESIDENT,
                meetingCode: HIDDEN_TEST_MEETING_CODE,
                orgProfile,
                meetingSettings
            });

            const participants = [
                { name: 'John Hatsell', role: ROLES.PRESIDENT, meetingCode: HIDDEN_TEST_MEETING_CODE, lastSeen: Date.now() },
                ...HIDDEN_TEST_MEMBERS.map((name, idx) => ({
                    name,
                    role: ROLES.MEMBER,
                    meetingCode: HIDDEN_TEST_MEETING_CODE,
                    lastSeen: Date.now() - (idx + 1) * 1000,
                    demoSeeded: true
                }))
            ];

            updateMeetingState({
                stage: MEETING_STAGES.CALL_TO_ORDER,
                participants,
                meetingSettings,
                orgProfile,
                meetingCode: HIDDEN_TEST_MEETING_CODE,
                currentAgendaIndex: null,
                rollCallStatus: {},
                log: [
                    {
                        timestamp: new Date().toLocaleTimeString(),
                        message: 'Hidden test meeting loaded with seeded participants.'
                    }
                ]
            });
        };

        bootstrapHiddenMeeting().catch((err) => {
            console.error('Failed to bootstrap hidden test meeting mode:', err);
        });
    }, [isLoggedIn, handleLogin, updateMeetingState]);

    // --- Wrapped negative ruling handlers (intercept with explanation modal) ---

    const wrappedChairRejectMotion = () => {
        const stack = meetingState.motionStack || [];
        const top = getCurrentPendingQuestion(stack);
        if (!top) return;
        setPendingRuling({
            heading: tModals('chair_explanation_heading_motion'),
            description: top.text,
            memberName: top.mover,
            onConfirm: (explanation) => {
                handleChairRejectMotion(explanation);
                setPendingRuling(null);
            }
        });
    };

    const wrappedRuleOnPointOfOrderRequest = (requestId, ruling) => {
        // Favorable ruling passes through directly
        if (ruling === 'sustained') {
            handleRuleOnPointOfOrderRequest(requestId, ruling);
            return;
        }
        const request = (meetingState.pendingRequests || []).find(r => r.id === requestId);
        if (!request) return;
        setPendingRuling({
            heading: tModals('chair_explanation_heading_point'),
            description: request.content,
            memberName: request.raisedBy,
            onConfirm: (explanation) => {
                handleRuleOnPointOfOrderRequest(requestId, ruling, explanation);
                setPendingRuling(null);
            }
        });
    };

    const wrappedReturnCorrection = () => {
        const corrections = meetingState.minutesCorrections || [];
        if (corrections.length === 0) return;
        const correction = corrections[0];
        setPendingRuling({
            heading: tModals('chair_explanation_heading_correction'),
            description: correction.text,
            memberName: correction.proposedBy,
            onConfirm: (explanation) => {
                handleReturnCorrection(explanation);
                setPendingRuling(null);
            }
        });
    };

    const wrappedRuleOnPointOfOrder = (ruling) => {
        // Favorable ruling passes through directly
        if (ruling === 'sustained') {
            handleRuleOnPointOfOrder(ruling);
            return;
        }
        // Check pending requests first, then legacy pendingPointOfOrder
        const pendingPOO = (meetingState.pendingRequests || []).find(
            r => r.type === 'point_of_order' && r.status === 'pending'
        );
        const concern = pendingPOO?.content || meetingState.pendingPointOfOrder?.concern || '';
        const memberName = pendingPOO?.raisedBy || meetingState.pendingPointOfOrder?.raisedBy || '';
        setPendingRuling({
            heading: tModals('chair_explanation_heading_point'),
            description: concern,
            memberName,
            onConfirm: (explanation) => {
                handleRuleOnPointOfOrder(ruling, explanation);
                setPendingRuling(null);
            }
        });
    };

    const wrappedDismissRequest = (requestId) => {
        const request = (meetingState.pendingRequests || []).find(r => r.id === requestId);
        if (!request) return;
        setPendingRuling({
            heading: tModals('chair_explanation_heading_dismiss'),
            description: request.content,
            memberName: request.raisedBy,
            onConfirm: (explanation) => {
                handleDismissRequest(requestId, explanation);
                setPendingRuling(null);
            }
        });
    };

    // Sync meeting language to i18n — all participants see the same language
    useEffect(() => {
        const meetingLang = meetingState?.meetingSettings?.language;
        if (meetingLang && isLoggedIn && i18n.language !== meetingLang) {
            i18n.changeLanguage(meetingLang);
        }
    }, [meetingState?.meetingSettings?.language, isLoggedIn]);

    useEffect(() => {
        const hasOpenDialog = !!showModal || !!pendingRuling;
        if (!hasOpenDialog) return;

        const handleKeyDown = (event) => {
            if (event.key !== 'Escape') return;
            if (pendingRuling) {
                setPendingRuling(null);
                return;
            }
            closeModal();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showModal, pendingRuling, closeModal]);

    if (activePage === 'tutorial') {
        return (
            <TutorialPage
                onBack={() => setActivePage('meeting')}
                onOpenApp={() => setActivePage('meeting')}
                onChair={() => setActivePage('tutorialChair')}
                onMember={() => setActivePage('tutorialMember')}
            />
        );
    }

    if (activePage === 'tutorialChair') {
        return (
            <TutorialChairPage
                onBack={() => setActivePage('meeting')}
                onOpenApp={() => setActivePage('meeting')}
                onOverview={() => setActivePage('tutorial')}
                onMember={() => setActivePage('tutorialMember')}
            />
        );
    }

    if (activePage === 'tutorialMember') {
        return (
            <TutorialMemberPage
                onBack={() => setActivePage('meeting')}
                onOpenApp={() => setActivePage('meeting')}
                onOverview={() => setActivePage('tutorial')}
                onChair={() => setActivePage('tutorialChair')}
            />
        );
    }

    if (activePage === 'about') {
        return <AboutPage onBack={() => setActivePage('meeting')} />;
    }

    if (activePage === 'generalSettings') {
        return (
            <GeneralSettings
                userName={settingsUserName}
                onConfirm={({ profile, meetingSettings, codes, userName }) => {
                    // Login as Chair with the generated base code + org profile
                    handleLogin({
                        name: userName,
                        role: ROLES.PRESIDENT,
                        meetingCode: codes.base,
                        orgProfile: profile,
                        meetingSettings: meetingSettings
                    });
                    setActivePage('meeting');
                }}
                onCancel={() => setActivePage('meeting')}
            />
        );
    }

    if (!isLoggedIn) {
        return (
            <LoginScreen
                onLogin={handleLogin}
                onAbout={() => setActivePage('about')}
                onTutorial={() => setActivePage('tutorial')}
                onCreateMeeting={(name) => {
                    setSettingsUserName(name);
                    setActivePage('generalSettings');
                }}
            />
        );
    }

    if (!disclaimerAccepted) {
        return (
            <div className="app-container">
                <header className="header">
                    <div className="logo-container">
                        <HatsellLogo />
                        <h1>{t('common:app_name', { ns: 'common' })}</h1>
                    </div>
                    <p className="subtitle">{t('based_on_ronr')}</p>
                </header>
                <div className="disclaimer-wrap">
                    <div className="modal disclaimer-modal">
                        <h3>{t('disclaimer_title')}</h3>
                        <p className="modal-intro" style={{ marginBottom: '1rem' }}>
                            {t('disclaimer_text')}
                        </p>
                        <div className="info-box">
                            <strong>{t('disclaimer_data_title')}</strong>
                            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem', lineHeight: 1.6 }}>
                                <li>{t('disclaimer_data_firebase')}</li>
                                <li>{t('disclaimer_data_local')}</li>
                                <li>{t('disclaimer_data_session')}</li>
                                <li>{t('disclaimer_data_no_personal')}</li>
                                <li>{t('disclaimer_data_temp')}</li>
                            </ul>
                        </div>

                        <label className="disclaimer-check">
                            <input
                                type="checkbox"
                                checked={disclaimerChecked}
                                onChange={(e) => setDisclaimerChecked(e.target.checked)}
                            />
                            {t('disclaimer_agree')}
                        </label>
                        <button
                            onClick={() => {
                                setDisclaimerAccepted(true);
                                sessionStorage.setItem('hatsell_disclaimer', 'true');
                            }}
                            disabled={!disclaimerChecked}
                        >
                            {t('disclaimer_continue')}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const motionStack = meetingState.motionStack || [];
    const top = getCurrentPendingQuestion(motionStack);

    const isChair = currentUser.role === ROLES.PRESIDENT || currentUser.role === ROLES.VICE_PRESIDENT;

    return (
        <div className="app-container" style={{ padding: 0 }}>
            <a href="#main-content" className="skip-to-content">{t('skip_to_content')}</a>
            <TopBar
                meetingState={meetingState}
                currentUser={currentUser}
                activeDrawer={activeDrawer}
                onToggleDrawer={toggleDrawer}
                onLogout={handleLogout}
                onAbout={() => setActivePage('about')}
            />

            {activeDrawer === 'members' && (
                <MembersDrawer
                    meetingState={meetingState}
                    currentUser={currentUser}
                    isChair={isChair}
                    onSetQuorum={handleSetQuorum}
                    onClose={() => setActiveDrawer(null)}
                />
            )}
            {activeDrawer === 'order' && (
                <OrderDrawer
                    meetingState={meetingState}
                    onClose={() => setActiveDrawer(null)}
                />
            )}
            {activeDrawer === 'queue' && (
                <QueueDrawer
                    meetingState={meetingState}
                    onClose={() => setActiveDrawer(null)}
                />
            )}
            {activeDrawer === 'log' && (
                <LogDrawer
                    meetingState={meetingState}
                    onClose={() => setActiveDrawer(null)}
                />
            )}

            <MeetingView
                meetingState={meetingState}
                currentUser={currentUser}
                onCallToOrder={handleCallToOrder}
                onRollCall={handleRollCall}
                onCallMember={handleCallMember}
                onMarkPresent={handleMarkPresent}
                onRespondToRollCall={handleRespondToRollCall}
                onApproveMinutes={handleApproveMinutes}
                onNewMotion={openMotionModal}
                onSecondMotion={handleSecondMotion}
                onRequestToSpeak={handleRequestToSpeak}
                onRecognizeSpeaker={handleRecognizeSpeaker}
                onFinishSpeaking={handleFinishSpeaking}
                onCallVote={handleCallVote}
                onVote={handleVote}
                onAnnounceResult={handleAnnounceResult}
                onAdjourn={handleAdjourn}
                onAmendMotion={openAmendmentModal}
                onSecondAmendment={handleSecondAmendment}
                onRecognizeAmendment={handleRecognizeAmendment}
                onDismissAmendment={handleDismissAmendment}
                onPointOfOrder={openPointOfOrderModal}
                onRuleOnPointOfOrder={wrappedRuleOnPointOfOrder}
                updateMeetingState={updateMeetingState}
                addToLog={addToLog}
                setShowModal={setShowModal}
                handleObjectToCorrection={handleObjectToCorrection}
                handleAcceptCorrectionByConsent={handleAcceptCorrectionByConsent}
                handleRecognizeCorrection={handleRecognizeCorrection}
                handleReturnCorrection={wrappedReturnCorrection}
                onCallVoteOnMinutesCorrection={handleCallVoteOnMinutesCorrection}
                onAcknowledgeAnnouncement={handleAcknowledgeAnnouncement}
                onIncidentalMainMotion={openIncidentalMainModal}
                onIncidentalMotions={openIncidentalMotionsModal}
                // New handlers
                onSubsidiaryMotion={openSubsidiaryMotionModal}
                onPrivilegedMotion={openPrivilegedMotionModal}
                onBringBackMotion={openBringBackModal}
                onUnlistedMotion={openExpertMotionModal}
                onParliamentaryInquiry={openParliamentaryInquiryModal}
                onRequestForInfo={openRequestForInfoModal}
                onAppeal={openAppealModal}
                onDivideQuestion={openDivideQuestionModal}
                onObjectionToConsideration={() => handleConvertRequestToMotion(
                    MOTION_TYPES.OBJECTION_TO_CONSIDERATION,
                    'to object to consideration of the question'
                )}
                onSuspendRules={openSuspendRulesModal}
                onWithdrawMotion={openWithdrawMotionModal}
                onDivision={handleDivisionOfAssembly}
                onAcceptRequest={handleAcceptRequest}
                onRespondToRequest={handleRespondToRequest}
                onDismissRequest={wrappedDismissRequest}
                onRuleOnPointOfOrderRequest={wrappedRuleOnPointOfOrderRequest}
                onResumeFromRecess={handleResumeFromRecess}
                onNewSpeakingList={handleNewSpeakingList}
                onResumePreviousSpeakingList={handleResumePreviousSpeakingList}
                onResumeFromSuspendedRules={handleResumeFromSuspendedRules}
                onSuspendedVote={handleSuspendedVote}
                onDeclareNoSecond={handleDeclareNoSecond}
                onChairAcceptMotion={handleChairAcceptMotion}
                onChairRejectMotion={wrappedChairRejectMotion}
                onRecognizePendingMotion={handleRecognizePendingMotion}
                onDismissPendingMotion={handleDismissPendingMotion}
                onPreChairWithdraw={openPreChairWithdrawModal}
                onOrdersOfTheDay={handleOrdersOfTheDay}
                onOrdersOfTheDayResponse={handleOrdersOfTheDayResponse}
                onAdoptAgenda={handleAdoptAgenda}
                onNextAgendaItem={handleNextAgendaItem}
            />

            {/* === MODALS === */}

            {showModal === 'motion' && (
                <MotionModal
                    heading={modalData.heading}
                    initialText={modalData.motionText}
                    showSpecialOptions={modalData.showSpecialOptions}
                    previousNotice={meetingState.meetingSettings?.previousNotice || meetingState.orgProfile?.previousNotice}
                    onSubmit={(text) => {
                        handleNewMotion(text, currentUser.name);
                        closeModal();
                    }}
                    onClose={closeModal}
                />
            )}

            {showModal === 'incidentalMain' && (
                <IncidentalMainModal
                    onSelectTemplate={(templateText, templateHeading) => {
                        openMotionModal({ motionText: templateText, heading: templateHeading, showSpecialOptions: false });
                    }}
                    onClose={closeModal}
                />
            )}

            {showModal === 'incidentalMotions' && (
                <IncidentalMotionsModal
                    onSubmit={(type) => {
                        // Route each incidental type to its proper modal
                        closeModal();
                        switch (type) {
                            case 'point_of_order':
                                openPointOfOrderModal();
                                break;
                            case 'parliamentary_inquiry':
                                openParliamentaryInquiryModal();
                                break;
                            case 'request_for_info':
                                openRequestForInfoModal();
                                break;
                            case 'appeal':
                                openAppealModal();
                                break;
                            case 'division_of_assembly':
                                handleDivisionOfAssembly();
                                break;
                            case 'division_of_question':
                                openDivideQuestionModal();
                                break;
                            case 'objection_to_consideration':
                                handleConvertRequestToMotion(
                                    MOTION_TYPES.OBJECTION_TO_CONSIDERATION,
                                    'to object to consideration of the question'
                                );
                                break;
                            case 'suspend_rules':
                                openSuspendRulesModal();
                                break;
                            default:
                                handleSubmitIncidental(type);
                        }
                    }}
                    onClose={closeModal}
                />
            )}

            {showModal === 'amendment' && (
                <AmendmentModal
                    originalMotion={top?.metadata?.proposedText || top?.text || meetingState.currentMotion?.text}
                    onSubmit={({ language, proposedText }) => {
                        handleSubmitAmendment(language, proposedText);
                        closeModal();
                    }}
                    onClose={closeModal}
                />
            )}

            {showModal === 'pointOfOrder' && (
                <PointOfOrderModal
                    onSubmit={(concern) => {
                        handleSubmitPointOfOrder(concern);
                        closeModal();
                    }}
                    onClose={closeModal}
                />
            )}

            {showModal === 'minutesCorrection' && (
                <MinutesCorrectionModal
                    onSubmit={(correction) => {
                        handleSubmitMinutesCorrection(correction);
                        closeModal();
                    }}
                    onClose={closeModal}
                />
            )}

            {showModal === 'subsidiaryMotion' && (
                <SubsidiaryMotionModal
                    motionType={modalData.motionType}
                    currentMotionText={top?.text}
                    onSubmit={(motionType, text, metadata) => {
                        handleMoveSubsidiary(motionType, text, metadata);
                        closeModal();
                    }}
                    onClose={closeModal}
                />
            )}

            {showModal === 'privilegedMotion' && (
                <PrivilegedMotionModal
                    motionType={modalData.motionType}
                    onSubmit={(motionType, text, metadata) => {
                        handleConvertRequestToMotion(motionType, text, metadata);
                        closeModal();
                    }}
                    onClose={closeModal}
                />
            )}

            {showModal === 'bringBack' && (
                <BringBackModal
                    motionType={modalData.motionType}
                    tabledMotions={meetingState.tabledMotions}
                    decidedMotions={meetingState.decidedMotions}
                    onSubmit={(motionType, text, metadata) => {
                        if (motionType === MOTION_TYPES.TAKE_FROM_TABLE) {
                            handleTakeFromTable(metadata.selectedIndex);
                        } else if (motionType === MOTION_TYPES.RECONSIDER) {
                            handleReconsider(metadata.selectedIndex);
                        } else if (motionType === MOTION_TYPES.RECONSIDER_ENTER_MINUTES) {
                            handleReconsider(metadata.selectedIndex, true);
                        } else {
                            handleConvertRequestToMotion(motionType, text, metadata);
                        }
                        closeModal();
                    }}
                    onClose={closeModal}
                />
            )}

            {showModal === 'divideQuestion' && (
                <DivideQuestionModal
                    currentMotionText={top?.text}
                    onSubmit={(parts) => {
                        handleConvertRequestToMotion(
                            MOTION_TYPES.DIVISION_OF_QUESTION,
                            'to divide the question',
                            { parts }
                        );
                        closeModal();
                    }}
                    onClose={closeModal}
                />
            )}

            {showModal === 'expertMotion' && (
                <ExpertMotionModal
                    onSubmit={(payload) => {
                        handleConvertRequestToMotion(
                            MOTION_TYPES.UNLISTED_MOTION,
                            payload.motionText,
                            { expertProcedure: buildExpertMotionConfig(payload) }
                        );
                        closeModal();
                    }}
                    onClose={closeModal}
                />
            )}

            {showModal === 'parliamentaryInquiry' && (
                <ParliamentaryInquiryModal
                    onSubmit={(inquiry) => {
                        handleRaisePendingRequest(MOTION_TYPES.PARLIAMENTARY_INQUIRY, inquiry);
                        closeModal();
                    }}
                    onClose={closeModal}
                />
            )}

            {showModal === 'requestForInfo' && (
                <RequestForInfoModal
                    onSubmit={(question) => {
                        handleRaisePendingRequest(MOTION_TYPES.REQUEST_FOR_INFO, question);
                        closeModal();
                    }}
                    onClose={closeModal}
                />
            )}

            {showModal === 'appeal' && (
                <AppealModal
                    chairRuling={meetingState.lastChairRuling ?
                        `${meetingState.lastChairRuling.ruling}: ${meetingState.lastChairRuling.concern}${meetingState.lastChairRuling.explanation ? ` — ${meetingState.lastChairRuling.explanation}` : ''}` : null}
                    onSubmit={() => {
                        handleConvertRequestToMotion(
                            MOTION_TYPES.APPEAL,
                            `Appeal the chair's ruling: ${meetingState.lastChairRuling?.ruling || 'ruling'}`
                        );
                        closeModal();
                    }}
                    onClose={closeModal}
                />
            )}

            {showModal === 'suspendRules' && (
                <SuspendRulesModal
                    onSubmit={(purpose) => {
                        handleConvertRequestToMotion(
                            MOTION_TYPES.SUSPEND_RULES,
                            `to suspend the rules in order to: ${purpose}`,
                            { suspendedRulesPurpose: purpose }
                        );
                        closeModal();
                    }}
                    onClose={closeModal}
                />
            )}

            {showModal === 'withdrawMotion' && (
                <WithdrawMotionModal
                    motionText={top?.text}
                    mover={top?.mover}
                    currentUser={currentUser?.name}
                    onSubmit={() => {
                        handleWithdrawMotion();
                        closeModal();
                    }}
                    onClose={closeModal}
                />
            )}

            {showModal === 'preChairWithdraw' && (
                <PreChairWithdrawModal
                    motionText={top?.text}
                    onWithdraw={() => {
                        handleWithdrawMotion();
                        closeModal();
                    }}
                    onReformulate={(newText) => {
                        handleReformulateMotion(newText);
                        closeModal();
                    }}
                    onClose={closeModal}
                />
            )}

            {pendingRuling && (
                <ChairExplanationModal
                    heading={pendingRuling.heading}
                    description={pendingRuling.description}
                    memberName={pendingRuling.memberName}
                    onConfirm={pendingRuling.onConfirm}
                    onClose={() => setPendingRuling(null)}
                />
            )}

            <ChairRulingNotification
                meetingState={meetingState}
                isChair={isChair}
                onAppeal={openAppealModal}
            />

            {inactivityWarning && isLoggedIn && (
                <InactivityWarningModal
                    lastActivityTime={meetingState.lastActivityTime}
                    onResume={() => {
                        updateMeetingState({});
                        setInactivityWarning(false);
                    }}
                    onEnd={() => {
                        handleAdjourn();
                        setInactivityWarning(false);
                    }}
                />
            )}
        </div>
    );
}

function InactivityWarningModal({ lastActivityTime, onResume, onEnd }) {
    const { t } = useTranslation('meeting');
    const [countdown, setCountdown] = useState(60);
    const countdownRef = useRef(null);

    useEffect(() => {
        const tick = () => {
            const elapsed = Date.now() - lastActivityTime;
            const graceUsed = elapsed - 30 * 60 * 1000;
            const remaining = Math.max(0, Math.ceil((60 * 1000 - graceUsed) / 1000));
            setCountdown(remaining);
        };
        tick();
        countdownRef.current = setInterval(tick, 1000);
        return () => clearInterval(countdownRef.current);
    }, [lastActivityTime]);

    return (
        <div className="modal-overlay">
            <div className="modal variant-warning" role="alertdialog" aria-labelledby="inactivity-heading">
                <h3 id="inactivity-heading">{t('inactivity_title')}</h3>
                <p className="modal-intro">
                    {t('inactivity_text')}
                </p>
                <div className="inactivity-countdown">
                    {countdown}s
                </div>
                <div className="modal-buttons">
                    <button onClick={onResume}>{t('inactivity_resume')}</button>
                    <button className="danger" onClick={onEnd}>{t('inactivity_end')}</button>
                </div>
            </div>
        </div>
    );
}
