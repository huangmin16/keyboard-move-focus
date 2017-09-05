import $ from "jquery"


let currentFocus; //当前焦点
let nextFocus; //下个焦点
let currentKeyCode //当前键值
let notFoundBrotherNode = false //当前焦点是否有兄弟元素
let keydownValue = {
  "leftKey": 37,
  "rightKey": 39,
  "upKey": 38,
  "downKey": 40,
  "enterKey": 13
}
let canFocusNodeMap = ['INPUT', 'BUTTON', 'SELECT', 'A', 'TEXTAREA'];
let InputType = ["radio", "button", "checkbox"]
class SwitchFocus {
  //主入口 绑定特定keydown事件
  focus() {
    document.addEventListener("keydown", (event) => {
      event = event || window.event
      currentKeyCode = event.keyCode;
      for (let key in keydownValue) {
        if (currentKeyCode === keydownValue[key]) {
          console.log("当前按键为：" + currentKeyCode);
          this.solveKeydown(currentKeyCode, event);
          break;
        }
      }
    }, false)
  }
  solveKeydown(keyCode, event) {
    event.stopPropagation()
    //获取当前焦点
    currentFocus = document.activeElement;
    if (currentKeyCode == keydownValue.enterKey) { //enter  
      if (!!currentFocus.getAttribute("data-isClick")) {
        currentFocus.click();
        console.log("执行click事件")
      } else if (!!currentFocus.getAttribute("data-isKeydown")) {
        console.log("执行keydown事件")
        //是否是enter事件?
      } else {
        this.findNextFocusEnterNode(currentFocus)
        // console.log(currentFocus.nextElementSibling)
      }
    } else if (currentKeyCode == keydownValue.leftKey) { //zuo
      if (currentFocus.nodeName == 'INPUT') {
        if (currentFocus.getAttribute('type') == 'text' || currentFocus.getAttribute('type') == 'password'|| currentFocus.getAttribute('type') == null) {
            console.log(111)
        } else {
          event.preventDefault();
          this.findLastFocusNode(currentFocus)
        }
      }
    } else if (currentKeyCode == keydownValue.upKey) { //shang
      event.preventDefault();
      this.findLastFocusNode(currentFocus)
    } else if (currentKeyCode == keydownValue.rightKey) { //you
        if (currentFocus.nodeName == 'INPUT') {
            if (currentFocus.getAttribute('type') == 'text' || currentFocus.getAttribute('type') == 'password'|| currentFocus.getAttribute('type') == null) {
                console.log(111)
            } else {
              event.preventDefault();
              this.findNextFocusNode(currentFocus)
            }
          }
    } else if (currentKeyCode == keydownValue.downKey) { //xia
      if (currentFocus.nodeName == canFocusNodeMap[2]) {

      } else {
        event.preventDefault();
        this.findNextFocusNode(currentFocus)
      }
    }
  }

  findNextFocusEnterNode(dom) {
    if (dom.nodeName == "INPUT") {
      if (InputType.includes(dom.getAttribute('type'))) {
        dom.click()
        return
      }
    } else if (dom.nodeName == "BUTTON") {
      dom.click()
      return
    } else if (dom.nodeName == "A") {
      dom.click()
      return
    } else if (dom.nodeName == "SELECT") {
      dom.click()
      return
    } else if (!!dom.getAttribute("data-isclick")) {
      dom.click()
      return
    } else if (!!dom.getAttribute("data-iskeydown")) {

      return
    }
    let node = this.findNextNode(dom)
    if (node && canFocusNodeMap.includes(node.nodeName)) {
      node.focus()
      return
    }
    if (!!node.getAttribute("data-isclick")) {
      node.setAttribute("tabindex", '0')
      node.focus()
      return
    }
    if (!!node.getAttribute("data-iskeydown")) {
      node.setAttribute("tabindex", '0')
      node.focus()
      return
    }
    let treeWalker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT, null, false)



    let child = treeWalker.nextNode();
    while (child != null) {
      if (child && canFocusNodeMap.includes(child.nodeName)) {
        child.focus()
        return
      }
      if (!!child.getAttribute("data-isclick")) {
        child.setAttribute("tabindex", '0')
        child.focus()
        return
      }
      if (!!child.getAttribute("data-iskeydown")) {
        child.setAttribute("tabindex", '0')
        child.focus()
        return
      }
      child = treeWalker.nextNode();
    }
    this.findNextFocusEnterNode(node)
  }
  // 
  findNextNode(node) {
    if (node && node.nodeName === 'BODY') {
      return node
    }

    if (node && node.nextElementSibling) {
      return node.nextElementSibling
    }

    if (node && node.parentNode.nextElementSibling) {
      return node.parentNode.nextElementSibling
    }

    if (node && node.parentNode) {
      return this.findNextNode(node.parentNode)
    }
  }
  findNextFocusNode(dom) {
    let node = this.findNextNode(dom)
    if (node && canFocusNodeMap.includes(node.nodeName)) {
      node.focus()
      return
    }
    let treeWalker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT, null, false)

    let child = treeWalker.nextNode();
    while (child != null) {
      if (child && canFocusNodeMap.includes(child.nodeName)) {
        child.focus()
        return
      }
      child = treeWalker.nextNode();
    }
    this.findNextFocusNode(node)
  }
  findLastFocusNode(dom) {
    let node = this.findLastNode(dom)
    if (node.nodeName == 'BODY') {
      return
    }
    this.lastfoward(node)
    if (document.activeElement == currentFocus) {
      this.findLastFocusNode(node)
    }
  }
  lastfoward(dom) {
    if (canFocusNodeMap.includes(dom.nodeName)) {
      dom.focus()
      return
    }
    if (dom.hasChildNodes) {
      let childNode = dom.childNodes
      console.log(childNode)
      for (let i = childNode.length - 1; i >= 0; i--) {
        if (childNode[i].nodeType == 1) {
          if (canFocusNodeMap.includes(childNode[i].nodeName)) {
            childNode[i].focus()
            return
          } else if (childNode[i].hasChildNodes) {
            return this.lastfoward(childNode[i])
          }
        }
      }
    }
  }
  findLastNode(node) {
    if (node && (node.nodeName === 'BODY' || node.nodeName == 'HEAD' || node.nodeName == 'SCRIPT')) {
      return document.body
    }

    if (node && node.previousElementSibling) {
      return node.previousElementSibling
    }

    if (node.parentNode && node.parentNode.previousElementSibling) {
      return node.parentNode.previousElementSibling
    }

    if (node && node.parentNode) {
      return this.findLastNode(node.parentNode)
    }
  }
}
export default new SwitchFocus()
