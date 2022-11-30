export const onOpen = () => {
  const menu = DocumentApp.getUi()
    .createMenu('My Sample React Project') // edit me!
    .addItem('About me', 'openAboutSidebar');

  menu.addToUi();
};

export const openAboutSidebar = () => {
  const html = HtmlService.createHtmlOutputFromFile('sidebar-about-page');
  DocumentApp.getUi().showSidebar(html);
};
