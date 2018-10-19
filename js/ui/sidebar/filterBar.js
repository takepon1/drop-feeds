/*global TreeView DefaultValues SideBar*/
'use strict';
class FilterBar { /*exported FilterBar*/
  static get instance() { return (this._instance = this._instance || new this()); }

  constructor() {
    this._filterEnabled = DefaultValues.filterEnabled;
  }

  async init_async() {
    document.getElementById('filterField').addEventListener('input', (e) => { this._filterFieldInput_event(e); });
  }

  set enabled(enable) {
    this._filterEnabled = enable;
    document.getElementById('filterBar').style.display = enable ? '' : 'none';
    SideBar.instance.setContentHeight();
    let filterText = enable ? document.getElementById('filterField').value : '';
    this._applyFilter(filterText);
    if (enable) {
      document.getElementById('filterField').focus(); 
    }
  }

  get enabled() {
    return this._filterEnabled;
  }

  _filterFieldInput_event(event) {
    this._applyFilter(event.target.value);
  }

  _applyFilter(filterText) {
    try {
      let rootFolderId =  TreeView.instance.rootFolderUiId;
      let rootFolder = document.getElementById(rootFolderId);
      let feedElementList = [];
      if (filterText == '' ) { 
        feedElementList = [].slice.call(rootFolder.getElementsByTagName('*'));
        feedElementList.map(item => item.style.display = '');
        return; 
      }
      let toHideList = this._contain(rootFolder, 'label, li', filterText, false);
      let toShowLiList = this._contain(rootFolder, 'label, li', filterText, true);
      let toShowLblList = this._contain(rootFolder, 'label', filterText, true);
      toHideList.map(item => item.style.display = 'none');
      toShowLiList.map(item => item.style.display = '');
      toShowLblList.map((item) => { 
        let forId = item.getAttribute('for');
        let toShowLblForList = [].slice.call(rootFolder.querySelectorAll('label[for="' + forId + '"]'));
        toShowLblForList.map(lbl => lbl.style.display = '');
      });
    }
    catch (e) {
      /*eslint-disable no-console*/
      console.log(e);
      /*eslint-enable no-console*/
    }
  }

  _contain(refElement, selector, text, contains) {
    let elements = refElement.querySelectorAll(selector);
    return [].filter.call(elements, (element) => {
      if (contains) {
        return RegExp(text, 'i').test(element.textContent);
      }
      else {
        return ! RegExp(text, 'i').test(element.textContent);
      }
    });    
  }
}
