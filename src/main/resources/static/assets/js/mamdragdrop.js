function TMamDragDropTable(){
  //設定
  this.canCtrlDropCopy=true;   //Ctrl+Dropで行コピーするか
  this.canAltClickDelete=true; //Alt+Clickで行削除するか

  this.dragElm=null;
  //初期設定
  this.init=function(){
    //スタイルシートの登録
    let style=document.createElement("style");
    document.head.appendChild(style);
    style.sheet.insertRule(
      'table.mam_dragdrop{border-collapse:collapse;border:none;border-spacing:0;table-layout:auto;}'
      ,0
    );
    style.sheet.insertRule(
      'table.mam_dragdrop>tbody>tr{border:none;cursor:pointer;}'
      ,0
    );
    style.sheet.insertRule(
      'table.mam_dragdrop>thead>tr>th{background:#48F;border:solid 1px #bbb;color:#fff;margin:0;padding:4px;}'
      ,0
    );
    style.sheet.insertRule(
      'table.mam_dragdrop>tbody>tr>td{background:#FFF;border:solid 1px #bbb;color:#000;margin:0;padding:4px;}'
      ,0
    );
    let elms=document.querySelectorAll("table.mam_dragdrop>tbody>tr");
    for(let i=0;i<elms.length;i++){
      this.enableDrag(elms[i]);
    }
  }
  //trタグの設定
  this.enableDrag=function(elm){
    elm.setAttribute("draggable",true);
    elm.addEventListener("dragstart",function(event){
      if(event.ctrlKey && this.canCtrlDropCopy){
        event.dataTransfer.dropEffect="copy";
      }else{
        event.dataTransfer.dropEffect="move";
      }
      this.dragElm=event.target;
    }.bind(this));
    elm.addEventListener("dragover",function(event){
      event.preventDefault();
      if(event.ctrlKey && this.canCtrlDropCopy){
        event.dataTransfer.dropEffect="copy";
      }else{
        event.dataTransfer.dropEffect="move";
      }
    }.bind(this));
    elm.addEventListener("drop",function(event){
      if(event.ctrlKey && this.canCtrlDropCopy){
        let newElm=this.dragElm.cloneNode(true);
        this.enableDrag(newElm);
        //ドロップ先の<tr>の上にコピーします
        event.target.parentNode.parentNode.insertBefore(newElm,event.target.parentNode);
      }else{
        //ドロップ先の<tr>の上に移動します
        event.target.parentNode.parentNode.insertBefore(this.dragElm,event.target.parentNode);
      }
    }.bind(this));
    elm.addEventListener("click",function(event){
      if(event.altKey && this.canAltClickDelete){
        let a=[];
        for(let i=0;i<event.target.parentNode.children.length;i++){
          a.push(event.target.parentNode.children[i].style.backgroundColor);
          event.target.parentNode.children[i].style.backgroundColor="red";
        }
        setTimeout(function(a,tgt){
          if(confirm("この行を削除してもよろしいですか？")){
            tgt.parentNode.parentNode.removeChild(tgt.parentNode);
          }else{
            for(let i=0;i<tgt.parentNode.children.length;i++){
              tgt.parentNode.children[i].style.backgroundColor=a[i];
            }
          }
        }.bind(this),1,a,event.target);
      }
    }.bind(this));
  }
  this.init();
}
window.addEventListener("DOMContentLoaded",function(){
  let mamDragDropTable=new TMamDragDropTable();
});
