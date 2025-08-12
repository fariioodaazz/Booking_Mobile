import React from 'react';
import styled from 'styled-components/native';
import CheckIcon from '../../../assets/CheckIcon';

// Types
export interface ProgressStepData {
  number: number;
  completed?: boolean;
  active?: boolean;
}

export interface ProgressIndicatorProps {
  steps: ProgressStepData[];
  className?: string;
  style?: any;
}

// Styled Components
const ProgressContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
  margin-top: 20px;
`;

const ProgressStep = styled.View<{ active?: boolean; completed?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
  background-color: ${(props: { active?: boolean; completed?: boolean }) => {
    if (props.active) return '#007AFF';
    if (props.completed) return '#007AFF';
    return '#e5e7eb';
  }};
`;

const ProgressStepText = styled.Text<{ active?: boolean; completed?: boolean }>`
  font-size: 14px;
  font-weight: 500;
  color: ${(props: { active?: boolean; completed?: boolean }) => {
    if (props.active || props.completed) return '#ffffff';
    return '#9ca3af';
  }};
`;

const ProgressLine = styled.View<{ active?: boolean }>`
  flex: 1;
  height: 2px;
  background-color: ${(props: { active?: boolean }) => props.active ? '#007AFF' : '#007AFF40'};
`;

// Individual Step Component
interface ProgressStepContentProps {
  number: number;
  active?: boolean;
  completed?: boolean;
}

const ProgressStepContent: React.FC<ProgressStepContentProps> = ({ 
  number, 
  active, 
  completed 
}) => {
  return (
    <ProgressStep active={active} completed={completed}>
      {completed ? (
        <CheckIcon size={16} color="#ffffff" />
      ) : (
        <ProgressStepText active={active} completed={completed}>
          {number}
        </ProgressStepText>
      )}
    </ProgressStep>
  );
};

// Main Progress Indicator Component
export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
  steps, 
  style 
}) => {
  const getLineActive = (currentIndex: number): boolean => {
    // Line is active if the current step is completed or if the next step is active/completed
    const currentStep = steps[currentIndex];
    const nextStep = steps[currentIndex + 1];
    
    return currentStep?.completed || nextStep?.active || nextStep?.completed || false;
  };

  return (
    <ProgressContainer style={style}>
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <ProgressStepContent
            number={step.number}
            active={step.active}
            completed={step.completed}
          />
          {/* Don't render line after the last step */}
          {index < steps.length - 1 && (
            <ProgressLine active={getLineActive(index)} />
          )}
        </React.Fragment>
      ))}
    </ProgressContainer>
  );
};

// Helper function to create step data easily
export const createProgressSteps = (
  totalSteps: number,
  currentStep: number,
  completedSteps: number[] = []
): ProgressStepData[] => {
  return Array.from({ length: totalSteps }, (_, index) => {
    const stepNumber = index + 1;
    return {
      number: stepNumber,
      completed: completedSteps.includes(stepNumber),
      active: stepNumber === currentStep && !completedSteps.includes(stepNumber),
    };
  });
};

export default ProgressIndicator;