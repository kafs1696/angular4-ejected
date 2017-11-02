import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { platformBrowser } from '@angular/platform-browser';

// noinspection Annotator
import { AppModuleNgFactory } from '../aot/src/app/app.module.ngfactory';

if (environment.production) {
  enableProdMode();
}

platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);
