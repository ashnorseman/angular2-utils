/**
 * Resource creator
 */

import { Injector } from '@angular/core';
import { Headers, Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { I18nService } from '../i18n/i18n.service';


/**
 * Crud Resource
 */
export class ResourceService {
  private headers: Headers = new Headers({
    'Content-Type': 'application/json'
  });

  protected http: Http;
  protected lang: I18nService;

  protected timeout: number = 20000;
  protected urlPrefix: string = '';

  protected url: string;
  protected tempUrl: string;

  constructor(
    protected injector: Injector
  ) {
    this.http = this.injector.get(Http);
    this.lang = this.injector.get(I18nService);
  }

  /**
   * Delete by id
   */
  deleteById(id, params?: any): Observable<any> {
    return this.sendRequest('delete', `${this.url}/${id}`, params);
  }

  /**
   * Create method
   */
  post(params: any, data?: any): Observable<any> {

    // no params
    if (arguments.length === 1) {
      data = params;
      params = null;
    }

    return this.sendRequest('post', this.url, params, data);
  }

  /**
   * Update method
   */
  updateById(id, params: any, data?: any): Observable<any> {

    // no params
    if (arguments.length === 2) {
      data = params;
      params = null;
    }

    return this.sendRequest('put', `${this.url}/${id}`, params, data);
  }

  /**
   * Query method: returns an object or array
   */
  query(params?: any): Observable<any> {
    return this.sendRequest('get', this.url, params);
  }

  /**
   * Query method: one item
   */
  queryById(id: any, params?: any): Observable<any> {
    return this.sendRequest('get', `${this.url}/${id}`, params);
  }

  // show error message
  protected showErrorMessage(message: string) {
    alert(message);
  }

  // handle unauthorized requests
  protected handleUnauthorized() { }

  // parse response
  protected parseResponse(res) {
    return res.json();
  }

  /**
   * Set all options
   */
  protected setAllActions(options: any) {
    for (let action of Object.keys(options)) {
      this.setAction(action, options[action]);
    }
  }

  /**
   * Create search params
   */
  private createOptions(params?: any): {
    headers: Headers,
    search: URLSearchParams
  } {
    if (!params) { return null; }

    const searchParams = new URLSearchParams();

    for (let key of Object.keys(params)) {
      searchParams.set(key, params[key]);
    }

    return {
      headers: this.headers,
      search: searchParams
    };
  }

  /**
   * Extract data
   */
  private extractData(res: Response) {
    try {
      return this.parseResponse(res);
    } catch (e) {
      return null;
    }
  }

  /**
   * Handle resources error: interceptors here
   */
  private handleError(error: Response | any) {
    let parsedMessage: string;

    if (error && (error.status === 401)) {
      this.handleUnauthorized();
    } else {
      try {
        parsedMessage = error.json().message;
      } catch (e) {
        parsedMessage = error.message;
      }
    }

    this.showErrorMessage(parsedMessage);
    throw Observable.throw(parsedMessage);
  }

  // replace params in url
  // e.g. 'projects/:id', { id: 1 } => 'projects/1'
  private replaceParamsInUrl(url = '', params: any = {}): string {
    return url.replace(/:([^\/]+)/, (match: string, key: string): string => {
      const value = params[key];
      delete params[key];
      return value;
    });
  }

  /**
   * General method
   */
  protected sendRequest(method: string, url: string, params?: any, data?: any): Observable<any> {
    url = this.replaceParamsInUrl(url, params);

    const options = this.createOptions(params);

    if (method === 'get' || method === 'delete') {
      return this.http[method](this.urlPrefix + url, options)
        .timeout(this.timeout)
        .map((res) => {
          return this.extractData(res);
        })
        .catch(this.handleError.bind(this));
    } else {
      return this.http[method](this.urlPrefix + url, data, options)
        .timeout(this.timeout)
        .map((res) => {
          return this.extractData(res);
        })
        .catch(this.handleError.bind(this));
    }
  }

  /**
   * Custom resources requests
   */
  private setAction(action: string, option: any) {
    const method = this[option.method];

    this[action] = function () {
      this.tempUrl = this.url;
      this.url = option.url;
      const result = method.apply(this, arguments);
      this.url = this.tempUrl;
      return result;
    };
  }
}
