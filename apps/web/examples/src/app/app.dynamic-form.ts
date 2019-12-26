import { MATERIAL_COMPONENT_MAP } from '@uqt/common/dynamic-form-material-components';
import { CustomUsernameComponent } from '@uqt/web/common/ui/auth';
import { defaultErrorMessages } from '@uqt/data-access/dynamic-form';

export const APP_COMPONENTS = {
  ...MATERIAL_COMPONENT_MAP,
  USERNAME: CustomUsernameComponent
};

export const APP_ERRORS = {
  ...defaultErrorMessages,
  missMatchPasswords: 'Passwords do not match',
  doesNotMeetRequirements: 'does note satisfy requirements'
};