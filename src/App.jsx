import React from 'react';
import { ROLES } from './constants';
import { MOTION_TYPES } from './constants/motionTypes';
import { useMeetingState } from './hooks/useMeetingState';
import { useModal } from './hooks/useModal';
import { useHeartbeat } from './hooks/useHeartbeat';
import { getCurrentPendingQuestion } from './engine/motionStack';
import LoginScreen from './components/LoginScreen';
import MeetingView from './components/MeetingView';
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

export default function App() {
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
        handleDeclareNoSecond
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
        closeModal,
        modalData
    } = useModal();

    useHeartbeat(currentUser, isLoggedIn, meetingState, setMeetingState, updateMeetingState);

    if (!isLoggedIn) {
        return <LoginScreen onLogin={handleLogin} />;
    }

    const motionStack = meetingState.motionStack || [];
    const top = getCurrentPendingQuestion(motionStack);

    return (
        <div className="app-container">
            <header className="header">
                <h1>Hatsell</h1>
                <p className="subtitle">Based on Robert's Rules of Order</p>
                <div style={{marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center'}}>
                    <span style={{color: '#666'}}>Logged in as: {currentUser.name} ({currentUser.role})</span>
                    {meetingState.meetingCode && (
                        <span style={{color: '#c0392b'}}>Meeting Code: <strong>{meetingState.meetingCode}</strong></span>
                    )}
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
                onResumeFromSuspendedRules={handleResumeFromSuspendedRules}
                onSuspendedVote={handleSuspendedVote}
                onDeclareNoSecond={handleDeclareNoSecond}
            />

            {/* === MODALS === */}

            {showModal === 'motion' && (
                <MotionModal
                    heading={modalData.heading}
                    initialText={modalData.motionText}
                    showSpecialOptions={modalData.showSpecialOptions}
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
        </div>
    );
}
