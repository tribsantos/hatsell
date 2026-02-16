import React, { useState } from 'react';
import { ROLES } from './constants';
import { MOTION_TYPES } from './constants/motionTypes';
import { useMeetingState } from './hooks/useMeetingState';
import { useModal } from './hooks/useModal';
import { useHeartbeat } from './hooks/useHeartbeat';
import { getCurrentPendingQuestion } from './engine/motionStack';
import LoginScreen from './components/LoginScreen';
import MeetingView from './components/MeetingView';
import AboutPage from './components/AboutPage';
import GeneralSettings from './components/GeneralSettings';
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
import WithdrawMotionModal from './components/modals/WithdrawMotionModal';
import PreChairWithdrawModal from './components/modals/PreChairWithdrawModal';

export default function App() {
    const [activePage, setActivePage] = useState('meeting');
    const [settingsUserName, setSettingsUserName] = useState('');
    const [disclaimerAccepted, setDisclaimerAccepted] = useState(
        () => sessionStorage.getItem('hatsell_disclaimer') === 'true'
    );
    const [disclaimerChecked, setDisclaimerChecked] = useState(false);

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
        handleOrdersOfTheDayResponse
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
        openWithdrawMotionModal,
        openPreChairWithdrawModal,
        closeModal,
        modalData
    } = useModal();

    useHeartbeat(currentUser, isLoggedIn, meetingState, setMeetingState, updateMeetingState);

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
                    <img src="/hatselllogo.png" alt="Hatsell" style={{ maxWidth: '420px', width: '100%' }} />
                    <p className="subtitle">Based on Robert's Rules of Order</p>
                </header>
                <div className="modal-overlay" style={{ position: 'relative', background: 'none', minHeight: '300px' }}>
                    <div className="modal" style={{ maxWidth: '550px' }}>
                        <h3>Disclaimer</h3>
                        <p style={{ lineHeight: '1.7', marginBottom: '1.5rem', color: '#333' }}>
                            Hatsell is a tool to help meetings using a parliamentary authority. It is
                            not supposed to replace them. Any conflict between Hatsell and the chosen
                            parliamentary authority should be decided in favor of the official text.
                        </p>
                        <div style={{
                            border: '1px solid #2980b9',
                            borderRadius: '4px',
                            padding: '1rem 1.25rem',
                            marginBottom: '1.5rem',
                            background: 'rgba(52, 152, 219, 0.06)',
                            fontSize: '0.88rem',
                            color: '#333',
                            lineHeight: '1.6'
                        }}>
                            <strong style={{ color: '#2980b9' }}>Data & Privacy</strong>
                            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem' }}>
                                <li>Meeting data is transmitted via Firebase for real-time sync</li>
                                <li>Organization profiles are stored locally in your browser (not sent to any server)</li>
                                <li>Session data is cleared when the browser tab closes</li>
                                <li>No personal data is collected or shared with third parties</li>
                                <li>Meeting data in Firebase is temporary</li>
                            </ul>
                        </div>

                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            marginBottom: '1.5rem'
                        }}>
                            <input
                                type="checkbox"
                                checked={disclaimerChecked}
                                onChange={(e) => setDisclaimerChecked(e.target.checked)}
                                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                            I agree
                        </label>
                        <button
                            onClick={() => {
                                setDisclaimerAccepted(true);
                                sessionStorage.setItem('hatsell_disclaimer', 'true');
                            }}
                            disabled={!disclaimerChecked}
                        >
                            Continue to Meeting
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const motionStack = meetingState.motionStack || [];
    const top = getCurrentPendingQuestion(motionStack);

    return (
        <div className="app-container">
            <a href="#main-content" className="skip-to-content">Skip to main content</a>
            <header className="header">
                <img src="/hatselllogo.png" alt="Hatsell" style={{ maxWidth: '420px', width: '100%' }} />
                <p className="subtitle">Based on Robert's Rules of Order</p>
                <div style={{marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap'}}>
                    <span style={{color: '#666'}}>Logged in as: {currentUser.name} ({currentUser.role})</span>
                    {meetingState.meetingCode && (
                        <span style={{color: '#c0392b'}}>Meeting Code: <strong>{meetingState.meetingCode}</strong></span>
                    )}
                    <button onClick={() => setActivePage('about')} className="secondary" style={{padding: '0.5rem 1rem'}}>
                        About
                    </button>
                    <button onClick={handleLogout} className="secondary" style={{padding: '0.5rem 1rem'}}>
                        Logout
                    </button>
                    {currentUser.role === ROLES.PRESIDENT && (
                        <button onClick={handleClearMeeting} className="danger" style={{padding: '0.5rem 1rem'}}>
                            Clear Meeting
                        </button>
                    )}
                </div>
            </header>

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
                onRuleOnPointOfOrder={handleRuleOnPointOfOrder}
                updateMeetingState={updateMeetingState}
                addToLog={addToLog}
                setShowModal={setShowModal}
                handleObjectToCorrection={handleObjectToCorrection}
                handleAcceptCorrectionByConsent={handleAcceptCorrectionByConsent}
                onCallVoteOnMinutesCorrection={handleCallVoteOnMinutesCorrection}
                onAcknowledgeAnnouncement={handleAcknowledgeAnnouncement}
                onIncidentalMainMotion={openIncidentalMainModal}
                onIncidentalMotions={openIncidentalMotionsModal}
                // New handlers
                onSubsidiaryMotion={openSubsidiaryMotionModal}
                onPrivilegedMotion={openPrivilegedMotionModal}
                onBringBackMotion={openBringBackModal}
                onParliamentaryInquiry={openParliamentaryInquiryModal}
                onRequestForInfo={openRequestForInfoModal}
                onAppeal={openAppealModal}
                onSuspendRules={openSuspendRulesModal}
                onWithdrawMotion={openWithdrawMotionModal}
                onDivision={handleDivisionOfAssembly}
                onAcceptRequest={handleAcceptRequest}
                onRespondToRequest={handleRespondToRequest}
                onDismissRequest={handleDismissRequest}
                onRuleOnPointOfOrderRequest={handleRuleOnPointOfOrderRequest}
                onResumeFromRecess={handleResumeFromRecess}
                onNewSpeakingList={handleNewSpeakingList}
                onResumePreviousSpeakingList={handleResumePreviousSpeakingList}
                onResumeFromSuspendedRules={handleResumeFromSuspendedRules}
                onSuspendedVote={handleSuspendedVote}
                onDeclareNoSecond={handleDeclareNoSecond}
                onSetQuorum={handleSetQuorum}
                onChairAcceptMotion={handleChairAcceptMotion}
                onChairRejectMotion={handleChairRejectMotion}
                onRecognizePendingMotion={handleRecognizePendingMotion}
                onDismissPendingMotion={handleDismissPendingMotion}
                onPreChairWithdraw={openPreChairWithdrawModal}
                onOrdersOfTheDay={handleOrdersOfTheDay}
                onOrdersOfTheDayResponse={handleOrdersOfTheDayResponse}
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
                            case 'Point of Order':
                                openPointOfOrderModal();
                                break;
                            case 'Parliamentary Inquiry':
                                openParliamentaryInquiryModal();
                                break;
                            case 'Request for Information':
                                openRequestForInfoModal();
                                break;
                            case 'Appeal the Decision of the Chair':
                                openAppealModal();
                                break;
                            case 'Division of the Assembly':
                                handleDivisionOfAssembly();
                                break;
                            case 'Suspend the Rules':
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
                    originalMotion={top?.text || meetingState.currentMotion?.text}
                    onSubmit={(text) => {
                        handleSubmitAmendment(text);
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
                        } else {
                            handleConvertRequestToMotion(motionType, text, metadata);
                        }
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
                        `${meetingState.lastChairRuling.ruling}: ${meetingState.lastChairRuling.concern}` : null}
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
        </div>
    );
}
