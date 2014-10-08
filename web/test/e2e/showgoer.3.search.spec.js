'use strict';

var loginPage = require('../pages/login.page');
var showGoerPage = require('../pages/showgoer.page');
var validFlashBand;

describe('Search ShowGoer View', function () {
  beforeEach(function() {
    loginPage.tryAuthenticateSuccessfully();
    validFlashBand = '053400020b9555';
  });

  it('should contains help message', function() {
    showGoerPage.goToSearchShowGoerPage();

    var pageTitle = element(by.css('h1[translate=\'FLASHBAND.ASSOCIATE.TEXT.TITLE\']'));
    var pageText = element(by.css('p[translate=\'FLASHBAND.ASSOCIATE.TEXT.NEW\']'));
    var pageSearchButton = element(by.css('button[translate=\'FLASHBAND.ASSOCIATE.BUTTON.SEARCH\']'));
    var pageShowGoerSearchInput = element(by.model('showGoerSearch'));
    var pageCancelButton = element(by.css('a[translate=\'FLASHBAND.ASSOCIATE.BUTTON.CANCEL\']'));
    var pageAssociateButton = element(by.css('button[translate=\'FLASHBAND.ASSOCIATE.BUTTON.ASSOCIATE\']'));
    var msgNewShowGoer = element(by.className('new-showgoer-message'));

    expect(msgNewShowGoer.isDisplayed()).toBeFalsy();
    expect(pageTitle.isDisplayed()).toBeTruthy();
    expect(pageText.isDisplayed()).toBeTruthy();
    expect(pageCancelButton.isDisplayed()).toBeTruthy();
    expect(pageSearchButton.isDisplayed()).toBeTruthy();
    expect(pageShowGoerSearchInput.isDisplayed()).toBeTruthy();
    expect(pageAssociateButton.isDisplayed()).toBeTruthy();

    expect(pageTitle.getText()).toBe('Vincular ShowGoer');
    expect(pageText.getText()).toBe('Para vincular um ShowGoer a uma pulseira, basta buscar pelo nome ou número do documento cadastrado. Depois é só clicar em vincular e aproximar a pulseira do leitor.');
    expect(pageSearchButton.getText()).toBe('buscar');
    expect(pageCancelButton.getText()).toBe('Cancelar');
    expect(pageAssociateButton.getText()).toBe('Vincular');
  });

  it('should find by name ShowGoer before associating', function() {
    var showGoerName = 'ShowGoer com CPF para Vinculação';
    var showGoerCPF = '999.000.222-22';

    showGoerPage.goToNewShowGoerPage();
    showGoerPage.saveNewShowGoerWithCPF(showGoerName, showGoerCPF);
    showGoerPage.goToSearchShowGoerPage();
    showGoerPage.searchShowGoer(showGoerName);

    var trShowGoer = element(by.repeater('sg in listShowgoers').row(0));
    var elShowGoerName = trShowGoer.element(by.binding('sg.name'));
    var elShowGoerDocType = trShowGoer.element(by.binding('sg.docType'));
    var elShowGoerDocNumber = trShowGoer.element(by.binding('sg.docNumber'));

    expect(elShowGoerName.getText()).toBe(showGoerName);
    expect(elShowGoerDocType.getText()).toBe('CPF');
    expect(elShowGoerDocNumber.getText()).toBe(showGoerCPF);
  });

  it('should redirect to view associate after selecting user', function() {
    var showGoerName = 'Showoger com RG para Vinculação';
    var showGoerRG = '555.777.111-33';

    showGoerPage.goToNewShowGoerPage();
    showGoerPage.saveNewShowGoerWithRG(showGoerName, showGoerRG);
    showGoerPage.goToSearchShowGoerPage();
    showGoerPage.searchShowGoer(showGoerName);
    showGoerPage.selectFirstShowGoer().getAttribute('value').then(function(showGoerId) {
      showGoerPage.saveAssociationWithFlashBand(validFlashBand);

      expect(browser.getCurrentUrl()).toContain('#/showgoer/'.concat(showGoerId, '/associate'));

      var msg = element(by.className('alert-success'));
      expect(msg.isDisplayed()).toBeTruthy();
      expect(msg.getText()).toBe('ShowGoer vinculado com sucesso.');
    });
  });

  it('should reject associations already associated to ShowGoer.', function () {
    var showGoerName = 'Showoger com carteira de motorista para Vinculação';
    var showGoerCNH = '555.444.222.111';

    showGoerPage.goToNewShowGoerPage();
    showGoerPage.saveNewShowGoerWithCNH(showGoerName, showGoerCNH);
    showGoerPage.goToSearchShowGoerPage();
    showGoerPage.searchShowGoer(showGoerName);
    showGoerPage.selectFirstShowGoer();
    showGoerPage.saveAssociationWithFlashBand(validFlashBand);

    showGoerPage.goToSearchShowGoerPage();
    showGoerPage.searchShowGoer(showGoerName);
    showGoerPage.selectFirstShowGoer();

    var msg = element(by.className('alert-warning'));
    expect(msg.isDisplayed()).toBeTruthy();
    expect(msg.getText()).toBe('Opa, esse ShowGoer já foi vinculado a uma pulseira.');
  });

  it('should view message of new ShowGoer when not found for association', function() {
    showGoerPage.goToSearchShowGoerPage();
    showGoerPage.searchShowGoer("Invalid showgoer");

    var msgNewShowGoer = element(by.className('new-showgoer-message'));
    expect(msgNewShowGoer.isDisplayed()).toBeTruthy();
    expect(msgNewShowGoer.getText()).toContain('Não existem visitantes cadastrados com esse nome ou documento.');

    var linkNewShowGoer = element(by.css('a[ui-sref=\'showgoer-new\']'));
    linkNewShowGoer.click();
    browser.waitForAngular();

    expect(browser.getCurrentUrl()).toContain('#/showgoer/new');
  });

  it ('should show a message when flashband is blocked.', function() {
    var showGoerName = 'Showoger para Vinculação de pulseira bloqueada';
    var showGoerCNH = '777.555.222.111';
    var blockedFlashBand = '053400020b9349';

    showGoerPage.goToNewShowGoerPage();
    showGoerPage.saveNewShowGoerWithCNH(showGoerName, showGoerCNH);
    showGoerPage.goToSearchShowGoerPage();
    showGoerPage.searchShowGoer(showGoerName);
    showGoerPage.selectFirstShowGoer();
    showGoerPage.saveAssociationWithFlashBand(blockedFlashBand);

    var msg = element(by.className('alert-warning'));
    expect(msg.isDisplayed()).toBeTruthy();
    expect(msg.getText()).toBe('Opa, essa flashband está bloqueada. Utilize outra flashband para fazer vinculação.');
  });
});
