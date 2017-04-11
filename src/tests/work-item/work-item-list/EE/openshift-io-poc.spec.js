/**
 * POC test for automated UI tests for openshift.io
 *  
 * Note on screen resolutions - See: http://www.itunesextractor.com/iphone-ipad-resolution.html
 * Tests will be run on these resolutions:
 * - iPhone6s - 375x667
 * - iPad air - 768x1024
 * - Desktop -  1920x1080
 * 
 * beforeEach will set the mode to phone. Any tests requiring a different resolution will must set explicitly. 
 * 
 * @author ldimaggi, nverma
 */

var until = protractor.ExpectedConditions;

var OpenShiftIoStartPage = require('../page-objects/openshift-io-start.page'),
    OpenShiftIoRHDLoginPage = require('../page-objects/openshift-io-RHD-login.page'),
    OpenShiftIoGithubLoginPage = require('../page-objects/openshift-io-github-login.page'),
    OpenShiftIoDashboardPage = require('../page-objects/openshift-io-dashboard.page'),
    OpenShiftIoSpaceHomePage = require('../page-objects/openshift-io-spacehome.page'),
    testSupport = require('../testSupport'),
    constants = require("../constants");

describe('openshift.io End-to-End POC test - Scenario - New user registers', function () {
  var page, items, browserMode;
  var EMAIL_ADDRESS = "badaddress@bad.com";
  var VOUCHER_CODE = "bad voucher code";

  beforeEach(function () {
    testSupport.setBrowserMode('desktop');
    // Failed: Error while waiting for Protractor to sync with the page: "window.getAllAngularTestabilities is not a function"
    // http://stackoverflow.com/questions/38050626/angular-2-with-protractorjs-failed-error-while-waiting-for-protractor-to-sync-w 
    browser.ignoreSynchronization = true;
    page = new OpenShiftIoStartPage();  
  });

  /* Simple test for new user */
//  it('should enable a new user to register', function() {
//
//    page.setEmail (EMAIL_ADDRESS);
//    page.setVoucherCode (VOUCHER_CODE);
//
//    page.clickRegisterButton();
//    expect (page.toastMessage.getText()).toBe("We've placed you on the waitlist! We'll be in touch soon.");
//
//    /* Verify that after registration the user is prevented from registering again */
//    page.clickToastMessageCloseButton();
//    expect (page.registerButton.isEnabled()).toBe(false);
//    expect (page.email.isEnabled()).toBe(false);
//    expect (page.voucherCode.isEnabled()).toBe(false);
//  });

  /* Simple test for registered user */
  it('should enable a registered user to login', function() {
    
    /* Step - on start page, login via github */
    OpenShiftIoRHDLoginPage = page.clickLoginButton();
    OpenShiftIoGithubLoginPage = OpenShiftIoRHDLoginPage.clickGithubLoginButton();
    
    /* Step - on github login page, login */
    OpenShiftIoGithubLoginPage.clickGithubLoginField();
    OpenShiftIoGithubLoginPage.typeGithubLoginField(browser.params.login.user); 

    OpenShiftIoGithubLoginPage.clickGithubPassword();
    OpenShiftIoGithubLoginPage.typeGithubPassword(browser.params.login.password);   
    OpenShiftIoDashboardPage = OpenShiftIoGithubLoginPage.clickGithubLoginButton();

    /* Step - on home page - create new space - embed time in space name to ensure unique space name */
    OpenShiftIoDashboardPage.clickNewSpaceButton();
    var spaceTime = returnTime();
    OpenShiftIoDashboardPage.typeNewSpaceName((spaceTime));
    OpenShiftIoDashboardPage.typeDevProcess("Scenario Driven Planning");
    OpenShiftIoDashboardPage.clickCreateSpaceButton();

    /* Step - in space options dialog, wizard is not working - so sumply cancel */
    OpenShiftIoDashboardPage.clickWizardButton();
    OpenShiftIoDashboardPage.clickCloseButton();

    /* Step - back in home page open the newly created space */
    OpenShiftIoDashboardPage.clickBrowseSpaces();
    OpenShiftIoSpaceHomePage = OpenShiftIoDashboardPage.clickSelectSpace(spaceTime);

    /* Step - in the space home page, verify URL and end the test */
    browser.wait(until.urlContains('https://prod-preview.openshift.io/almusertest1/'+ spaceTime), constants.WAIT);
    browser.wait(until.urlIs('https://prod-preview.openshift.io/almusertest1/'+ spaceTime), constants.WAIT); 
    expect(browser.getCurrentUrl()).toEqual('https://prod-preview.openshift.io/almusertest1/'+ spaceTime);

    /* Step Verify that the Analtical Report page contains the expected UI elements */
    expect(OpenShiftIoSpaceHomePage.displaySpaceName(spaceTime).getText()).toBe(spaceTime);
    expect(OpenShiftIoSpaceHomePage.analyticalReportHeader.getText()).toBe("Analytical Report");
    expect(OpenShiftIoSpaceHomePage.workitemTitle.getText()).toBe("My Work Items");
    expect(OpenShiftIoSpaceHomePage.createWorkitemButton.getText()).toBe("Create a Work Item");
    expect(OpenShiftIoSpaceHomePage.importCodebaseButton.getText()).toBe("Import a Codebase");
  
    /* TODO - Exercise the Plan page actions */ 
//    OpenShiftIoSpaceHomePage.clickHeaderPlan();
//    browser.get('https://prod-preview.openshift.io/almusertest1/' + spaceTime + '/plan');

  });

});

  /* Get system time in seconds since 1970 */
  var returnTime = function () {
    var d = new Date();
    var n = d.getTime();
    console.log ("Creating space: " + n.toString());
    return n.toString();
  }






