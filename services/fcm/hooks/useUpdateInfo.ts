import {useMutation} from '@tanstack/react-query';
import {UpdateInfoPayload} from '../type';
import infoService from '..';

export function useUpdateInfo() {
  return useMutation({
    mutationFn: (command: UpdateInfoPayload) => {
      return infoService.updateInfo(command);
    },
  });
}
