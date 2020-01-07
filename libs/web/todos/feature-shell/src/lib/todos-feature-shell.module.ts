import { NgModule } from '@angular/core';
import { TodosDataAccessModule } from '@uqt/todos/data-access';
import { AllTodosModule } from '@uqt/todos/all-todos';
import { TodosDetailModule } from '@uqt/todos/todo-detail';
import { SharedFloatingMenuModule } from '@uqt/shared/floating-menu';
import { CommonUiToolbarModule } from '@uqt/common/ui/toolbar';
import { CommonUiSideNavModule } from '@uqt/common/ui/side-nav';
import { CommonUiLayoutsModule } from '@uqt/common/ui/layouts';
import { DynamicFormModule } from '@uqt/data-access/dynamic-form';
import { TodosFeatureShellRoutingModule } from './todos-feature-shell-routing.module';
import { TodoFeatureShellComponent } from './todos-feature-shell.component';
import { TodoLayoutComponent } from './ui/todos-layout.component';
import { WebCommonUiAuthModule } from '@uqt/web/common/ui/auth';
import { CommonNotificationModule } from '@uqt/utils/notifications';

@NgModule({
  declarations: [TodoFeatureShellComponent, TodoLayoutComponent],
  imports: [
    TodosDataAccessModule,
    AllTodosModule,
    TodosDetailModule,
    DynamicFormModule.forChild(),
    CommonUiSideNavModule,
    CommonUiToolbarModule,
    CommonNotificationModule,
    TodosFeatureShellRoutingModule,
    SharedFloatingMenuModule,
    CommonUiLayoutsModule,
    WebCommonUiAuthModule
  ]
})
export class TodosFeatureShellModule {}
