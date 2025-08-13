export type SectionProps = {
  title: string;
  items: string[];
  icon: React.ReactNode;
  defaultExpanded?: boolean;
  isLast?: boolean;
}

export type RegulationsProps = {
  categoryName: string;
  onShowReservations: () => void;
  onReserve: () => void;
  onBackHome?: () => void;

  /** Reusability props */
  headerTitle?: string;
  headerSubtitle?: string;
  policiesTitle?: string;
};
