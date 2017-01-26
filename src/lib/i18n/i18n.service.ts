/**
 * i18n Service
 */

import { Injectable } from '@angular/core';

import { Translation } from './translation.model';


@Injectable()
export class I18nService {

  // language code
  private lang: string = 'zh-CN';

  constructor(
    private translation: Translation
  ) { }

  /**
   * Set user language
   */
  setLang(lang: string) {
    this.lang = lang;
  }

  /**
   * Get translated result
   */
  trans(key: string): string {
    const item = this.translation[key];
    const result: string = item ? item[this.lang] : '';

    return result || '';
  }
}
