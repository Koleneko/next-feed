import {
  checkTokenUniqueness,
  UniquenessCheckArgs,
} from "services/unique.service";
import { UseFormReturn, UseFormTrigger } from "react-hook-form/dist/types/form";
import { useState } from "react";

enum Availability {
  Available,
  Unavailable,
  Processing,
  Unknown,
}

const useUniqueCheck = <T extends UseFormTrigger<any>>(
  token: UniquenessCheckArgs,
  inputToWatch: string,
  trigger: T
) => {
  const [icon, setIcon] = useState<Availability>(Availability.Unknown);
  const [isUnique, setIsUnique] = useState<boolean>(false);

  const tokenIsValid = trigger(inputToWatch).then((r) => r);
  setIcon(Availability.Processing);
  if (!tokenIsValid) {
    setIcon(Availability.Unavailable);
    return [icon];
  }
  checkTokenUniqueness(token).then((r) => setIsUnique(r));
  if (!isUnique) {
    setIcon(Availability.Unavailable);
  }
  setIcon(Availability.Available);

  return [isUnique, icon];
};

export default useUniqueCheck;
