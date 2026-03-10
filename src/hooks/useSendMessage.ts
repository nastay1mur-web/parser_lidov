import { useState, useCallback } from "react";
import type { Lead } from "@/types/lead";

interface UseSendMessageReturn {
  selectedLead: Lead | null;
  isOpen: boolean;
  openModal: (lead: Lead) => void;
  closeModal: () => void;
}

/**
 * Хук для управления состоянием модального окна SendMessageModal.
 *
 * Использование:
 *   const { selectedLead, isOpen, openModal, closeModal } = useSendMessage();
 *
 *   // В JSX карточки/строки лида:
 *   <Button onClick={() => openModal(lead)}>Написать</Button>
 *
 *   // В конце JSX компонента-родителя:
 *   <SendMessageModal lead={selectedLead} open={isOpen} onClose={closeModal} />
 */
export function useSendMessage(): UseSendMessageReturn {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const openModal = useCallback((lead: Lead) => {
    setSelectedLead(lead);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedLead(null);
  }, []);

  return {
    selectedLead,
    isOpen: selectedLead !== null,
    openModal,
    closeModal,
  };
}
