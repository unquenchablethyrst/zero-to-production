import { createFeatureSelector, createSelector } from '@ngrx/store';

import { DynamicFormState } from './dynamic-form.reducer';

const selectDynamicFormState = createFeatureSelector<DynamicFormState>(
  'dynoForm'
);

export const selectStructure = createSelector(
  selectDynamicFormState,
  (state: DynamicFormState) => state.structure
);
export const selectData = createSelector(
  selectDynamicFormState,
  (state: DynamicFormState) => state.data
);
export const isValid = createSelector(
  selectDynamicFormState,
  (state: DynamicFormState) => state.valid
);
export const selectErrors = createSelector(
  selectDynamicFormState,
  (state: DynamicFormState) => state.errors
);
export const selectTouchedForm = createSelector(
  selectDynamicFormState,
  (state: DynamicFormState) => state.touched
);
export const selectFormIdx = createSelector(
  selectDynamicFormState,
  state => state.index
);

export const selectFormConfig = createSelector(
  selectDynamicFormState,
  state => state.config
);
