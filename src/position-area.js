/*
 * Copyright © HatioLab Inc. All rights reserved.
 */

const NATURE = {
  mutable: false,
  resizable: true,
  rotatable: true,
  properties : [{
    type: 'number',
    label: 'x',
    name: 'x',
    value: 0
  },{
    type: 'number',
    label: 'y',
    name: 'y',
    value: 0
  }]
}

import { Component, ValueHolder, RectPath, Shape, error } from '@hatiolab/things-scene';

export default class PositionArea extends ValueHolder(RectPath(Shape)) {

  static get nature() {
    return NATURE;
  }

  dispose() {
    super.dispose();
  }

  onchangeData(data){
    // 현재 컴포넌트의 0,0의 위치
    let stdLat =this.bounds.left;
    let stdLng = this.bounds.top;
    // 셀 한칸 크기
    let cellWidth = (this.bounds.width/this.get('x'));
    let cellHeight = (this.bounds.height/this.get('y'));
    
    data.data.forEach(obj=>{
      var target = this.root.findById(obj.id);
      target.bounds= {...target.bounds,left: (cellWidth*obj.x)+stdLat, top: (cellHeight*obj.y)+stdLng};
    })
  }

  render(context) {
    var {
      top,
      left,
      height,
      width,
      backgroundColor = 'transparent',
      reverse
    } = this.model;

    this.animOnValueChange(this.value);

    // background의 색상
    context.beginPath();
    context.rect(left, top, width, height);

    context.fillStyle = backgroundColor;
    context.fill();

    // value의 색상
    context.beginPath();

    var drawValue = width - width * Math.max(Math.min(this.animValue, 100), 0) / 100;
    drawValue = Math.max(Math.min(drawValue, width), 0);

    context.rect(left + drawValue, top, width - drawValue, height);

    this.drawFill(context);

    context.closePath();

    context.beginPath();

    context.rect(left, top, width, height);
  }

  postrender(context) {
    this.drawStroke(context);
    this.drawText(context);
  }

  get controls() {}
}

Component.register('position-area', PositionArea);
