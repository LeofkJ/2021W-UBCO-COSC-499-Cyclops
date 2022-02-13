import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'page-space-la',
    loadChildren: () => import('./page-space-la/page-space-la.module').then( m => m.PageSpaceLaPageModule)
  },
  {
    path: 'page-space-er',
    loadChildren: () => import('./page-space-er/page-space-er.module').then( m => m.PageSpaceErPageModule)
  },
  {
    path: 'page-space-su',
    loadChildren: () => import('./page-space-su/page-space-su.module').then( m => m.PageSpaceSuPageModule)
  },
  {
    path: 'page-space-me',
    loadChildren: () => import('./page-space-me/page-space-me.module').then( m => m.PageSpaceMePageModule)
  },
  {
    path: 'tabs/page-space-me/:docId',
    loadChildren: () => import('./page-space-me/page-space-me.module').then( m => m.PageSpaceMePageModule)
  },
  {
    path: 'tabs/TextEdit/:docId',
    // different from the id we had before, this new docId is from FireStore
    loadChildren: () => import('./editing-tool-test-page/editing-tool-test-page.module').then( m => m.EditingToolTestPagePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./authentication/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registration',
    loadChildren: () => import('./authentication/registration/registration.module').then( m => m.RegistrationPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./authentication/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registration',
    loadChildren: () => import('./authentication/registration/registration.module').then( m => m.RegistrationPageModule)
  },
  {
    path: 'TextEdit',
    loadChildren: () => import('./editing-tool-test-page/editing-tool-test-page.module').then( m => m.EditingToolTestPagePageModule)
  },
  {
    path: 'add-data',
    loadChildren: () => import('./add-data/add-data.module').then( m => m.AddDataPageModule)
  },
  {
    path: 'verify-email',
    loadChildren: () => import('./authentication/verify-email/verify-email.module').then( m => m.VerifyEmailPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./authentication/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },  {
    path: 'user-profile',
    loadChildren: () => import('./authentication/user-profile/user-profile.module').then( m => m.UserProfilePageModule)
  }




];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
