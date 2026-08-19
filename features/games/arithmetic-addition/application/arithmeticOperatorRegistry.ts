import type {
  ArithmeticQuestion,
  LearningStage,
  Operator,
  StageId,
} from "../domain/arithmetic.types";
import {
  OPERATOR_LABEL,
  OPERATOR_SYMBOL,
  OPERATOR_VERB,
} from "../domain/operatorMeta";
import {
  ADDITION_STAGES,
  type AdditionStageConfig,
} from "../domain/stages/additionStages";
import {
  DIVISION_STAGES,
  type DivisionStageConfig,
} from "../domain/stages/divisionStages";
import {
  MULTIPLICATION_STAGES,
  type MultiplicationStageConfig,
} from "../domain/stages/multiplicationStages";
import {
  SUBTRACTION_STAGES,
  type SubtractionStageConfig,
} from "../domain/stages/subtractionStages";
import { generateAdditionStageQuestions } from "./use-cases/generateAdditionStageQuestions";
import { generateDivisionQuestions } from "./use-cases/generateDivisionQuestions";
import { generateMultiplicationQuestions } from "./use-cases/generateMultiplicationQuestions";
import { generateSubtractionQuestions } from "./use-cases/generateSubtractionQuestions";
import type { Rng } from "./use-cases/shuffle";

export interface ArithmeticOperatorConfig {
  operator: Operator;
  label: string;
  symbol: string;
  verb: string;
  stages: readonly LearningStage[];
  generateQuestions: (stage: LearningStage, rng?: Rng) => ArithmeticQuestion[];
}

export const ARITHMETIC_OPERATORS: Operator[] = [
  "addition",
  "subtraction",
  "multiplication",
  "division",
];

export const ARITHMETIC_OPERATOR_CONFIGS: Record<
  Operator,
  ArithmeticOperatorConfig
> = {
  addition: {
    operator: "addition",
    label: OPERATOR_LABEL.addition,
    symbol: OPERATOR_SYMBOL.addition,
    verb: OPERATOR_VERB.addition,
    stages: ADDITION_STAGES,
    generateQuestions: (stage, rng) =>
      generateAdditionStageQuestions(stage as AdditionStageConfig, rng),
  },
  subtraction: {
    operator: "subtraction",
    label: OPERATOR_LABEL.subtraction,
    symbol: OPERATOR_SYMBOL.subtraction,
    verb: OPERATOR_VERB.subtraction,
    stages: SUBTRACTION_STAGES,
    generateQuestions: (stage, rng) =>
      generateSubtractionQuestions(stage as SubtractionStageConfig, rng),
  },
  multiplication: {
    operator: "multiplication",
    label: OPERATOR_LABEL.multiplication,
    symbol: OPERATOR_SYMBOL.multiplication,
    verb: OPERATOR_VERB.multiplication,
    stages: MULTIPLICATION_STAGES,
    generateQuestions: (stage, rng) =>
      generateMultiplicationQuestions(stage as MultiplicationStageConfig, rng),
  },
  division: {
    operator: "division",
    label: OPERATOR_LABEL.division,
    symbol: OPERATOR_SYMBOL.division,
    verb: OPERATOR_VERB.division,
    stages: DIVISION_STAGES,
    generateQuestions: (stage, rng) =>
      generateDivisionQuestions(stage as DivisionStageConfig, rng),
  },
};

export function getArithmeticOperatorConfig(
  operator: Operator,
): ArithmeticOperatorConfig {
  return ARITHMETIC_OPERATOR_CONFIGS[operator];
}

export function isArithmeticOperator(value: string): value is Operator {
  return ARITHMETIC_OPERATORS.includes(value as Operator);
}

export function getStagesForOperator(
  operator: Operator,
): readonly LearningStage[] {
  return getArithmeticOperatorConfig(operator).stages;
}

export function getArithmeticStageById(
  stageId: StageId | undefined,
): LearningStage | undefined {
  if (!stageId) return undefined;

  return ARITHMETIC_OPERATORS.flatMap(
    (operator) => ARITHMETIC_OPERATOR_CONFIGS[operator].stages,
  ).find((stage) => stage.id === stageId);
}

export function generateQuestionsForStage(
  stage: LearningStage,
  rng?: Rng,
): ArithmeticQuestion[] {
  return getArithmeticOperatorConfig(stage.operator).generateQuestions(
    stage,
    rng,
  );
}
