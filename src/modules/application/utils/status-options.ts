import { StateEnum } from '@shared';
import i18n from '@/i18n';

export function getStatusFormOptions(exclude: string[] | undefined = undefined) {
  const stateOptions = {} as any;

  Object.keys(StateEnum).forEach((s: string) => {
    if (!exclude?.includes(s)) {
      stateOptions[s] = i18n.t(`enum.state.${s.toLowerCase()}`);
    }
  });

  return stateOptions;
}
