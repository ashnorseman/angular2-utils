import { Angular2UtilsPage } from './app.po';

describe('angular2-utils App', function() {
  let page: Angular2UtilsPage;

  beforeEach(() => {
    page = new Angular2UtilsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
