import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { ComponentNavComponent } from './components/component-nav/component-nav.component';
import { EmptyListComponent } from './components/empty-list/empty-list.component';

import { ToDatePipe } from './pipes/to-date.pipe';

@NgModule({
    declarations: [ComponentNavComponent, EmptyListComponent, ToDatePipe],
    exports: [
        CommonModule,
        RouterModule,
        // Components
        ComponentNavComponent,
        EmptyListComponent,
        ToDatePipe
    ],
    imports: [
        CommonModule,
        RouterModule
    ],
    providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class SharedModule { }
