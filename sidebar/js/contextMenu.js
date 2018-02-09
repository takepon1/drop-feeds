/*jshint -W097, esversion: 6, devel: true, nomen: true, indent: 2, maxerr: 50 , browser: true, bitwise: true*/ /*jslint plusplus: true */
//---------------------------------------------------------------------- 
function addEventListenerContextMenus() {
  addEventListener('main', 'click', mainOnClickedEvent);  
  addEventListener('ctxMnCheckFeeds', 'click', checkFeedsMenuClicked);
  addEventListener('ctxMnMarkAllasRead', 'click', markAllFeedsAsReadMenuClicked);
  addEventListener('ctxMnMarkAllasUpdated', 'click', markAllFeedsAsUpdatedMenuClicked);
  addEventListener('ctxMnOpenAllUpdated', 'click', openAllUpdatedFeedsMenuClicked);
}
//---------------------------------------------------------------------- 
function contextMenusOnClickedEvent(event){
  event.stopPropagation();
  event.preventDefault();
  let elcontent = document.getElementById('content');
  let elContextMenu = document.getElementById('contextMenuId');
  let idComeFrom = event.currentTarget.getAttribute('id');
/*
let lblId = 'lbl-' + idComeFrom.substring(3);
let elLbl = document.getElementById(lblId);
console.log('label:', elLbl.innerHTML);
*/
  elContextMenu.setAttribute('comeFrom', idComeFrom);  
  elContextMenu.classList.add('show');
  let x  = Math.max(0, elcontent.offsetWidth - elContextMenu.offsetWidth - 36);
  x = Math.min(x, event.clientX);  
  elContextMenu.style.left = x + 'px';
  elContextMenu.style.top = event.clientY + 'px';
}
//---------------------------------------------------------------------- 
function mainOnClickedEvent(event){
  document.getElementById('contextMenuId').classList.remove('show');
}
//----------------------------------------------------------------------
async function checkFeedsMenuClicked(event) {
  elContextMenu = document.getElementById('contextMenuId');
  elContextMenu.classList.remove('show');
  let idComeFrom = elContextMenu.getAttribute('comeFrom');
  checkFeedsForFolderAsync(idComeFrom);
}
//----------------------------------------------------------------------
async function openAllUpdatedFeedsMenuClicked(event) {
  elContextMenu = document.getElementById('contextMenuId');
  elContextMenu.classList.remove('show');
  let idComeFrom = elContextMenu.getAttribute('comeFrom');
  OpenAllUpdatedFeedsAsync(idComeFrom);
}
//----------------------------------------------------------------------
async function markAllFeedsAsReadMenuClicked(event) {
  elContextMenu = document.getElementById('contextMenuId');
  elContextMenu.classList.remove('show');
  let idComeFrom = elContextMenu.getAttribute('comeFrom');
  MarkAllFeedsAsReadAsync(idComeFrom);
}
//----------------------------------------------------------------------
async function markAllFeedsAsUpdatedMenuClicked(event) {
  elContextMenu = document.getElementById('contextMenuId');
  elContextMenu.classList.remove('show');
  let idComeFrom = elContextMenu.getAttribute('comeFrom');
  MarkAllFeedsAsUpdatedAsync(idComeFrom);
}
//----------------------------------------------------------------------