import { useState } from 'react';

export function useModal() {
    const [showModal, setShowModal] = useState(null);
    const [modalData, setModalData] = useState({});

    const openMotionModal = (opts = {}) => {
        const { motionText = '', heading = 'Introduce a Motion', showSpecialOptions = true } = opts;
        setShowModal('motion');
        setModalData({ motionText, heading, showSpecialOptions });
    };

    const openIncidentalMainModal = () => {
        setShowModal('incidentalMain');
        setModalData({});
    };

    const openIncidentalMotionsModal = () => {
        setShowModal('incidentalMotions');
        setModalData({});
    };

    const openAmendmentModal = () => {
        setShowModal('amendment');
        setModalData({ amendmentText: '' });
    };

    const openPointOfOrderModal = () => {
        setShowModal('pointOfOrder');
        setModalData({ concern: '' });
    };

    // New modal openers
    const openSubsidiaryMotionModal = (motionType) => {
        setShowModal('subsidiaryMotion');
        setModalData({ motionType });
    };

    const openPrivilegedMotionModal = (motionType) => {
        setShowModal('privilegedMotion');
        setModalData({ motionType });
    };

    const openBringBackModal = (motionType) => {
        setShowModal('bringBack');
        setModalData({ motionType });
    };

    const openParliamentaryInquiryModal = () => {
        setShowModal('parliamentaryInquiry');
        setModalData({});
    };

    const openRequestForInfoModal = () => {
        setShowModal('requestForInfo');
        setModalData({});
    };

    const openAppealModal = () => {
        setShowModal('appeal');
        setModalData({});
    };

    const openSuspendRulesModal = () => {
        setShowModal('suspendRules');
        setModalData({});
    };

    const openWithdrawMotionModal = () => {
        setShowModal('withdrawMotion');
        setModalData({});
    };

    const closeModal = () => {
        setShowModal(null);
    };

    return {
        showModal,
        modalData,
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
        closeModal
    };
}
