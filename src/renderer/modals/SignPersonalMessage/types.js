// @flow
import type { TFunction } from "react-i18next";
import type { Step } from "~/renderer/components/Stepper";
import type { MessageData } from "@ledgerhq/live-common/lib/hw/signMessage/types";
import type { Account } from "@ledgerhq/live-common/lib/types";

export type StepId = "summary" | "sign";

export type StepProps = {
  t: TFunction,
  transitionTo: string => void,
  account: Account,
  error: *,
  message: MessageData,
  onConfirmationHandler: Function,
  onFailHandler: Function,
};

export type St = Step<StepId, StepProps>;
